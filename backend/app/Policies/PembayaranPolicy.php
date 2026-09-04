<?php
namespace App\Policies;

use App\Models\Pembayaran;
use App\Models\User;

class PembayaranPolicy
{
    public function viewAny(User $user) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function view(User $user, Pembayaran $pembayaran) {
        if (in_array($user->role->name, ['Admin', 'Owner'])) return true;
        return $user->penghuni && $user->penghuni->id === $pembayaran->penghuni_id;
    }
    public function create(User $user) { 
        return $user->role->name === 'Penghuni' || in_array($user->role->name, ['Admin', 'Owner']);
    }
    public function update(User $user, Pembayaran $pembayaran) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function delete(User $user, Pembayaran $pembayaran) { return in_array($user->role->name, ['Admin', 'Owner']); }
}