import { NotFoundException } from '@/core/error/app-error.error';

import type { BaseRepository } from './base.repository';

export abstract class BaseService<T> {
  protected constructor(protected readonly repository?: BaseRepository<T>) {}

  protected async findByIdOrThrow(id: string): Promise<T> {
    if (!this.repository) {
      throw new Error('Repository is not defined on this service');
    }
    const data = await this.repository.findById(id);

    if (!data) {
      throw new NotFoundException('Resource not found');
    }
    return data;
  }

  async exists(filter: object): Promise<boolean> {
    if (!this.repository) {
      throw new Error('Repository is not defined on this service');
    }
    return this.repository.exists(filter);
  }

  async count(filter: object = {}): Promise<number> {
    if (!this.repository) {
      throw new Error('Repository is not defined on this service');
    }
    return this.repository.count(filter);
  }
}
