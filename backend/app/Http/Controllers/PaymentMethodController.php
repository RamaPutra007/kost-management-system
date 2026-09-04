<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentMethod;

class PaymentMethodController extends Controller
{
    public function index(Request $request)
    {
        $query = PaymentMethod::query();
        if ($request->has('kost_id')) {
            $query->where('kost_id', $request->kost_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kost_id' => 'required|exists:kosts,id',
            'tipe' => 'required|in:Bank,QRIS,E-Wallet',
            'nama_provider' => 'required|string|max:255',
            'nomor_rekening' => 'nullable|string|max:255',
            'atas_nama' => 'nullable|string|max:255',
            'instruksi' => 'nullable|string',
            'qr_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('qr_image')) {
            $path = $request->file('qr_image')->store('qris', 'public');
            $validated['qr_image'] = '/storage/' . $path;
        }

        $paymentMethod = PaymentMethod::create($validated);
        return response()->json($paymentMethod, 201);
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $validated = $request->validate([
            'tipe' => 'sometimes|in:Bank,QRIS,E-Wallet',
            'nama_provider' => 'sometimes|string|max:255',
            'nomor_rekening' => 'nullable|string|max:255',
            'atas_nama' => 'nullable|string|max:255',
            'instruksi' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
            'qr_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('qr_image')) {
            $path = $request->file('qr_image')->store('qris', 'public');
            $validated['qr_image'] = '/storage/' . $path;
        }

        $paymentMethod->update($validated);
        return response()->json($paymentMethod);
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();
        return response()->json(null, 204);
    }
}
