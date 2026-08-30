<?php

namespace App\Enums;

enum SocialPlatform: string
{
    case GitHub = 'github';
    case LinkedIn = 'linkedin';
    case X = 'x';
    case Mastodon = 'mastodon';
    case Bluesky = 'bluesky';
    case YouTube = 'youtube';
    case Instagram = 'instagram';
    case Rss = 'rss';
    case Website = 'website';
    case Email = 'email';

    public function label(): string
    {
        return match ($this) {
            self::GitHub => 'GitHub',
            self::LinkedIn => 'LinkedIn',
            self::X => 'X',
            self::Mastodon => 'Mastodon',
            self::Bluesky => 'Bluesky',
            self::YouTube => 'YouTube',
            self::Instagram => 'Instagram',
            self::Rss => 'RSS',
            self::Website => 'Website',
            self::Email => 'Email',
        };
    }
}
