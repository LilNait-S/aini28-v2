export interface Params {
  params: Promise<{
    [params: string]: string
  }>
  searchParams: Promise<{
    [searchParams: string]: string | string[] | undefined
  }>
}
