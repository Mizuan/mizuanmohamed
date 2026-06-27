/**
 * Builds an auto-generated screenshot URL for a project's live site using the
 * free, key-less thum.io service — a sharper alternative to mShots. The URL is
 * appended raw (thum.io expects the full URL after the options segment).
 */
export function screenshotUrl(url: string, width = 1280): string {
    return `https://image.thum.io/get/width/${width}/noanimate/${url}`;
}
