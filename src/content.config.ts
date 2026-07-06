import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const photographyCollections = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/collections' }),
	schema: z.object({
		title: z.string(),
		subtitle: z.string(),
		description: z.string(),
		category: z.enum(['nature', 'portrait', 'street', 'animals', 'events']),
		location: z.string(),
		year: z.string(),
		cover: z.string().optional(),
		featured: z.boolean().default(true),
	}),
});

export const collections = {
	collections: photographyCollections,
};
