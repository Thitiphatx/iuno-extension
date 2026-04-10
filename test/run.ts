import type { IAnimeExtension, IMangaExtension } from "../src/core/types/extension";
import extension from "../src"

function isMangaExtension(ext: any): ext is IMangaExtension {
    return 'getChapters' in ext;
}

function isAnimeExtension(ext: any): ext is IAnimeExtension {
    return 'getEpisodes' in ext;
}

async function runTest(extension: IMangaExtension | IAnimeExtension) {
    console.log(`\n--- Testing: ${extension.name} ---`);

    // Determine type
    const isManga = 'getChapters' in extension;
    const isAnime = 'getEpisodes' in extension;

    if (!isManga && !isAnime) {
        throw new Error("Invalid extension: Neither Anime nor Manga methods found.");
    }

    try {
        // --- SHARED TESTS ---
        console.log("1. Testing getLatest...");
        const latest = await extension.getLatest(1);
        const firstItem = latest.content[0];

        if (!firstItem) return console.log("No content found to continue tests.");

        console.log("2. Testing getDetail...");
        const detail = await extension.getDetail(firstItem.url);

        // --- TYPE-SPECIFIC TESTS ---
        if (isManga) {
            console.log(">> Detected Type: MANGA");
            
            const chapters = await extension.getChapters(firstItem.url);
            console.log(`Found ${chapters.length} chapters.`);
            
            if (chapters[0]) {
                const pages = await extension.getChapterPages(firstItem.url, chapters[0].url);
                console.log(`Found ${pages.length} pages in first chapter.`);
            }

        } else if (isAnime) {
            console.log(">> Detected Type: ANIME");
            
            const groups = await extension.getEpisodes(firstItem.url);
            console.log(`Found ${groups.length} episode groups.`);
            
            const firstEp = groups[0]?.episodes[0];
            if (firstEp) {
                const source = await extension.getVideoSource(firstEp.url);
                console.log(`Video source retrieved: ${source.substring(0, 30)}...`);
            }
        }

    } catch (err) {
        console.error("Test failed:", err.message);
    }
}

runTest(extension)