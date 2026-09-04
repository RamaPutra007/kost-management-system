<?php
namespace App\Policies;

use App\Models\Tagihan;
use App\Models\User;

class TagihanPolicy
{
    public function viewAny(User $user) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function view(User $user, Tagihan $tagihan) {
        if (in_array($user->role->name, ['Admin', 'Owner'])) return true;
        return $user->penghuni && $user->penghuni->id === $tagihan->penghuni_id;
    }
    public function create(User $user) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function update(User $user, Tagihan $tagihan) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function delete(User $user, Tagihan $tagihan) { return in_array($user->role->name, ['Admin', 'Owner']); }
}