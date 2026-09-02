<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use Illuminate\Http\Request;

class TagihanController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            $penghuni_id = $request->user()->penghuni->id ?? null;
            return response()->json(Tagihan::with(['penghuni', 'kontrak_sewa'])->where('penghuni_id', $penghuni_id)->paginate(15));
        }

        $this->authorize('viewAny', Tagihan::class);
        return response()->json(Tagihan::with(['penghuni', 'kontrak_sewa'])->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Tagihan::class);

        $validated = $request->validate([
            'penghuni_id' => 'required|exists:penghunis,id',
            'kontrak_sewa_id' => 'required|exists:kontrak_sewas,id',
            'bulan_tagihan' => 'required|date_format:Y-m-d',
            'nominal' => 'required|numeric',
            'denda' => 'nullable|numeric',
            'jatuh_tempo' => 'required|date',
            'status' => 'sometimes|in:Belum Lunas,Lunas,Cicilan',
        ]);

        $validated['total_tagihan'] = $validated['nominal'] + ($validated['denda'] ?? 0);
        $validated['status'] = $validated['status'] ?? 'Belum Lunas';

        $tagihan = Tagihan::create($validated);
        return response()->json($tagihan, 201);
    }

    public function show(Request $request, Tagihan $tagihan)
    {
        $this->authorize('view', $tagihan);
        return response()->json($tagihan->load(['penghuni', 'kontrak_sewa']));
    }

    public function update(Request $request, Tagihan $tagihan)
    {
        $this->authorize('update', $tagihan);

        $validated = $request->validate([
            'nominal' => 'sometimes|numeric',
            'denda' => 'sometimes|numeric',
            'jatuh_tempo' => 'sometimes|date',
            'status' => 'sometimes|in:Belum Lunas,Lunas,Cicilan',
        ]);

        if (isset($validated['nominal']) || isset($validated['denda'])) {
            $validated['total_tagihan'] = ($validated['nominal'] ?? $tagihan->nominal) + ($validated['denda'] ?? $tagihan->denda);
        }

        $tagihan->update($validated);
        return response()->json($tagihan);
    }

    public function destroy(Request $request, Tagihan $tagihan)
    {
        $this->authorize('delete', $tagihan);
        $tagihan->delete();
        return response()->json(null, 204);
    }
}