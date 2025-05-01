export const makeApiUrl = (baseUrl: string, prefix?: string) => {
  if (prefix) return baseUrl + prefix
  return baseUrl
}
