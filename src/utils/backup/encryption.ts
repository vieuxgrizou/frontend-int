// Chiffrement des données de sauvegarde
export async function encrypt(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await getEncryptionKey();
  
  // Générer un IV aléatoire
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Chiffrer les données
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data)
  );
  
  // Combiner IV et données chiffrées
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(data: string): Promise<string> {
  const decoder = new TextDecoder();
  const key = await getEncryptionKey();
  
  // Décoder les données
  const combined = new Uint8Array(
    atob(data).split('').map(c => c.charCodeAt(0))
  );
  
  // Extraire IV et données chiffrées
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);
  
  // Déchiffrer
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  
  return decoder.decode(decrypted);
}

async function getEncryptionKey(): Promise<CryptoKey> {
  // Utiliser une clé dérivée du secret de l'application
  const secret = import.meta.env.VITE_APP_SECRET || 'default-secret';
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('intensify-backup-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}