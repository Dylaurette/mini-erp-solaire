<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Site;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class InitialSiteProductUserSeeder extends Seeder
{
    public function run()
    {
        $site = Site::create([
            'name' => 'Siège - Abidjan',
            'code' => 'ABJ01',
            'address' => 'Cocody',
            'city' => 'Abidjan',
        ]);

        $admin = User::create([
            'name' => 'Admin Demo',
            'email' => 'admin@demo.test',
            'phone' => '22500000000',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'site_id' => $site->id,
        ]);

        Product::create([
            'sku' => 'PANEL-001',
            'name' => 'Panneau Solaire 300W',
            'description' => 'Panneau solaire 300W monocristallin',
            'price' => 120000.00,
            'reorder_level' => 5,
        ]);
    }
}
