# Angelica Porcelli Portfolio

Astro photography portfolio with local, folder-driven galleries.

## Adding Photos

Each collection has a JSON file in `src/content/collections/`. The file name is the collection slug.

To add photos, drop `.jpg`, `.jpeg`, `.png`, or `.webp` files into the matching folder in `public/photos/`.

Example:

```text
src/content/collections/coastal-studies.json
public/photos/coastal-studies/liguria.jpg
public/photos/coastal-studies/mountain-road.png
```

The site automatically loads those images at build time. File names become the photo labels by default, so `mountain-road.png` becomes `Mountain Road`.

## Optional Photo Metadata

Add a JSON file with the same base name as the image when you want custom text:

```text
public/photos/coastal-studies/liguria.jpg
public/photos/coastal-studies/liguria.json
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

## Commands

All commands are run from the root of the project.

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
