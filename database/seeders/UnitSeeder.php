<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            'Kasir',
            'Admin',
            'IT',
            'FO',
        ];

        foreach ($units as $unit) {
            Unit::create([
                'name' => $unit
            ]);
        }
    }
}
