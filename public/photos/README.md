# Photo Folders

Each collection loads photos from the folder that matches its collection file name.

For `src/content/collections/coastal-studies.json`, add images here:

```text
public/photos/coastal-studies/
```

Supported image files:

```text
.jpg
.jpeg
.png
.webp
```

Optional metadata can be added with a JSON file that has the same base name as the image:

```text
public/photos/coastal-studies/liguria.jpg
public/photos/coastal-studies/liguria.json
```

Example metadata:

```json
{
	"name": "Liguria",
	"caption": "Evening light on the coast.",
	"alt": "Rocky Ligurian coastline in evening light.",
	"order": 1,
	"cover": true
}
```

Only `name` is needed for simple labels. All fields are optional.
