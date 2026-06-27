import BrandMark from '@/components/brand-mark';

export default function AppLogo() {
    return (
        <>
            <BrandMark className="size-8 text-base" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-display leading-tight font-medium">
                    Mizuan.dev
                </span>
            </div>
        </>
    );
}
