<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        // Only allow Owner or Admin to view users
        if (!in_array($request->user()->role->name, ['Owner', 'Admin'])) {
            abort(403, 'Unauthorized action.');
        }

        // Fetch users and sort them by role (Owner=1, Admin=2, Penghuni=3 usually)
        // Using FIELD for MySQL to order exactly by role name: Owner, Admin, Penghuni
        
        $users = User::with('role')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->orderByRaw("FIELD(roles.name, 'Owner', 'Admin', 'Penghuni')")
            ->orderBy('users.name', 'asc')
            ->select('users.*') // Ensure we only get user columns
            ->get();

        return response()->json($users);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->role->name !== 'Owner' && $request->user()->role->name !== 'Admin') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'string', 'min:8'],
            'role_id' => 'required|exists:roles,id',
            'status' => 'sometimes|in:Aktif,Nonaktif',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'status' => $validated['status'] ?? 'Aktif',
        ]);

        return response()->json($user->load('role'), 201);
    }

    /**
     * Display the specified user.
     */
    public function show(Request $request, User $user)
    {
        if ($request->user()->role->name !== 'Owner' && $request->user()->role->name !== 'Admin') {
            abort(403, 'Unauthorized action.');
        }

        return response()->json($user->load('role'));
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        if ($request->user()->role->name !== 'Owner' && $request->user()->role->name !== 'Admin') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'role_id' => 'sometimes|required|exists:roles,id',
            'status' => 'sometimes|in:Aktif,Nonaktif',
        ]);

        $user->update($validated);

        return response()->json($user->load('role'));
    }

    /**
     * Reset user password.
     */
    public function resetPassword(Request $request, User $user)
    {
        if ($request->user()->role->name !== 'Owner' && $request->user()->role->name !== 'Admin') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Password reset successfully']);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->role->name !== 'Owner' && $request->user()->role->name !== 'Admin') {
            abort(403, 'Unauthorized action.');
        }

        // Prevent deleting oneself
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Cannot delete your own account.'], 403);
        }

        $user->delete();

        return response()->json(null, 204);
    }
}
