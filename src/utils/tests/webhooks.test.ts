import { describe, it, expect } from 'vitest';
import { validateWebhookSignature, generateWebhookSecret } from '../security/webhookSecurity';

describe('Webhook Security', () => {
  it('validates webhook signature correctly', async () => {
    const payload = JSON.stringify({ test: 'data' });
    const secret = generateWebhookSecret();
    const signature = await generateSignature(payload, secret);

    const isValid = await validateWebhookSignature(payload, signature, secret);
    expect(isValid).toBe(true);
  });

  it('rejects invalid signatures', async () => {
    const payload = JSON.stringify({ test: 'data' });
    const secret = generateWebhookSecret();
    const wrongSecret = generateWebhookSecret();
    const signature = await generateSignature(payload, wrongSecret);

    const isValid = await validateWebhookSignature(payload, signature, secret);
    expect(isValid).toBe(false);
  });

  it('generates unique webhook secrets', () => {
    const secret1 = generateWebhookSecret();
    const secret2 = generateWebhookSecret();
    expect(secret1).not.toBe(secret2);
    expect(secret1.length).toBeGreaterThan(32);
    expect(secret2.length).toBeGreaterThan(32);
  });
});

async function generateSignature(payload: string, secret: string): Promise<string> {
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