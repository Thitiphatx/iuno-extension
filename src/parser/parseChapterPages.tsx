import type { IPage } from "../core/types";
import type { IChapter, IMangaItem } from "../core/types/manga";
import type { INekopostChapterImage, INekopostMangaDetail, INekopostMangaItem } from "../type";

export async function parseChapterPages(data: INekopostChapterImage, mangaId: string, chapterId: string): Promise<string[]> {
    const pages: string[] = []

    for (const page of data.pageItem) {
        let imageFile: string = (page.pageName) ? `${page.pageName}` : `${page.fileName}`
        let image: string | undefined = `https://www.osemocphoto.com/collectManga/${mangaId}/${chapterId}/${imageFile}`
        if (image) pages.push(image)
    }

    return pages

} 