// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	build: {
		// Ship the small shared stylesheet with the HTML to avoid a blocking request.
		inlineStylesheets: 'always',
	},
});
