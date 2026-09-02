<?php
namespace App\Policies;

use App\Models\Pembayaran;
use App\Models\User;

class PembayaranPolicy
{
    public function viewAny(User $user) { return $user->role->name === 'Admin'; }
    public function view(User $user, Pembayaran $pembayaran) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $pembayaran->penghuni_id;
    }
    public function create(User $user) { 
        return $user->role->name === 'Penghuni' || $user->role->name === 'Admin';
    }
    public function update(User $user, Pembayaran $pembayaran) { return $user->role->name === 'Admin'; }
    public function delete(User $user, Pembayaran $pembayaran) { return $user->role->name === 'Admin'; }
}