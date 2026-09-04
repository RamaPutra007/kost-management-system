<?php

namespace App\Http\Controllers;

use App\Models\KontrakSewa;
use App\Models\Kamar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KontrakSewaController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            $penghuni_id = $request->user()->penghuni->id ?? null;
            return response()->json(KontrakSewa::with(['kamar.fasilitas', 'penghuni.user'])->where('penghuni_id', $penghuni_id)->paginate(15));
        }
        
        $this->authorize('viewAny', KontrakSewa::class);
        return response()->json(KontrakSewa::with(['kamar.fasilitas', 'penghuni.user'])->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', KontrakSewa::class);

        $validated = $request->validate([
            'kamar_id' => 'required|exists:kamars,id',
            'penghuni_id' => 'required|exists:penghunis,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'harga_kesepakatan' => 'required|numeric',
            'deposit' => 'nullable|numeric',
        ]);

        $validated['status'] = 'Aktif';

        try {
            $kontrak = DB::transaction(function () use ($validated) {
                $insertData = collect($validated)->except('deposit')->toArray();
                $kontrak = KontrakSewa::create($insertData);
                $kamar = Kamar::find($validated['kamar_id']);
                if ($kamar) {
                    $kamar->update(['status' => 'Terisi']);
                }
                return $kontrak;
            });
            return response()->json($kontrak, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Request $request, KontrakSewa $kontrakSewa)
    {
        $this->authorize('view', $kontrakSewa);
        return response()->json($kontrakSewa->load(['kamar.fasilitas', 'penghuni.user']));
    }

    public function update(Request $request, KontrakSewa $kontrakSewa)
    {
        $this->authorize('update', $kontrakSewa);

        $validated = $request->validate([
            'kamar_id' => 'sometimes|exists:kamars,id',
            'penghuni_id' => 'sometimes|exists:penghunis,id',
            'tanggal_mulai' => 'sometimes|date',
            'tanggal_selesai' => 'sometimes|date|after:tanggal_mulai',
            'harga_kesepakatan' => 'sometimes|numeric',
            'deposit' => 'nullable|numeric',
            'status' => 'sometimes|in:Aktif,Selesai,Batal',
        ]);

        DB::transaction(function () use ($kontrakSewa, $validated) {
            $oldKamarId = $kontrakSewa->kamar_id;
            
            $updateData = collect($validated)->except('deposit')->toArray();
            $kontrakSewa->update($updateData);
            
            $newKamarId = $kontrakSewa->kamar_id;
            
            // Handle kamar change
            if ($oldKamarId !== $newKamarId) {
                $oldKamar = Kamar::find($oldKamarId);
                if ($oldKamar) $oldKamar->update(['status' => 'Kosong']);
            }
            
            // Handle status/kamar updates
            $kamar = Kamar::find($newKamarId);
            if ($kamar) {
                if (in_array($kontrakSewa->status, ['Selesai', 'Batal'])) {
                    $kamar->update(['status' => 'Kosong']);
                } elseif ($kontrakSewa->status === 'Aktif') {
                    $kamar->update(['status' => 'Terisi']);
                }
            }
        });

        return response()->json($kontrakSewa);
    }

    public function destroy(Request $request, KontrakSewa $kontrakSewa)
    {
        $this->authorize('delete', $kontrakSewa);
        
        DB::transaction(function () use ($kontrakSewa) {
            $kamar = Kamar::find($kontrakSewa->kamar_id);
            if ($kamar) {
                $kamar->update(['status' => 'Kosong']);
            }
            $kontrakSewa->delete();
        });
        
        return response()->json(null, 204);
    }
}