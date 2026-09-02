<?php

namespace App\Http\Controllers;

use App\Models\Kost;
use Illuminate\Http\Request;

class KostController extends Controller
{
    public function index()
    {
        return response()->json(Kost::paginate(15));
    }

    public function store(Request $request)
    {
        // Admin or Owner only (authorized by route middleware or logic)
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'fasilitas_umum' => 'nullable|string',
        ]);

        $kost = Kost::create($validated);
        return response()->json($kost, 201);
    }

    public function show(Kost $kost)
    {
        return response()->json($kost);
    }

    public function update(Request $request, Kost $kost)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'alamat' => 'sometimes|string',
            'fasilitas_umum' => 'nullable|string',
        ]);

        $kost->update($validated);
        return response()->json($kost);
    }

    public function destroy(Request $request, Kost $kost)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $kost->delete();
        return response()->json(null, 204);
    }
}