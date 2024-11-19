// Compression des données de sauvegarde
export async function compress(data: string): Promise<string> {
  // Utiliser CompressionStream quand disponible
  if (typeof CompressionStream !== 'undefined') {
    const blob = new Blob([data]);
    const compressed = blob.stream().pipeThrough(new CompressionStream('gzip'));
    return 'compressed:' + await new Response(compressed).text();
  }
  
  // Fallback: compression simple
  return 'compressed:' + btoa(data);
}

export async function decompress(data: string): Promise<string> {
  // Utiliser DecompressionStream quand disponible
  if (typeof DecompressionStream !== 'undefined') {
    const blob = new Blob([data]);
    const decompressed = blob.stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(decompressed).text();
  }
  
  // Fallback: décompression simple
  return atob(data);
}