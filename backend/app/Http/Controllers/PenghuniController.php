<?php

namespace App\Http\Controllers;

use App\Models\Penghuni;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PenghuniController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Penghuni::class);
        return response()->json(Penghuni::with('user')->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Penghuni::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'nik' => 'required|string|size:16|unique:penghunis,nik',
            'telepon' => 'required|string|max:15',
            'kontak_darurat' => 'required|string|max:15',
            'foto_ktp' => 'nullable|string',
        ]);

        $penghuni = DB::transaction(function () use ($validated) {
            $role = Role::where('name', 'Penghuni')->first();
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role_id' => $role->id,
                'status' => 'Aktif',
            ]);

            return Penghuni::create([
                'user_id' => $user->id,
                'nik' => $validated['nik'],
                'telepon' => $validated['telepon'],
                'kontak_darurat' => $validated['kontak_darurat'],
                'foto_ktp' => $validated['foto_ktp'] ?? null,
            ]);
        });

        return response()->json($penghuni->load('user'), 201);
    }

    public function show(Request $request, Penghuni $penghuni)
    {
        $this->authorize('view', $penghuni);
        return response()->json($penghuni->load('user'));
    }

    public function update(Request $request, Penghuni $penghuni)
    {
        $this->authorize('update', $penghuni);

        $validated = $request->validate([
            'telepon' => 'sometimes|string|max:15',
            'kontak_darurat' => 'sometimes|string|max:15',
            'foto_ktp' => 'nullable|string',
        ]);

        $penghuni->update($validated);
        return response()->json($penghuni);
    }

    public function destroy(Request $request, Penghuni $penghuni)
    {
        $this->authorize('delete', $penghuni);
        $penghuni->delete();
        return response()->json(null, 204);
    }
}