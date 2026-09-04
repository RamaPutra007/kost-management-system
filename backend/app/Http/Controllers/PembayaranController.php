<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use App\Models\Tagihan;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            $penghuni_id = $request->user()->penghuni->id ?? null;
            return response()->json(Pembayaran::with(['penghuni.user', 'tagihan.kontrakSewa.kamar'])->where('penghuni_id', $penghuni_id)->paginate(15));
        }

        $this->authorize('viewAny', Pembayaran::class);
        return response()->json(Pembayaran::with(['penghuni.user', 'tagihan.kontrakSewa.kamar'])->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Pembayaran::class);

        $validated = $request->validate([
            'tagihan_id' => 'required|exists:tagihans,id',
            'nominal_bayar' => 'required|numeric',
            'metode_pembayaran' => 'required|string',
            'bukti_pembayaran' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tanggal_bayar' => 'required|date',
            'status_verifikasi' => 'sometimes|in:Pending,Valid,Invalid',
        ]);

        if ($request->hasFile('bukti_pembayaran')) {
            $path = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');
            $validated['bukti_pembayaran'] = '/storage/' . $path;
        }

        $tagihan = Tagihan::with('penghuni.user')->findOrFail($validated['tagihan_id']);
        
        // Ensure user is the owner of the tagihan if they are a Penghuni
        if ($request->user()->role->name === 'Penghuni' && $tagihan->penghuni_id !== $request->user()->penghuni->id) {
            abort(403, 'Unauthorized');
        }

        $validated['penghuni_id'] = $tagihan->penghuni_id;
        $validated['status_verifikasi'] = $request->user()->role->name === 'Penghuni' ? 'Pending' : ($validated['status_verifikasi'] ?? 'Valid');

        $pembayaran = Pembayaran::create($validated);

        // Auto update tagihan if Valid
        if ($validated['status_verifikasi'] === 'Valid') {
            $tagihan->update(['status' => 'Lunas']);
        } elseif ($validated['status_verifikasi'] === 'Pending') {
            $tagihan->update(['status' => 'Menunggu Verifikasi']);
            
            $penghuniName = $tagihan->penghuni->user->name ?? 'Unknown';

            // Send notification to Admin & Owner
            $adminUsers = \App\Models\User::whereHas('role', function($q) {
                $q->whereIn('name', ['Admin', 'Owner']);
            })->get();
            
            foreach ($adminUsers as $admin) {
                \App\Models\Notification::create([
                    'user_id' => $admin->id,
                    'title' => 'Pembayaran Baru',
                    'message' => 'Penghuni ' . $penghuniName . ' telah submit pembayaran. Menunggu verifikasi Anda.',
                    'is_read' => false
                ]);
            }
        }

        return response()->json($pembayaran, 201);
    }

    public function show(Request $request, Pembayaran $pembayaran)
    {
        if ($request->user()->role->name === 'Penghuni' && $pembayaran->penghuni_id !== $request->user()->penghuni->id) {
            abort(403, 'Unauthorized');
        }

        $this->authorize('view', $pembayaran);
        return response()->json($pembayaran->load(['penghuni.user', 'tagihan.kontrakSewa.kamar']));
    }

    public function update(Request $request, Pembayaran $pembayaran)
    {
        $this->authorize('update', $pembayaran);

        $validated = $request->validate([
            'nominal_bayar' => 'sometimes|numeric',
            'metode_pembayaran' => 'sometimes|string',
            'bukti_pembayaran' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status_verifikasi' => 'sometimes|in:Pending,Valid,Invalid',
        ]);

        if ($request->hasFile('bukti_pembayaran')) {
            $path = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');
            $validated['bukti_pembayaran'] = '/storage/' . $path;
        }

        $pembayaran->update($validated);

        if (isset($validated['status_verifikasi']) && $validated['status_verifikasi'] === 'Valid') {
            $pembayaran->tagihan->update(['status' => 'Lunas']);
            
            // Notifikasi untuk Penghuni (Valid)
            if ($pembayaran->penghuni && $pembayaran->penghuni->user_id) {
                \App\Models\Notification::create([
                    'user_id' => $pembayaran->penghuni->user_id,
                    'title' => 'Pembayaran Diterima',
                    'message' => 'Pembayaran Anda sebesar Rp' . number_format($pembayaran->nominal_bayar, 0, ',', '.') . ' telah diverifikasi dan tagihan lunas.',
                    'is_read' => false
                ]);
            }
        } elseif (isset($validated['status_verifikasi']) && $validated['status_verifikasi'] === 'Invalid') {
            // Notifikasi untuk Penghuni (Invalid)
            if ($pembayaran->penghuni && $pembayaran->penghuni->user_id) {
                \App\Models\Notification::create([
                    'user_id' => $pembayaran->penghuni->user_id,
                    'title' => 'Pembayaran Ditolak',
                    'message' => 'Pembayaran Anda sebesar Rp' . number_format($pembayaran->nominal_bayar, 0, ',', '.') . ' ditolak atau tidak valid. Silakan hubungi admin.',
                    'is_read' => false
                ]);
            }
            $pembayaran->tagihan->update(['status' => 'Belum Lunas']);
        }

        return response()->json($pembayaran);
    }

    public function destroy(Request $request, Pembayaran $pembayaran)
    {
        $this->authorize('delete', $pembayaran);
        $pembayaran->delete();
        return response()->json(null, 204);
    }
}