import type { IPage, ITag } from "../core/types";
import type { IChapter, IMangaDetail, IMangaItem } from "../core/types/manga";
import type { INekopostMangaDetail, INekopostMangaItem } from "../type";

export async function parseDetail(data: INekopostMangaDetail): Promise<IMangaDetail> {
    let isNSFW = false

    const id: string = data.projectInfo.projectId ?? ''
    const title: string = data.projectInfo.projectName ?? ''
    const alias: string = data.projectInfo.aliasName ?? ''
    let imageVersion: string = data.projectInfo.imageVersion ?? ''
    let cover: string = `https://www.osemocphoto.com/collectManga/${id}/${id}_cover.jpg?${imageVersion}`
    const author: string = data.projectInfo.authorName ?? ''
    const artist: string = data.projectInfo.artistName ?? ''
    const description: string = data.projectInfo.info ?? ''

    if (data.projectInfo.flgMature || data.projectInfo.flgGlue || data.projectInfo.flgIntense || data.projectInfo.flgReligion || data.projectInfo.flgViolent) isNSFW = true

    const tags: ITag[] = []
    for (const tag of data?.listCate) {
        const label: string = tag.cateName ?? ''
        const id: string = tag.cateCode ?? ''
        if (!id || !label) continue
        if (data.projectInfo.flgMature) isNSFW = true
        tags.push({ url: id, label: label })
    }

    const isCompleted: boolean = data.projectInfo.status === '0'

    return {
        cover,
        tags,
        title,
        alias,
        artist: { label: artist },
        author: { label: author },
        description,
        isCompleted,
        isNSFW
    }

} 