<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Page::updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'About',
                'content' => <<<'HTML'
<p>I'm a Software developer based in Malé, Maldives, and I've been at this for about seven years.</p>
<p>Most of my work lives in the Laravel + React + TypeScript stack, which in practice means a lot of REST APIs talking to MySQL and more Laravel Forge deploys than I'd care to count.</p>
<p>These days I lead a small development team at a government SOE here in the Maldives, internal systems, real users, real deadlines. It's the kind of work that teaches you what actually matters once software starts getting used. A lot of what I know about shipping came from there, not from blog posts.</p>
<p>Outside the day job I still build things for fun. You'll find a few of them on the portfolio page. This site is one too, built with Laravel, Inertia, and React because I wanted to see what the stack feels like when nobody's reviewing my PRs.</p>
<p>If you want to talk shop or have something you'd like to build together, the contact page has what you need.</p>
HTML,
                'sections' => [
                    [
                        'label' => 'Intro',
                        'title' => 'About',
                        'body' => "I'm Mizuan, a full-stack developer based in Malé, Maldives. For over seven years I've built fast, considered web applications end to end, from the data model to the last micro-interaction.\n\nI care about the whole arc of a product, and about software that feels quick, considered, and quietly reliable.",
                        'tags' => [],
                    ],
                    [
                        'label' => 'Experience',
                        'title' => 'Experience',
                        'body' => "I currently lead a small development team at a government SOE, shipping products with Laravel, React, and TypeScript.\n\nMy work spans the full lifecycle: data modelling and architecture, backend APIs, polished frontends, and the infrastructure that holds it all together.",
                        'tags' => [],
                    ],
                    [
                        'label' => 'Approach',
                        'title' => 'Approach',
                        'body' => "Good software feels obvious in hindsight. I sweat the details, the motion, the empty states, the edge cases, because those are the things people actually feel.\n\nI like building from the raw structure outward: a solid core, then a considered layer of craft on top.",
                        'tags' => [],
                    ],
                    [
                        'label' => 'Toolkit',
                        'title' => 'Toolkit',
                        'body' => '',
                        'tags' => ['Laravel', 'PHP', 'React', 'TypeScript', 'Inertia.js', 'Tailwind CSS', 'PostgreSQL', 'MySQL', 'Redis', 'Node.js', 'AWS', 'Git'],
                    ],
                ],
                'meta_description' => 'Mizuan Mohamed — fullstack developer from Malé, Maldives. Seven years with Laravel, React, and TypeScript, leading an engineering team.',
                'is_published' => true,
            ],
        );

        Page::updateOrCreate(
            ['slug' => 'contact'],
            [
                'title' => 'Contact',
                'content' => <<<'HTML'
<p>Easiest way to reach me is by email. I try to reply within a couple of days — sometimes faster, sometimes slower depending on what's on fire at work.</p>
<p>If you're writing about a project, a rough outline of what you're trying to build and a ballpark timeline goes a long way. I read everything that comes in.</p>
<ul>
<li>Email: <a href="mailto:mizuan.mohamed@gmail.com">mizuan.mohamed@gmail.com</a></li>
<li>GitHub: <a href="https://github.com/Mizuan">github.com/Mizuan</a></li>
<li>LinkedIn: <a href="https://www.linkedin.com/in/mizuanmohamed/">linkedin.com/in/mizuanmohamed</a></li>
<li>X: <a href="https://x.com/mizuanmohamed">x.com/mizuanmohamed</a></li>
<li>Instagram: <a href="https://instagram.com/mizuanmohamed">instagram.com/mizuanmohamed</a></li>
</ul>
<p>Based in Malé, Maldives. Happy to work across time zones.</p>
HTML,
                'meta_description' => 'Get in touch with Mizuan Mohamed — email, GitHub, LinkedIn, and socials for project inquiries or just to say hi.',
                'is_published' => true,
            ],
        );
    }
}
