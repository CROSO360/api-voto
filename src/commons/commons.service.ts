import { FindManyOptions, Repository } from 'typeorm';

export abstract class BaseService<T> {
  abstract getRepository(): Repository<T>;

  async findAll(relations: string[] = []): Promise<T[]> {
    const options: FindManyOptions<T> = {};
    if (relations.length > 0) {
      options.relations = relations;
    }
    return this.getRepository().find(options);
  }

  findOne(id: any): Promise<T> {
    return this.getRepository().findOne({where: id});
  }

  async findAllBy(query: any, relations: string[]): Promise<T[]> {
    const entities = await this.getRepository().find({ where: query, relations });
    return entities;
  }

  save(entity: T): Promise<T> {
    return this.getRepository().save(entity);
  }

  saveMany(entities: T[]): Promise<T[]> {
    return this.getRepository().save(entities);
  }

  async delete(id: any) {
    await this.getRepository().delete(id);
  }

  count(options?: FindManyOptions<T>): Promise<number> {
    return this.getRepository().count(options);
  }
}