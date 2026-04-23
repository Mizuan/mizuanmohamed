<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Housing Development Corporation (HDC) Website',
                'description' => "A modern, fully responsive web platform for the Maldives' premier housing development authority, featuring dynamic content management and seamless user experience powered by React and .NET Core API.",
                'tags' => ['Web Apps', 'APIs'],
                'technologies' => ['Tailwindcss', 'React', '.NET Core'],
                'link' => 'https://www.hdc.mv',
            ],
            [
                'title' => 'Judicial Service Commission Website',
                'description' => 'A mobile-friendly website designed for the Judicial Regulatory Body of the Maldives.',
                'tags' => ['Web Apps'],
                'technologies' => ['Bootstrap', 'PHP', 'MySQL', 'JS'],
                'link' => 'https://jsc.gov.mv',
            ],
            [
                'title' => 'Recruitment Portal of Judicial Service Commission',
                'description' => 'A comprehensive recruitment portal designed for judges and various job positions. The portal uses Efaas API for Authentication.',
                'tags' => ['Web Apps', 'APIs'],
                'technologies' => ['Bootstrap', 'PHP', 'MySQL', 'JS', 'Efaas API'],
                'link' => 'https://apply.jsc.gov.mv',
            ],
            [
                'title' => 'Ocean Dive Rasdhoo Dive Center Website',
                'description' => 'A website created for the scuba diving facility OceanDive, which is located in AA. Rasdhoo, Maldives. The website offers the option to book different packages and courses along with email notifications.',
                'tags' => ['Web Apps'],
                'technologies' => ['Bootstrap', 'PHP', 'MySQL'],
                'link' => 'https://oceandiverasdhoo.com',
            ],
            [
                'title' => 'United Henveirians Sports Club',
                'description' => 'A website created for United Henveirians, a sports and community organization located in Malé, Maldives. The site highlights team achievements, upcoming events, and club activities.',
                'tags' => ['Web Apps'],
                'technologies' => ['Tailwindcss', 'React'],
                'link' => 'https://unitedhenveirians.com',
            ],
            [
                'title' => 'The Cage - Sports Arena Booking Platform',
                'description' => 'A comprehensive online platform for sports arena reservations featuring real-time availability, instant payment processing through BML Gateway, automated email notifications, and a fully dynamic admin management system. Built with modern Laravel architecture and responsive design.',
                'tags' => ['Web Apps', 'APIs'],
                'technologies' => ['Laravel', 'Tailwindcss', 'Livewire', 'AlpineJS', 'BML Payment Gateway'],
                'link' => 'https://thecage.space',
            ],
            [
                'title' => 'Portfolio - Mohamed Sakhaau (Bale)',
                'description' => "A comprehensive portfolio website for a professional athlete from the Maldives, showcasing career highlights, achievements, and statistics for New Radiant Sports Club's player.",
                'tags' => ['Web Apps'],
                'technologies' => ['React', 'Vite', 'Tailwindcss'],
                'link' => 'https://sakhaau10.com',
            ],
            [
                'title' => 'Tree and Salt',
                'description' => 'A premier travel agency in the Maldives, built with Laravel, Inertia, and React.',
                'tags' => ['Web Apps'],
                'technologies' => ['Laravel', 'Inertia', 'React'],
                'link' => 'https://treeandsalt.com',
            ],
        ];

        foreach ($projects as $index => $project) {
            Project::updateOrCreate(
                ['slug' => Str::slug($project['title'])],
                [
                    'title' => $project['title'],
                    'description' => $project['description'],
                    'tags' => $project['tags'],
                    'technologies' => $project['technologies'],
                    'image' => null,
                    'link' => $project['link'],
                    'is_published' => true,
                    'sort_order' => $index + 1,
                ],
            );
        }
    }
}
