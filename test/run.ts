import extension from "../src/index";

async function runTest() {
    console.log(`--- Testing Extension: ${extension.name} (${extension.id}) ---`);

    try {
        console.log("\n1. Testing getLatest...");
        const latest = await extension.getLatest(1);
        console.log("Result:", JSON.stringify(latest, null, 2));

        const firstItem = latest.content[0];
        if (firstItem) {
            const firstItemUrl = firstItem.url;

            console.log("\n2. Testing getSearchResult...");
            const search = await extension.getSearchResult("test", 1);
            console.log("Result summary: Count =", search.content.length);

            console.log(`\n3. Testing getDetail for: ${firstItemUrl}...`);
            const detail = await extension.getDetail(firstItemUrl);
            console.log("Result:", JSON.stringify(detail, null, 2));

            console.log(`\n4. Testing getEpisodes for: ${firstItemUrl}...`);
            const episodes = await extension.getEpisodes(firstItemUrl);
            console.log("Result summary: Groups =", episodes.length);

            const firstGroup = episodes[0];
            const firstEpisode = firstGroup?.episodes[0];
            if (firstEpisode) {
                const firstEpisodeUrl = firstEpisode.url;
                console.log(`\n5. Testing getVideoSource for: ${firstEpisodeUrl}...`);
                const videoSource = await extension.getVideoSource(firstEpisodeUrl);
                console.log("Result:", videoSource);
            }
        } else {
            console.log("\nSkipping further tests because getLatest returned no items.");
            
            // Still try to run them with dummy URLs if possible for structural check
            console.log("\n--- Running with fallback URLs for structural check ---");
            
            const dummyUrl = `${extension.baseUrl}/anime/test`;
            
            console.log("\n2. Testing getSearchResult...");
            const search = await extension.getSearchResult("test", 1);
            console.log("Result summary: Count =", search.content.length);

            console.log(`\n3. Testing getDetail (fallback)...`);
            const detail = await extension.getDetail(dummyUrl);
            console.log("Result:", JSON.stringify(detail, null, 2));

            console.log(`\n4. Testing getEpisodes (fallback)...`);
            const episodes = await extension.getEpisodes(dummyUrl);
            console.log("Result summary: Groups =", episodes.length);

            console.log(`\n5. Testing getVideoSource (fallback)...`);
            const videoSource = await extension.getVideoSource(dummyUrl);
            console.log("Result:", videoSource);
        }

    } catch (error) {
        console.error("\nTest failed with error:");
        if (error instanceof Error) {
            console.error(error.message);
            console.error(error.stack);
        } else {
            console.error(error);
        }
    }

    console.log("\n--- Test Finished ---");
}

runTest();
