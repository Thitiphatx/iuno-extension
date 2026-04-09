import type { IPage } from "../core/types";
import type { IChapter, IMangaItem } from "../core/types/manga";
import type { INekopostMangaDetail, INekopostMangaItem } from "../type";

export async function parseChapters(data: INekopostMangaDetail): Promise<IChapter[]> {
    const chapters: IChapter[] = []

    for (const [i, chapter] of data.listChapter.entries()) {
        const title: string = chapter.chapterName ?? ''
        const chapterId: string = chapter.chapterId ?? ''

        if (!chapterId) continue

        const chapNum = Number(chapter.chapterNo)


        const date: Date = new Date(chapter.publishDate)

        if (!chapterId || !title) continue

        chapters.push({
            url: chapterId,
            name: title,
            number: isNaN(chapNum) ? i : chapNum,
            time: date,
        })
    }

    return chapters

} 