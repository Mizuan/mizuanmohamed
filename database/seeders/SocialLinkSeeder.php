<?php

namespace Database\Seeders;

use App\Enums\SocialPlatform;
use App\Models\SocialLink;
use Illuminate\Database\Seeder;

class SocialLinkSeeder extends Seeder
{
    public function run(): void
    {
        if (SocialLink::query()->exists()) {
            return;
        }

        $links = [
            [SocialPlatform::GitHub, 'GitHub', 'https://github.com/Mizuan'],
            [SocialPlatform::LinkedIn, 'LinkedIn', 'https://www.linkedin.com/in/mizuanmohamed/'],
            [SocialPlatform::X, 'X', 'https://x.com/mizuanmohamed'],
            [SocialPlatform::Email, 'Email', 'mailto:mizuan.mohamed@gmail.com'],
        ];

        foreach ($links as $index => [$platform, $label, $url]) {
            SocialLink::create([
                'platform' => $platform,
                'label' => $label,
                'url' => $url,
                'sort_order' => $index + 1,
            ]);
        }
    }
}
