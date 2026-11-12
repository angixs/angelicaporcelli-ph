# Angelica Porcelli Portfolio

Astro photography portfolio with local, folder-driven galleries.

## Adding Photos

Each collection has a JSON file in `src/content/collections/`. The file name is the collection slug.

To add photos, drop `.jpg`, `.jpeg`, `.png`, or `.webp` files into the matching folder in `src/assets/photos/`.

Example:

```text
src/content/collections/coastal-studies.json
src/assets/photos/coastal-studies/liguria.jpg
src/assets/photos/coastal-studies/mountain-road.png
```

The site automatically loads those images at build time. File names become the photo labels by default, so `mountain-road.png` becomes `Mountain Road`.

## Optional Photo Metadata

Add a JSON file with the same base name as the image when you want custom text:

```text
src/assets/photos/coastal-studies/liguria.jpg
src/assets/photos/coastal-studies/liguria.json
```

```json
{
	"name": "Liguria",
	"caption": "Evening light on the coast.",
	"alt": "Rocky Ligurian coastline in evening light.",
	"order": 1,
	"cover": true
}
```

All metadata fields are optional. Use `cover: true` to choose the collection cover image, or add `"cover": "liguria.jpg"` to the collection JSON.

## Responsive photography

Sources live in `src/assets/photos/`. `ResponsivePhoto.astro` uses Astro's native
`Image` pipeline to generate WebP at quality 90, with widths from 320 to 1440 px
(capped at the source width). `sizes` matches the existing responsive layout.
Only width is transformed: no new crops, stretching, or upscaling are applied.
The existing CSS controls framing and hover animations. Intrinsic dimensions
reserve space in the masonry gallery; hero images retain their CSS aspect ratios.

The static endpoint `src/pages/photos/[...photo].ts` preserves every original
`/photos/...` URL, including filenames with spaces. Originals are copied without
recompression at build time and assigned to the lightbox only when a photo is
clicked. No Cloudflare image service or server adapter is required: deploy `dist/`
as before. Gallery thumbnails are lazy-loaded; the page hero has high priority.

WebP is used for broad modern browser support and predictable build cost across
the entire collection. Originals remain available at full quality in the lightbox.
After deployment, rerun mobile Lighthouse/PageSpeed to measure LCP, CLS, and image
transfer under the real Cloudflare cache and network conditions.

Run `node scripts/verify-images.mjs` after a build to verify every original is
byte-identical, gallery URLs resolve, and rendered previews have responsive sources
and intrinsic dimensions. It also reports the 672 px variants of the four images
identified in the performance audit.

### Loading priority and LCP

`ResponsivePhoto` uses `loading="lazy"`, `fetchpriority="auto"`, and
`decoding="async"` by default. Only the main hero receives `priority`, which
sets `loading="eager"` and `fetchpriority="high"`. No gallery-wide preloads or
original-image prefetches are used. Native lazy loading may request images near
the viewport before they become visible; it does not enforce an exact download
count or concurrency limit.

The main photographic LCP candidates are `.page-hero__cover img` on collection
pages and `.resume-panel__image` on the home page. These are candidates inferred
from the layout, not measured LCP results. On narrow screens, text can instead
become the LCP because the layout stacks vertically. Confirm the actual element
in a mobile Lighthouse report or the browser Performance panel after navigation
without scrolling. A connected browser was unavailable during this check.

The verification script checks loading/decoding attributes in built HTML,
including one eager/high-priority hero per page and no initial lightbox source.

## Commands

The build embeds the shared stylesheet in each page using
`build.inlineStylesheets: 'always'`. This removes the separate render-blocking CSS
request without changing the stylesheet or loading it asynchronously. HTML is
slightly larger and CSS is no longer cached separately between page navigations;
reassess this choice if the styles grow substantially.

All commands are run from the root of the project.

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
