import type { CollectionEntry } from 'astro:content';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

type PhotoCollection = CollectionEntry<'collections'>;

export interface GalleryImage {
	fileName: string;
	src: string;
	alt: string;
	title: string;
	caption: string;
	order: number;
	isCover: boolean;
}

interface ImageMetadata {
	name?: string;
	title?: string;
	alt?: string;
	caption?: string;
	order?: number;
	cover?: boolean;
}

const PHOTO_ROOT = join(process.cwd(), 'public', 'photos');
const IMAGE_EXTENSION_PATTERN = /\.(jpe?g|png|webp)$/i;

function titleFromFile(file: string) {
	const withoutExtension = basename(file, extname(file));

	return withoutExtension
		.split(/[-_]+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

function readImageMetadata(collectionDir: string, fileName: string): ImageMetadata {
	const metadataPath = join(collectionDir, `${basename(fileName, extname(fileName))}.json`);

	if (!existsSync(metadataPath)) return {};

	try {
		return JSON.parse(readFileSync(metadataPath, 'utf-8')) as ImageMetadata;
	} catch (error) {
		console.warn(`Could not read image metadata at ${metadataPath}`, error);
		return {};
	}
}

function normalizeImage(collectionDir: string, collectionId: string, fileName: string): GalleryImage {
	const metadata = readImageMetadata(collectionDir, fileName);
	const title = metadata.title ?? metadata.name ?? titleFromFile(fileName);
	const caption = metadata.caption ?? metadata.name ?? title;

	return {
		fileName,
		src: `/photos/${collectionId}/${fileName}`,
		alt: metadata.alt ?? `Photo of ${title}.`,
		title,
		caption,
		order: metadata.order ?? Number.MAX_SAFE_INTEGER,
		isCover: metadata.cover ?? false,
	};
}

export function getGallery(collection: PhotoCollection) {
	const collectionDir = join(PHOTO_ROOT, collection.id);

	const images = existsSync(collectionDir)
		? readdirSync(collectionDir)
				.filter((fileName) => IMAGE_EXTENSION_PATTERN.test(fileName))
				.map((fileName) => normalizeImage(collectionDir, collection.id, fileName))
				.sort((a, b) => {
					if (a.order !== b.order) return a.order - b.order;
					return a.fileName.localeCompare(b.fileName, undefined, { numeric: true });
				})
		: [];

	const cover =
		images.find((image) => image.fileName === collection.data.cover) ??
		images.find((image) => image.isCover) ??
		images[0];

	return { cover, images };
}
