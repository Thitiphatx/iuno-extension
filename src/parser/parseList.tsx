import type { IPage } from "../core/types";
import type { IMangaItem } from "../core/types/manga";
import type { INekopostMangaItem } from "../type";

export async function parseList(page: number, mangas: INekopostMangaItem[]): Promise<IPage<IMangaItem>> {
    const items: IMangaItem[] = []

    for (const manga of mangas) {
        const id: string = manga.projectId
        let imageVersion: string = manga.imageVersion ?? "1"
        let image: string = `https://www.osemocphoto.com/collectManga/${id}/${id}_cover.jpg?${imageVersion}`

        const title: string = manga.projectName ?? ''

        if (!id || !title) continue
        items.push({
            url: id,
            cover: image,
            title: manga.projectName,
            latestChapter: Number(manga.chapterNo) ?? undefined
        })
    }

    return {
        content: items,
        page,
        minPage: 1,
        maxPage: 10
    }

} 