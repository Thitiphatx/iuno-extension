import type { IPage } from "../core/types"
import type { IAnimeItem } from "../core/types/anime"
import extension from "../index"
import type { IVideoResponse } from "../core/types/videoResponse"

export async function parseLatest(
  animeItems: IVideoResponse[],
  page: number = 0,
): Promise<IPage<IAnimeItem>> {
  const items: IAnimeItem[] = animeItems.map((item: IVideoResponse) => {
    const url = `${extension.baseUrl}/video/${item.id}/${item.slug}`
    const cover = item.customThumbnail
      ? `${extension.thumbnailUrl}/image/thumbnail/${item.customThumbnail.id}/${item.customThumbnail.name}`
      : `${extension.thumbnailUrl}/image/thumbnail/${item.file.id}/thumbnail-${item.thumbnail < 10 ? `0${item.thumbnail}` : item.thumbnail}.jpg`;
    return {
      url: url,
      title: item.title,
      cover: cover
    }
  })
  return {
    content: items,
    page: page,
    minPage: 1,
    maxPage: 10,
  };
}
