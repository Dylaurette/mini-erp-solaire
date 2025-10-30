<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@demo.test'],
            [
                'name' => 'Admin Demo',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '0100000000',
            ]
        );
    }
}
