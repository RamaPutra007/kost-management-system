<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_login_berhasil()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'access_token', 'token_type', 'user']);
    }

    public function test_login_credential_salah()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422);
    }

    public function test_get_user_dengan_auth()
    {
        $user = User::where('email', 'admin@test.com')->first();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->getJson('/api/user', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('email', 'admin@test.com');
    }

    public function test_akses_tanpa_auth()
    {
        $response = $this->getJson('/api/user');
        $response->assertStatus(401);
    }

    public function test_logout()
    {
        $user = User::where('email', 'admin@test.com')->first();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->postJson('/api/logout', [], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Logout berhasil']);

        $this->assertCount(0, $user->tokens);
    }
}