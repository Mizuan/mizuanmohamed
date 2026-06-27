/**
 * Resolves a stored public-disk path (e.g. `projects/abc.png`) to a browseable
 * URL served via the storage symlink. Absolute URLs are returned untouched.
 */
export function storageUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return `/storage/${path.replace(/^\/?(storage\/)?/, '')}`;
}
