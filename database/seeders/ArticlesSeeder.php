<?php

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticlesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@mizuan.dev')->firstOrFail();

        Article::updateOrCreate(
            ['slug' => 'building-this-site-with-laravel-inertia-react'],
            [
                'user_id' => $admin->id,
                'category_id' => null,
                'title' => 'Building this site with Laravel, Inertia, and React',
                'excerpt' => 'A quick look at the stack behind this site and why I picked each piece.',
                'content' => <<<'HTML'
<p>I've been meaning to rebuild my personal site for a while. The old one was a static React app — fine, but I wanted somewhere to publish notes without thinking about a CMS or a markdown deploy pipeline. So I built one.</p>
<p>The stack is the one I reach for at work too: Laravel on the back, Inertia bridging the gap, React on the front. TypeScript across the whole frontend. Tailwind v4. shadcn for components. TipTap for the article editor. Boring, in the good sense.</p>
<h2>Why Inertia</h2>
<p>I didn't want a separate API. I didn't want client-side routing complexity. I wanted to write a controller that returns a page and have React render it. That's exactly what Inertia gives you — server-driven routes, client-rendered pages, no JSON contract to maintain.</p>
<h2>The article model</h2>
<p>Pretty standard. Articles belong to a category, have many tags, and store rich-text HTML produced by TipTap.</p>
<pre><code class="language-php">class Article extends Model
{
    protected function casts(): array
    {
        return [
            'status' =&gt; ArticleStatus::class,
            'published_at' =&gt; 'datetime',
        ];
    }

    public function scopePublished(Builder $query): void
    {
        $query-&gt;where('status', ArticleStatus::Published)
            -&gt;whereNotNull('published_at')
            -&gt;where('published_at', '&lt;=', now());
    }
}</code></pre>
<p>The <code>published()</code> scope is what powers the public article list — only articles with a past <code>published_at</code> show up.</p>
<h2>Syntax highlighting</h2>
<p>The editor uses TipTap's lowlight extension with a hand-picked language list (PHP, JS/TS, Bash, SQL, JSON, and a few more). Tokens get classes like <code>hljs-keyword</code> and <code>hljs-string</code>, and Tailwind handles the colors via custom CSS in <code>app.css</code>.</p>
<p>That's the whole thing. No fancy build pipeline, no separate frontend deploy. <code>git push</code> and Laravel Forge handles the rest.</p>
HTML,
                'featured_image' => null,
                'status' => ArticleStatus::Published,
                'published_at' => now()->subDays(3),
            ],
        );

        Article::updateOrCreate(
            ['slug' => 'in-praise-of-boring-tech'],
            [
                'user_id' => $admin->id,
                'category_id' => null,
                'title' => 'In praise of boring tech',
                'excerpt' => 'Why the dependable, slightly out-of-fashion stack usually wins.',
                'content' => <<<'HTML'
<p>I've shipped a few things now. Internal tools at work, side projects, this site. The pattern that keeps showing up is the same one that was true ten years ago: the boring choice almost always pays off.</p>
<p>Boring doesn't mean bad. It means well-understood. It means there are answers on Stack Overflow when something breaks. It means the next developer can pick it up without a week of onboarding. For a one-person personal site that's overkill, but for a team it's everything.</p>
<h2>What boring looks like for me</h2>
<ul>
<li>A relational database with proper foreign keys instead of a document store I'll have to migrate off in two years.</li>
<li>Server-rendered HTML where I can get away with it. Inertia counts.</li>
<li>A monolith. One repo, one deploy, one set of logs.</li>
<li>Whichever framework's docs I can read in an afternoon when I forget how something works.</li>
</ul>
<h2>What I'm willing to be unboring about</h2>
<p>UI. Editor experience. The bits the user actually touches. That's where it pays to spend a little novelty budget — a TipTap editor instead of a textarea, real toast notifications instead of "click here to dismiss," a sidebar that remembers if it's open.</p>
<p>Everything else? Boring. And I sleep just fine.</p>
HTML,
                'featured_image' => null,
                'status' => ArticleStatus::Published,
                'published_at' => now()->subDay(),
            ],
        );
    }
}
