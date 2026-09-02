<?php
namespace App\Policies;

use App\Models\KontrakSewa;
use App\Models\User;

class KontrakSewaPolicy
{
    public function viewAny(User $user) { return $user->role->name === 'Admin'; }
    public function view(User $user, KontrakSewa $kontrakSewa) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $kontrakSewa->penghuni_id;
    }
    public function create(User $user) { return $user->role->name === 'Admin'; }
    public function update(User $user, KontrakSewa $kontrakSewa) { return $user->role->name === 'Admin'; }
    public function delete(User $user, KontrakSewa $kontrakSewa) { return $user->role->name === 'Admin'; }
}