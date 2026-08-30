<?php

namespace Database\Seeders;

use App\Models\NavigationItem;
use Illuminate\Database\Seeder;

class NavigationItemSeeder extends Seeder
{
    public function run(): void
    {
        if (NavigationItem::query()->exists()) {
            return;
        }

        $items = [
            ['Writing', '/articles', false],
            ['Projects', '/projects', false],
            ['About', '/about', false],
            ['Get in touch', '/contact', true],
        ];

        foreach ($items as $index => [$label, $url, $isCta]) {
            NavigationItem::create([
                'label' => $label,
                'url' => $url,
                'is_cta' => $isCta,
                'sort_order' => $index + 1,
            ]);
        }
    }
}
