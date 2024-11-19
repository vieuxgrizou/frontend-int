// Utilise crypto.subtle pour la génération et la vérification des signatures
export async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );

  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const expectedSignature = await generateSignature(payload, secret);
    return signature === expectedSignature;
  } catch (error) {
    console.error('Webhook signature validation failed:', error);
    return false;
  }
}

export function generateWebhookSecret(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function validateWebhook(
  payload: any,
  signature: string,
  secret: string,
  maxAge: number = 300000
): Promise<boolean> {
  // Vérifier la signature
  const isValid = await validateWebhookSignature(
    JSON.stringify(payload),
    signature,
    secret
  );
  
  if (!isValid) {
    return false;
  }

  // Vérifier l'âge du webhook
  const timestamp = payload.timestamp;
  if (!timestamp) {
    return false;
  }

  const age = Date.now() - new Date(timestamp).getTime();
  return age <= maxAge;
}