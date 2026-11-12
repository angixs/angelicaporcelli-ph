import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = 'src/assets/photos';
const files = (await readdir(root, { recursive: true })).filter((path) => /\.(jpe?g|png|webp)$/i.test(path));
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
for (const file of files) {
	assert.equal(digest(await readFile(join(root, file))), digest(await readFile(join('dist/photos', file))), `Original changed: ${file}`);
}

const pages = ['dist/index.html', ...(await readdir('dist/collections')).map((slug) => `dist/collections/${slug}/index.html`)];
let thumbnails = 0;
for (const page of pages) {
	const document = await readFile(page, 'utf8');
	// Ignore selector names in inline CSS when locating rendered gallery elements.
	const html = document.slice(document.indexOf('<body'));
	let pageImages = 0;
	let priorityImages = 0;
	for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
		assert(tag.includes('decoding="async"'), `Missing asynchronous decoding: ${page}`);
		if (tag.includes('data-lightbox-image')) {
			assert(!/\ssrc=/.test(tag), 'Lightbox must not load before interaction');
			assert(!/\ssrcset=/.test(tag), 'Lightbox must not preload responsive sources');
			continue;
		}
		// The hero is first in the document; collection cards and gallery tiles follow.
		if (pageImages === 0) {
			assert(tag.includes('loading="eager"') && tag.includes('fetchpriority="high"'), `Hero must load eagerly at high priority: ${page}`);
			if (page === 'dist/index.html') {
				assert(tag.includes('resume-panel__image'), `Unexpected home hero: ${page}`);
			} else {
				assert(html.indexOf('page-hero__cover') < html.indexOf(tag) && html.indexOf(tag) < html.indexOf('gallery-section'), `Priority image must belong to the page hero: ${page}`);
			}
		} else {
			assert(tag.includes('loading="lazy"'), `Non-hero image must load lazily: ${page}`);
			assert(!tag.includes('fetchpriority="high"'), `Thumbnail competes with hero: ${page}`);
		}
		if (tag.includes('fetchpriority="high"')) priorityImages++;
		pageImages++;
		assert(tag.includes('srcset=') && tag.includes('sizes='), `Missing responsive sources: ${page}`);
		assert(/width="\d+"/.test(tag) && /height="\d+"/.test(tag), `Missing intrinsic size: ${page}`);
		assert(!tag.includes('src="/photos/'), `Original used as thumbnail: ${page}`);
		for (const [, url] of tag.matchAll(/(?:src="|,\s*)(\/_astro\/[^",]+?\.webp)/g)) {
			await stat(join('dist', decodeURIComponent(url)));
		}
		thumbnails++;
	}
	assert.equal(priorityImages, 1, `Expected one priority hero: ${page}`);
	for (const [, url] of html.matchAll(/data-full-src="([^"]+)"/g)) {
		await stat(join('dist', decodeURIComponent(url.replaceAll('&amp;', '&'))));
	}
}
console.log(`Verified ${files.length} byte-identical originals and ${thumbnails} responsive images across ${pages.length} pages.`);
console.log('Loading verified: one eager/high-priority hero per page; all remaining previews lazy; asynchronous decoding; no initial lightbox source.');

const generated = await readdir('dist/_astro');
for (const name of ['aaa', 'Auto_Poschiavo_1', 'Campo_Moro (1)', 'me']) {
	for (const file of generated.filter((file) => file.startsWith(`${name}.`) && file.endsWith('.webp'))) {
		const path = join('dist/_astro', file);
		const { width, height } = await sharp(path).metadata();
		if (width === 672) console.log(`${name}: ${width}×${height}, ${((await stat(path)).size / 1024).toFixed(1)} KiB`);
	}
}
