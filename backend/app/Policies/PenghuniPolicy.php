<?php
namespace App\Policies;

use App\Models\Penghuni;
use App\Models\User;

class PenghuniPolicy
{
    public function viewAny(User $user) { return $user->role->name === 'Admin'; }
    public function view(User $user, Penghuni $penghuni) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $penghuni->id;
    }
    public function create(User $user) { return $user->role->name === 'Admin'; }
    public function update(User $user, Penghuni $penghuni) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $penghuni->id;
    }
    public function delete(User $user, Penghuni $penghuni) { return $user->role->name === 'Admin'; }
}