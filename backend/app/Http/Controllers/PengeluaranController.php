<?php

namespace App\Http\Controllers;

use App\Models\Pengeluaran;
use App\Models\KategoriPengeluaran;
use Illuminate\Http\Request;

class PengeluaranController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        return response()->json(Pengeluaran::with(['kategori', 'pencatat'])->paginate(15));
    }

    public function store(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'kost_id' => 'required|exists:kosts,id',
            'kategori_id' => 'required|exists:kategori_pengeluarans,id',
            'tanggal' => 'required|date',
            'nominal' => 'required|numeric',
            'keterangan' => 'nullable|string',
            'bukti_struk' => 'nullable|string',
        ]);

        $validated['dicatat_oleh'] = $request->user()->id;

        $pengeluaran = Pengeluaran::create($validated);
        return response()->json($pengeluaran, 201);
    }

    public function show(Request $request, Pengeluaran $pengeluaran)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        return response()->json($pengeluaran->load(['kategori', 'pencatat']));
    }

    public function update(Request $request, Pengeluaran $pengeluaran)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'kost_id' => 'sometimes|exists:kosts,id',
            'kategori_id' => 'sometimes|exists:kategori_pengeluarans,id',
            'tanggal' => 'sometimes|date',
            'nominal' => 'sometimes|numeric',
            'keterangan' => 'nullable|string',
            'bukti_struk' => 'nullable|string',
        ]);

        $pengeluaran->update($validated);
        return response()->json($pengeluaran);
    }

    public function destroy(Request $request, Pengeluaran $pengeluaran)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $pengeluaran->delete();
        return response()->json(null, 204);
    }
}