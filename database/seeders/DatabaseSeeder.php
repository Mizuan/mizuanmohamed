<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            SiteSettingSeeder::class,
            SocialLinkSeeder::class,
            NavigationItemSeeder::class,
            ProjectSeeder::class,
            PagesSeeder::class,
            ArticlesSeeder::class,
        ]);
    }
}
