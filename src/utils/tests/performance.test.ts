import { describe, it, expect, vi } from 'vitest';
import { measurePerformance } from '../monitoring/performance';

describe('Performance Monitoring', () => {
  it('measures comment generation time', async () => {
    const metrics = await measurePerformance('commentGeneration', async () => {
      // Simuler la génération d'un commentaire
      await new Promise(resolve => setTimeout(resolve, 100));
      return { success: true };
    });

    expect(metrics.duration).toBeGreaterThan(0);
    expect(metrics.success).toBe(true);
  });

  it('tracks memory usage', async () => {
    const metrics = await measurePerformance('memoryUsage', () => {
      const arr = new Array(1000000).fill('test');
      return { success: true, size: arr.length };
    });

    expect(metrics.memoryUsage).toBeDefined();
    expect(metrics.memoryUsage?.heapUsed).toBeGreaterThan(0);
  });

  it('monitors concurrent operations', async () => {
    const operations = Array(5).fill(null).map((_, i) => 
      measurePerformance(`operation-${i}`, async () => {
        await new Promise(resolve => setTimeout(resolve, 50 * i));
        return { success: true };
      })
    );

    const results = await Promise.all(operations);
    
    expect(results).toHaveLength(5);
    results.forEach(result => {
      expect(result.success).toBe(true);
      expect(result.concurrent).toBeGreaterThanOrEqual(0);
    });
  });
});