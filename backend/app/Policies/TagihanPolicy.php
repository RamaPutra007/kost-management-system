<?php
namespace App\Policies;

use App\Models\Tagihan;
use App\Models\User;

class TagihanPolicy
{
    public function viewAny(User $user) { return $user->role->name === 'Admin'; }
    public function view(User $user, Tagihan $tagihan) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $tagihan->penghuni_id;
    }
    public function create(User $user) { return $user->role->name === 'Admin'; }
    public function update(User $user, Tagihan $tagihan) { return $user->role->name === 'Admin'; }
    public function delete(User $user, Tagihan $tagihan) { return $user->role->name === 'Admin'; }
}