/**
 * Converts a Wikimedia Commons Special:FilePath URL to a displayable HTTPS thumbnail URL.
 * Returns null for unsupported formats (.tif) or missing URLs.
 */
export function toDisplayUrl(rawUrl, width = 300) {
  if (!rawUrl) return null
  let url = rawUrl.replace(/^http:\/\//, 'https://')
  if (/\.tiff?(\?|$)/i.test(url)) return null
  return `${url}?width=${width}`
}
