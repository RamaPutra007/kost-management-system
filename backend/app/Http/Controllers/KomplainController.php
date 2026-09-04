<?php

namespace App\Http\Controllers;

use App\Models\Komplain;
use App\Models\User;
use App\Models\Notification;
use App\Models\Kamar;
use Illuminate\Http\Request;

class KomplainController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            $penghuni_id = $request->user()->penghuni->id ?? null;
            return response()->json(Komplain::with(['kamar', 'penghuni'])->where('penghuni_id', $penghuni_id)->orderBy('created_at', 'desc')->get());
        }

        return response()->json(Komplain::with(['kamar', 'penghuni'])->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'foto' => 'nullable|image|max:2048',
        ]);

        $validated['penghuni_id'] = $request->user()->penghuni->id;
        $validated['kamar_id'] = $request->user()->penghuni->kamar_id;
        $validated['status'] = 'Menunggu';

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('komplains', 'public');
            $validated['foto'] = '/storage/' . $path;
        }

        $komplain = Komplain::create($validated);

        // Fetch user details for notification
        $penghuniUser = $request->user();
        $kamar = Kamar::find($validated['kamar_id']);
        $roomName = $kamar ? $kamar->nomor_kamar : 'Tidak Diketahui';

        // Notify Admins and Owners
        $adminsAndOwners = User::whereHas('role', function($q) {
            $q->whereIn('name', ['Admin', 'Owner']);
        })->get();

        foreach ($adminsAndOwners as $adminOrOwner) {
            Notification::create([
                'user_id' => $adminOrOwner->id,
                'title' => 'Komplain Baru',
                'message' => 'Terdapat komplain baru dari Penghuni ' . $penghuniUser->name . ' (Kamar ' . $roomName . ').',
                'is_read' => false,
            ]);
        }

        return response()->json(['message' => 'Komplain berhasil dikirim', 'data' => $komplain], 201);
    }

    public function update(Request $request, Komplain $komplain)
    {
        // Only Admin/Owner can update status
        if (!in_array($request->user()->role->name, ['Admin', 'Owner'])) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'status' => 'required|string|in:Menunggu,Diproses,Selesai',
            'tanggapan' => 'nullable|string',
        ]);

        $komplain->update($validated);

        return response()->json(['message' => 'Status komplain berhasil diubah', 'data' => $komplain]);
    }
}
