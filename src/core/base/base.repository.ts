import type {
  HydratedDocument,
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

export abstract class BaseRepository<T> {
  protected constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    return this.model.create(data);
  }

  async findById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findById(id, projection, options).lean() as unknown as Promise<T | null>;
  }

  async findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findOne(filter, projection, options).lean() as unknown as Promise<T | null>;
  }

  async find(
    filter: QueryFilter<T> = {},
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return this.model.find(filter, projection, options).lean() as unknown as Promise<T[]>;
  }

  async updateById(
    id: string,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, ...options })
      .lean() as unknown as Promise<T | null>;
  }

  async updateOne(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, { new: true, ...options })
      .lean() as unknown as Promise<T | null>;
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).lean() as unknown as Promise<T | null>;
  }

  async deleteOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).lean() as unknown as Promise<T | null>;
  }

  async exists(filter: QueryFilter<T>): Promise<boolean> {
    const exists = await this.findOne(filter);
    return !!exists;
  }

  async count(filter: QueryFilter<T>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async insertMany(data: Partial<T>[]): Promise<T[]> {
    return this.model.insertMany(data) as unknown as Promise<T[]>;
  }

  async createOrUpdate(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, { new: true, upsert: true })
      .lean() as unknown as Promise<T | null>;
  }

  async softDelete(id: string): Promise<T | null> {
    return this.updateById(id, {
      deletedAt: new Date(),
    } as UpdateQuery<T>);
  }
}
