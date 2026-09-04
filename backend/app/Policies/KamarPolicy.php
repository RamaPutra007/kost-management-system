<?php
namespace App\Policies;

use App\Models\Kamar;
use App\Models\User;

class KamarPolicy
{
    public function viewAny(User $user) { return true; }
    public function view(User $user, Kamar $kamar) { return true; }
    public function create(User $user) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function update(User $user, Kamar $kamar) { return in_array($user->role->name, ['Admin', 'Owner']); }
    public function delete(User $user, Kamar $kamar) { return in_array($user->role->name, ['Admin', 'Owner']); }
}