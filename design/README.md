# Adding your UI/UX case study PDFs

1. Drop your PDF files into this `/design` folder (e.g. `mobile-app-redesign.pdf`).
2. Open `script.js` and edit the `CASE_STUDIES` array near the top:

```js
const CASE_STUDIES = [
  { title: "Mobile App Redesign", desc: "End-to-end UX for a booking app.", file: "mobile-app-redesign.pdf" },
];
```

3. Save — the gallery tile, the "PDF" label, and the in-browser viewer are all generated automatically from this list. Leave `file: ""` for a placeholder tile if a case study isn't ready yet.
