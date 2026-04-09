export interface IVideoResponse {
  id: string
  slug: string
  title: string
  thumbnail: number
  file: {
    id: string
  }
  customThumbnail?: {
    id: string
    name: string
  }
}