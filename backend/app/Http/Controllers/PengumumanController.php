<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use App\Models\Notification;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PengumumanController extends Controller
{
    public function index(Request $request)
    {
        $pengumuman = Pengumuman::with('creator:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $pengumuman
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'nullable|string|in:info,warning,success,danger'
        ]);

        try {
            DB::beginTransaction();

            $pengumuman = Pengumuman::create([
                'title' => $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['type'] ?? 'info',
                'created_by' => $request->user()->id,
            ]);

            // Find all active Penghuni
            $penghuniRole = Role::where('name', 'Penghuni')->first();
            
            if ($penghuniRole) {
                $penghunis = User::where('role_id', $penghuniRole->id)->get();
                $notifications = [];
                $now = now();

                foreach ($penghunis as $penghuni) {
                    $notifications[] = [
                        'user_id' => $penghuni->id,
                        'title' => '[Pengumuman] ' . $pengumuman->title,
                        'message' => $pengumuman->message,
                        'is_read' => false,
                        'created_at' => $now,
                        'updated_at' => $now
                    ];
                }

                if (!empty($notifications)) {
                    Notification::insert($notifications);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pengumuman berhasil dikirim ke semua penghuni',
                'data' => $pengumuman
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error broadcasting pengumuman: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengirim pengumuman.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Pengumuman berhasil dihapus.'
        ]);
    }
}
