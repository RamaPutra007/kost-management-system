<?php
$base = __DIR__;

function updateFile($file, $content) {
    if (!file_exists(dirname($file))) {
        mkdir(dirname($file), 0777, true);
    }
    file_put_contents($file, $content);
    echo "Created/Updated $file\n";
}

$apiRouteCode = <<<'PHP'
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
PHP;

$authControllerCode = <<<'PHP'
<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan salah.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('role', 'penghuni')
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('role', 'penghuni'));
    }
}
PHP;

$testCode = <<<'PHP'
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
PHP;

updateFile($base . '/routes/api.php', $apiRouteCode);
updateFile($base . '/app/Http/Controllers/AuthController.php', $authControllerCode);
updateFile($base . '/tests/Feature/AuthTest.php', $testCode);

echo "Auth setup completed.\n";
