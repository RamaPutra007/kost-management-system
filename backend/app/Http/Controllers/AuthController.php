<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (
            !$user ||
            !Hash::check($request->password, $user->password)
        ) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan salah.'],
            ]);
        }

        if ($user->status === 'Nonaktif') {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda telah dinonaktifkan. Silakan hubungi admin.'],
            ]);
        }

        // Hapus token lama jika diperlukan
        // $user->tokens()->delete();

        $token = $user
            ->createToken('auth_token')
            ->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',

            'access_token' => $token,

            'token_type' => 'Bearer',

            'user' => $user->load(
                'role',
                'penghuni'
            ),
        ]);
    }

    /**
     * Logout user.
     */
    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }

    /**
     * Get authenticated user.
     */
    public function user(Request $request)
    {
        return response()->json(
            $request->user()->load(
                'role',
                'penghuni'
            )
        );
    }
}