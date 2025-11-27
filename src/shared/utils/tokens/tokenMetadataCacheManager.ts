const tokenMetadataCache = new Map<string, { 
    name: string; 
    symbol: string; 
    decimals: number; 
    logoURI: string | undefined; 
  }>();
  
// Get cached metadata or store new metadata
export const getCachedTokenMetadata = (chainId: number, address: string) => {
  const cacheKey = `${chainId}-${address}`;
  return tokenMetadataCache.get(cacheKey);
};
  
export const setCachedTokenMetadata = (chainId: number, address: string, metadata: { 
    name: string; 
    symbol: string; 
    decimals: number; 
    logoURI: string | undefined; 
  }) => {
  const cacheKey = `${chainId}-${address}`;
  tokenMetadataCache.set(cacheKey, metadata);
};