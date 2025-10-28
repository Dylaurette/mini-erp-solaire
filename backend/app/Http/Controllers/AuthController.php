<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Register (public)
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed' // password_confirmation
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'seller', // par défaut
        ]);

        Auth::login($user);
        // session regenerated automatically by Login below, but ensure:
        $request->session()->regenerate();

        return response()->json(['user' => $user], 201);
    }

    // Login (public) - cookie-based
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants invalides.'],
            ]);
        }

        $request->session()->regenerate();

        return response()->json(['user' => Auth::user()]);
    }

    // Returns authenticated user (protected)
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // Logout (protected)
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Déconnecté']);
    }
}
