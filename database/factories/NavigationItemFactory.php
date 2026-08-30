<?php

namespace Database\Factories;

use App\Models\NavigationItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<NavigationItem> */
class NavigationItemFactory extends Factory
{
    protected $model = NavigationItem::class;

    public function definition(): array
    {
        return [
            'label' => fake()->unique()->word(),
            'url' => '/'.fake()->unique()->slug(),
            'sort_order' => fake()->numberBetween(1, 20),
            'is_visible' => true,
            'is_cta' => false,
        ];
    }
}
