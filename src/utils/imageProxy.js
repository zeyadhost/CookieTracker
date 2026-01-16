export function getProxiedImageUrl(url) {
  if (!url) return null;
  
  if (import.meta.env.DEV) {
    return url;
  }
  
  if (url.includes('flavortown.hackclub.com/rails/active_storage/blobs/proxy/')) {
    const encodedPath = url.split('/rails/active_storage/blobs/proxy/')[1];
    return `/flavortown-images/${encodedPath}`;
  }
  
  return url;
}
