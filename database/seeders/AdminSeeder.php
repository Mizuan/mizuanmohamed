<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = config('app.admin_password');

        if (blank($password)) {
            throw new RuntimeException('Set ADMIN_PASSWORD in .env before seeding the admin user.');
        }

        $user = User::firstOrNew(['email' => 'admin@mizuan.dev']);

        $user->forceFill([
            'name' => 'Mizuan Mohamed',
            'password' => Hash::make($password),
            'is_admin' => true,
            'email_verified_at' => now(),
        ])->save();
    }
}
