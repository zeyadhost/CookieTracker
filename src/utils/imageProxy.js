export function getProxiedImageUrl(url) {
  if (!url) return null;
  
  if (import.meta.env.DEV) {
    if (url.startsWith('/rails/active_storage/')) {
      return `https://flavortown.hackclub.com${url}`;
    }
    if (!url.startsWith('http')) {
      return `https://flavortown.hackclub.com/rails/active_storage/blobs/proxy/${url}`;
    }
    return url;
  }
  
  if (url.includes('flavortown.hackclub.com/rails/active_storage/blobs/proxy/')) {
    const encodedPath = url.split('/rails/active_storage/blobs/proxy/')[1];
    return `/flavortown-images/${encodedPath}`;
  }
  
  if (url.startsWith('/rails/active_storage/blobs/proxy/')) {
    const encodedPath = url.replace('/rails/active_storage/blobs/proxy/', '');
    return `/flavortown-images/${encodedPath}`;
  }
  
  if (!url.startsWith('http') && !url.startsWith('/')) {
    return `/flavortown-images/${url}`;
  }
  
  return url;
}
