<?php

namespace App\Http\Controllers;

use App\Models\KategoriPengeluaran;
use Illuminate\Http\Request;

class KategoriPengeluaranController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        return response()->json(KategoriPengeluaran::all());
    }

    public function store(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:100',
        ]);

        $kategori = KategoriPengeluaran::create($validated);
        return response()->json($kategori, 201);
    }
}