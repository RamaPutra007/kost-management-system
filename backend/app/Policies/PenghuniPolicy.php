<?php
namespace App\Policies;

use App\Models\Penghuni;
use App\Models\User;

class PenghuniPolicy
{
    public function viewAny(User $user) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function view(User $user, Penghuni $penghuni) {
        if (in_array($user->role->name, ['Admin', 'Owner'])) return true;
        return $user->penghuni && $user->penghuni->id === $penghuni->id;
    }
    public function create(User $user) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function update(User $user, Penghuni $penghuni) {
        if (in_array($user->role->name, ['Admin', 'Owner'])) return true;
        return $user->penghuni && $user->penghuni->id === $penghuni->id;
    }
    public function delete(User $user, Penghuni $penghuni) { return in_array($user->role->name, ['Admin', 'Owner']); }
}