<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fasilitas;

class FasilitasController extends Controller
{
    public function index()
    {
        return response()->json(Fasilitas::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_fasilitas' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
        ]);
        $fasilitas = Fasilitas::create($validated);
        return response()->json($fasilitas, 201);
    }

    public function show(Fasilitas $fasilita)
    {
        return response()->json($fasilita);
    }

    public function update(Request $request, Fasilitas $fasilita)
    {
        $validated = $request->validate([
            'nama_fasilitas' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string|max:50',
        ]);
        $fasilita->update($validated);
        return response()->json($fasilita);
    }

    public function destroy(Fasilitas $fasilita)
    {
        $fasilita->delete();
        return response()->json(null, 204);
    }
}
