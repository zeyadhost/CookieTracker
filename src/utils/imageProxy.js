export function getProxiedImageUrl(url) {
  if (!url) return null;
  
  const isDev = import.meta.env.DEV;
  console.log('getProxiedImageUrl:', { url, isDev });
  
  if (!isDev) {
    if (url.includes('/rails/active_storage/blobs/proxy/')) {
      const match = url.match(/\/rails\/active_storage\/blobs\/proxy\/(.+)$/);
      if (match) {
        const encodedPath = match[1];
        const result = `/flavortown-images/${encodedPath}`;
        console.log('Proxy result:', result);
        return result;
      }
    }
    
    if (!url.startsWith('http') && !url.startsWith('/')) {
      const result = `/flavortown-images/${url}`;
      console.log('Proxy result (filename):', result);
      return result;
    }
  } else {
    if (url.startsWith('/rails/active_storage/')) {
      return `https://flavortown.hackclub.com${url}`;
    }
    if (!url.startsWith('http')) {
      return `https://flavortown.hackclub.com/rails/active_storage/blobs/proxy/${url}`;
    }
  }
  
  console.log('Proxy result (fallthrough):', url);
  return url;
}
