<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();

            $table->string('brand_name');
            $table->string('meta_description');

            $table->string('hero_eyebrow')->nullable();
            $table->string('hero_heading');
            $table->text('hero_intro');
            $table->string('hero_primary_label')->nullable();
            $table->string('hero_primary_url')->nullable();
            $table->string('hero_secondary_label')->nullable();
            $table->string('hero_secondary_url')->nullable();

            $table->text('contact_text')->nullable();
            $table->string('contact_email')->nullable();

            $table->string('footer_text');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
