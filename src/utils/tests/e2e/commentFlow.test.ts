import { describe, it, expect, vi } from 'vitest';
import { test } from '@playwright/test';
import { setupE2ETest, cleanupE2ETest } from './helpers';

describe('End-to-End Comment Flow', () => {
  test('complete comment generation and posting flow', async ({ page }) => {
    await setupE2ETest();

    // Login
    await page.goto('/auth');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Configure site
    await page.click('text=Sites');
    await page.click('text=Ajouter un site');
    await page.fill('[name="name"]', 'Test Site');
    await page.fill('[name="url"]', 'https://example.com');
    await page.fill('[name="applicationPassword"]', 'test:pass');
    await page.click('text=Sauvegarder');

    // Create persona
    await page.click('text=Personas');
    await page.click('text=Créer un persona');
    await page.fill('[name="name"]', 'Test Persona');
    await page.selectOption('select[name="writingStyle"]', 'Informel');
    await page.click('text=Sauvegarder');

    // Configure schedule
    await page.click('text=Planification');
    await page.click('text=Nouvelle planification');
    await page.selectOption('select[name="siteId"]', '1');
    await page.fill('[name="frequency"]', '5');
    await page.click('text=Sauvegarder');

    // Verify comment generation
    await page.click('text=Dashboard');
    await expect(page.locator('text=Commentaires générés')).toBeVisible();

    await cleanupE2ETest();
  });
});