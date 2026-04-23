export function AppFooter() {
    return (
        <footer className="sticky bottom-0 z-10 border-t bg-background/95 px-6 py-3 text-center text-xs text-muted-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60">
            &copy; {new Date().getFullYear()} Mizuan Mohamed.
        </footer>
    );
}
