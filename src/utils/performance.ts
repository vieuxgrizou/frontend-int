import { debounce, throttle } from 'lodash-es';

// Mesure des performances
export function measurePerformance(name: string, fn: () => any) {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  // Envoie les métriques à un service de monitoring
  console.log(`Performance ${name}:`, duration);
  return result;
}

// Optimisation des événements fréquents
export const debouncedSearch = debounce(
  (query: string, callback: (results: any[]) => void) => {
    // Logique de recherche
    callback([]);
  },
  300
);

export const throttledScroll = throttle(
  (callback: () => void) => callback(),
  100
);

// Lazy loading des images
export function lazyLoadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

// Web Worker pour les tâches lourdes
const worker = new Worker(new URL('./worker.ts', import.meta.url));

export function runInWorker(task: string, data: any): Promise<any> {
  return new Promise((resolve) => {
    worker.postMessage({ task, data });
    worker.onmessage = (e) => resolve(e.data);
  });
}