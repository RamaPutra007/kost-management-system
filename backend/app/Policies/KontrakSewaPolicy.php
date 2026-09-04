<?php
namespace App\Policies;

use App\Models\KontrakSewa;
use App\Models\User;

class KontrakSewaPolicy
{
    public function viewAny(User $user) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function view(User $user, KontrakSewa $kontrakSewa) {
        if (in_array($user->role->name, ['Admin', 'Owner'])) return true;
        return $user->penghuni && $user->penghuni->id === $kontrakSewa->penghuni_id;
    }
    public function create(User $user) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function update(User $user, KontrakSewa $kontrakSewa) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function delete(User $user, KontrakSewa $kontrakSewa) { return in_array($user->role->name, ['Admin', 'Owner']); }
}