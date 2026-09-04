<?php

namespace App\Http\Controllers;

use App\Models\Paket;
use App\Models\Penghuni;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PaketController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = Paket::with(['penghuni.user', 'penghuni.kamar']);
        
        if ($user->role->name === 'Penghuni') {
            $penghuni = Penghuni::where('user_id', $user->id)->first();
            if (!$penghuni) return response()->json(['data' => []]);
            $query->where('penghuni_id', $penghuni->id);
        }
        
        $pakets = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $pakets]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'penghuni_id' => 'required|exists:penghunis,id',
            'nama_kurir' => 'nullable|string',
            'deskripsi' => 'nullable|string',
        ]);

        $paket = Paket::create([
            'penghuni_id' => $request->penghuni_id,
            'nama_kurir' => $request->nama_kurir,
            'deskripsi' => $request->deskripsi,
            'status' => 'Menunggu Diambil',
            'tanggal_diterima' => Carbon::now(),
        ]);

        // Send Notification
        $penghuni = Penghuni::with('user')->find($request->penghuni_id);
        if ($penghuni) {
            Notification::create([
                'user_id' => $penghuni->user_id,
                'title' => 'Paket Baru Diterima',
                'message' => 'Ada paket untuk Anda dari ' . ($request->nama_kurir ?? 'kurir') . '. Silakan ambil di pos penjaga.',
                'type' => 'info',
                'is_read' => false,
            ]);
        }

        return response()->json(['message' => 'Paket berhasil dicatat dan penghuni telah dinotifikasi.', 'data' => $paket], 201);
    }

    public function update(Request $request, $id)
    {
        $paket = Paket::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:Menunggu Diambil,Sudah Diambil'
        ]);

        $data = ['status' => $request->status];
        if ($request->status === 'Sudah Diambil' && $paket->status !== 'Sudah Diambil') {
            $data['tanggal_diambil'] = Carbon::now();
        }

        $paket->update($data);
        return response()->json(['message' => 'Status paket berhasil diupdate', 'data' => $paket]);
    }

    public function destroy($id)
    {
        $paket = Paket::findOrFail($id);
        $paket->delete();
        return response()->json(['message' => 'Paket berhasil dihapus']);
    }
}
