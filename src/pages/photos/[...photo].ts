import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// Prerender the original URLs for existing links and on-demand lightbox use.
// These bytes are never recompressed and require no Cloudflare runtime service.
export const getStaticPaths: GetStaticPaths = () => {
	const root = join(process.cwd(), 'src', 'assets', 'photos');
	return readdirSync(root, { recursive: true, encoding: 'utf8' })
		.filter((path) => /\.(jpe?g|png|webp)$/i.test(path))
		.map((path) => ({
			params: { photo: path.replaceAll('\\', '/') },
			props: { path: join(root, path) },
		}));
};

export const GET: APIRoute = async ({ props }) => {
	const data = await readFile(props.path);
	const extension = props.path.split('.').pop().toLowerCase();
	const type = extension === 'jpg' || extension === 'jpeg' ? 'jpeg' : extension;
	return new Response(new Uint8Array(data), { headers: { 'Content-Type': `image/${type}` } });
};
