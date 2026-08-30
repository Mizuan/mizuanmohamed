<?php

namespace Database\Factories;

use App\Enums\SocialPlatform;
use App\Models\SocialLink;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<SocialLink> */
class SocialLinkFactory extends Factory
{
    protected $model = SocialLink::class;

    public function definition(): array
    {
        $platform = fake()->randomElement(SocialPlatform::cases());

        return [
            'platform' => $platform,
            'label' => $platform->label(),
            'url' => fake()->url(),
            'sort_order' => fake()->numberBetween(1, 20),
            'is_visible' => true,
        ];
    }
}
