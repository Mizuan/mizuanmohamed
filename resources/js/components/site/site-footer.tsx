const socials = [
    { label: 'GitHub', href: 'https://github.com/Mizuan' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mizuanmohamed/' },
    { label: 'X', href: 'https://x.com/mizuanmohamed' },
    { label: 'Email', href: 'mailto:mizuan.mohamed@gmail.com' },
];

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 font-display text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between lg:px-8">
                <p>
                    &copy; {new Date().getFullYear()} Mizuan Mohamed — Malé,
                    Maldives
                </p>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
                    {socials.map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={
                                href.startsWith('http') ? 'noreferrer' : undefined
                            }
                            className="transition-colors hover:text-brand"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
