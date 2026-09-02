<?php

namespace App\Http\Controllers;

use App\Models\KontrakSewa;
use App\Models\Kamar;
use Illuminate\Http\Request;

class KontrakSewaController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            $penghuni_id = $request->user()->penghuni->id ?? null;
            return response()->json(KontrakSewa::with(['kamar', 'penghuni'])->where('penghuni_id', $penghuni_id)->paginate(15));
        }
        
        $this->authorize('viewAny', KontrakSewa::class);
        return response()->json(KontrakSewa::with(['kamar', 'penghuni'])->paginate(15));
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
            $kontrak = KontrakSewa::create($validated);
            return response()->json($kontrak, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Request $request, KontrakSewa $kontrakSewa)
    {
        $this->authorize('view', $kontrakSewa);
        return response()->json($kontrakSewa->load(['kamar', 'penghuni']));
    }

    public function update(Request $request, KontrakSewa $kontrakSewa)
    {
        $this->authorize('update', $kontrakSewa);

        $validated = $request->validate([
            'status' => 'sometimes|in:Aktif,Selesai,Batal',
        ]);

        $kontrakSewa->update($validated);
        return response()->json($kontrakSewa);
    }

    public function destroy(Request $request, KontrakSewa $kontrakSewa)
    {
        $this->authorize('delete', $kontrakSewa);
        $kontrakSewa->delete();
        return response()->json(null, 204);
    }
}