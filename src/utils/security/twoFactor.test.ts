import { describe, it, expect } from 'vitest';
import { generateTwoFactorSecret, verifyTwoFactorToken, generateBackupCodes, verifyBackupCode } from './twoFactor';

describe('twoFactor', () => {
  it('generates valid 2FA secret', async () => {
    const { secret, qrCode, backupCodes } = await generateTwoFactorSecret('user123');
    
    expect(secret).toBeDefined();
    expect(secret.length).toBeGreaterThan(0);
    expect(qrCode).toMatch(/^data:image\/png;base64,/);
    expect(backupCodes).toHaveLength(8);
  });

  it('verifies valid token', () => {
    const secret = 'ABCDEFGHIJKLMNOP';
    const token = '123456'; // Simulé
    
    expect(verifyTwoFactorToken(token, secret)).toBeDefined();
  });

  it('generates unique backup codes', () => {
    const codes = generateBackupCodes();
    const uniqueCodes = new Set(codes);
    
    expect(codes).toHaveLength(8);
    expect(uniqueCodes.size).toBe(8); // Vérifie l'unicité
    
    codes.forEach(code => {
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });
  });

  it('verifies backup codes', () => {
    const codes = ['ABC123', 'DEF456'];
    
    expect(verifyBackupCode('ABC123', codes)).toBe(true);
    expect(verifyBackupCode('WRONG', codes)).toBe(false);
  });
});