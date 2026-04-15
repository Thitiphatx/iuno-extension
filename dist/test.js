// src/test.ts
async function loadExtension() {
  try {
    const url = "https://raw.githubusercontent.com/Thitiphatx/iuno-extension/refs/heads/manga-nekopost/dist/index.js";
    const { default: nekopostExtension } = await import(url);
    console.log(await nekopostExtension.getLatest(1));
  } catch (error) {
  }
}
loadExtension();
//# sourceMappingURL=test.js.map
