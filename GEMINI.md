# Iuno Extension Workspace

This workspace is dedicated to developing extensions for the Iuno application.

## Extension Structure

An Iuno extension is a single-file JavaScript bundle (usually `dist/index.js`) that exports an object implementing the `IAnimeExtension` or `IMangaExtension` interface.

## Development Workflow

1. **Implement Parsers:** Use the utilities in `src/parser/` to extract data from target websites.
2. **Define Metadata:** Ensure the extension object contains required fields: `id`, `name`, `version`, `type` (anime/manga), etc.
3. **Build:** Run the build script to generate the bundled file in `dist/index.js`.
4. **Deploy:** Push the `dist/index.js` to a publicly accessible URL (typically GitHub).

## Technical Constraints

- **Single Bundle:** The app loads a single script. All dependencies must be bundled.
- **No Node.js Built-ins:** Extensions run in a restricted React Native environment. Use `axios` or `fetch` for networking.
- **Parsing:** Use `cheerio` or regex for HTML parsing. Avoid heavy DOM manipulation libraries.

## Interfaces

- `IAnimeExtension`:
  - `getLatest()`
  - `getSearchResult(query)`
  - `getDetail(id)`
  - `getEpisodes(id)`
  - `getVideoSource(episodeId)`
- `IMangaExtension`:
  - `getLatest()`
  - `getSearchResult(query)`
  - `getDetail(id)`
  - `getChapters(id)`
  - `getChapterPages(chapterId)`
