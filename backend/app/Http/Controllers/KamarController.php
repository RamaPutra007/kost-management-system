<?php

namespace App\Http\Controllers;

use App\Models\Kamar;
use Illuminate\Http\Request;

class KamarController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Kamar::class);
        $query = Kamar::query();
        if ($request->has('kost_id')) {
            $query->where('kost_id', $request->kost_id);
        }
        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Kamar::class);

        $validated = $request->validate([
            'kost_id' => 'required|exists:kosts,id',
            'nomor_kamar' => 'required|string|max:50',
            'tipe' => 'required|string|max:100',
            'harga' => 'required|numeric',
            'fasilitas' => 'nullable|string',
            'status' => 'sometimes|in:Kosong,Terisi,Perbaikan',
        ]);

        $kamar = Kamar::create($validated);
        return response()->json($kamar, 201);
    }

    public function show(Request $request, Kamar $kamar)
    {
        $this->authorize('view', $kamar);
        return response()->json($kamar);
    }

    public function update(Request $request, Kamar $kamar)
    {
        $this->authorize('update', $kamar);

        $validated = $request->validate([
            'kost_id' => 'sometimes|exists:kosts,id',
            'nomor_kamar' => 'sometimes|string|max:50',
            'tipe' => 'sometimes|string|max:100',
            'harga' => 'sometimes|numeric',
            'fasilitas' => 'nullable|string',
            'status' => 'sometimes|in:Kosong,Terisi,Perbaikan',
        ]);

        $kamar->update($validated);
        return response()->json($kamar);
    }

    public function destroy(Request $request, Kamar $kamar)
    {
        $this->authorize('delete', $kamar);
        $kamar->delete();
        return response()->json(null, 204);
    }
}