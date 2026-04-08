export interface IPage<T> {
  content: T[]
  page: number
  minPage: number
  maxPage: number
}

export interface ITag {
  label: string;
  url?: string;
}
