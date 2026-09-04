<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->renameColumn('hero_eyebrow', 'tagline');
        });

        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn([
                'hero_heading',
                'hero_intro',
                'hero_primary_label',
                'hero_primary_url',
                'hero_secondary_label',
                'hero_secondary_url',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->renameColumn('tagline', 'hero_eyebrow');
        });

        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('hero_heading')->default('');
            $table->text('hero_intro')->nullable();
            $table->string('hero_primary_label')->nullable();
            $table->string('hero_primary_url')->nullable();
            $table->string('hero_secondary_label')->nullable();
            $table->string('hero_secondary_url')->nullable();
        });
    }
};
