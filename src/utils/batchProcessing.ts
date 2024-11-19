// Traitement par lots pour réduire les appels API
export class BatchProcessor {
  private queue: any[] = [];
  private processing = false;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly process: (items: any[]) => Promise<void>,
    private readonly options = {
      maxBatchSize: 100,
      maxWaitTime: 1000
    }
  ) {}

  add(item: any) {
    this.queue.push(item);
    this.scheduleProcessing();
  }

  private scheduleProcessing() {
    if (this.timer) return;

    this.timer = setTimeout(() => {
      this.processQueue();
    }, this.options.maxWaitTime);

    if (this.queue.length >= this.options.maxBatchSize) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const batch = this.queue.splice(0, this.options.maxBatchSize);

    try {
      await this.process(batch);
    } finally {
      this.processing = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.queue.length > 0) {
        this.scheduleProcessing();
      }
    }
  }
}