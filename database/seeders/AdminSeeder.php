<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@mizuan.dev'],
            [
                'name' => 'Mizuan Mohamed',
                'password' => Hash::make('Alohomora#Unl0ck-2026!'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ],
        );
    }
}
