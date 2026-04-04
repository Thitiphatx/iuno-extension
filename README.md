# iuno-extension builder

This project is a boilerplate for creating extensions that can be bundled into a single JavaScript file and loaded dynamically by a website.

## Workflow

### 1. Implement your extension
Edit `src/index.ts`. Follow the pattern of the `SampleExtension` class:
- Implement the `IExtension` interface.
- Use `axios` for network requests.
- Use `cheerio` for HTML parsing.
- Export a default instance of your extension: `export default new MyExtension();`

### 2. Build the extension
Run the following command to bundle your code and all dependencies (`axios`, `cheerio`, etc.) into a single file:

```bash
npm run build
```

This will generate `dist/index.js`.

### 3. Upload to GitHub
1. Commit and push your `dist/index.js` to a GitHub repository.
2. Get the **Raw** link of the file. It should look like this:
   `https://raw.githubusercontent.com/username/repo/main/dist/index.js`

### 4. Use on your website
You can load the extension dynamically in your website using ES Modules `import()`:

```javascript
const extensionUrl = "https://raw.githubusercontent.com/username/repo/main/dist/index.js";
const module = await import(extensionUrl);
const extension = module.default;

// Now you can use the extension
const latest = await extension.getLatest(1);
console.log(latest);
```

## Development
To watch for changes and rebuild automatically:
```bash
npm run dev
```
