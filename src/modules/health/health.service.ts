import mongoose from 'mongoose';

import { BaseService } from '@/core/base/base.service';

export class HealthService extends BaseService<unknown> {
  private readonly startTime: number;
  private cachedHealth: {
    status: string;
    database: string;
    uptime: number;
    memory: {
      rss: string;
      heapTotal: string;
      heapUsed: string;
    };
  } | null = null;
  private lastChecked = 0;
  private readonly cacheDurationMs = 5000; // Cache checks for 5 seconds to optimize performance

  constructor() {
    super();
    this.startTime = Date.now();
  }

  public async check() {
    const now = Date.now();

    if (this.cachedHealth && now - this.lastChecked < this.cacheDurationMs) {
      return {
        ...this.cachedHealth,
        timeStamp: new Date().toISOString(),
      };
    }

    const dbState = mongoose.connection.readyState;
    let dbStatus = 'DOWN';
    if (dbState === 1) {
      dbStatus = 'UP';
    } else if (dbState === 2) {
      dbStatus = 'CONNECTING';
    }

    const memory = process.memoryUsage();
    const data = {
      status: dbStatus === 'UP' ? 'UP' : 'DOWN',
      database: dbStatus,
      uptime: Math.floor((now - this.startTime) / 1000),
      memory: {
        rss: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      },
    };

    this.cachedHealth = data;
    this.lastChecked = now;

    return {
      ...data,
      timeStamp: new Date().toISOString(),
    };
  }
}
