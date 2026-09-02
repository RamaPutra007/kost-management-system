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
            return response()->json(Pembayaran::with(['penghuni', 'tagihan'])->where('penghuni_id', $penghuni_id)->paginate(15));
        }

        $this->authorize('viewAny', Pembayaran::class);
        return response()->json(Pembayaran::with(['penghuni', 'tagihan'])->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Pembayaran::class);

        $validated = $request->validate([
            'tagihan_id' => 'required|exists:tagihans,id',
            'nominal_bayar' => 'required|numeric',
            'metode_pembayaran' => 'required|string',
            'bukti_pembayaran' => 'nullable|string',
            'tanggal_bayar' => 'required|date',
            'status_verifikasi' => 'sometimes|in:Pending,Valid,Invalid',
        ]);

        $tagihan = Tagihan::findOrFail($validated['tagihan_id']);
        
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
        }

        return response()->json($pembayaran, 201);
    }

    public function show(Request $request, Pembayaran $pembayaran)
    {
        $this->authorize('view', $pembayaran);
        return response()->json($pembayaran->load(['penghuni', 'tagihan']));
    }

    public function update(Request $request, Pembayaran $pembayaran)
    {
        $this->authorize('update', $pembayaran);

        $validated = $request->validate([
            'nominal_bayar' => 'sometimes|numeric',
            'metode_pembayaran' => 'sometimes|string',
            'bukti_pembayaran' => 'nullable|string',
            'status_verifikasi' => 'sometimes|in:Pending,Valid,Invalid',
        ]);

        $pembayaran->update($validated);

        if (isset($validated['status_verifikasi']) && $validated['status_verifikasi'] === 'Valid') {
            $pembayaran->tagihan->update(['status' => 'Lunas']);
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