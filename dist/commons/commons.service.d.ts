import { FindManyOptions, Repository } from 'typeorm';
export declare abstract class BaseService<T> {
    abstract getRepository(): Repository<T>;
    findAll(relations?: string[]): Promise<T[]>;
    findOne(id: any): Promise<T>;
    findOneBy(query: any, relations: string[]): Promise<T>;
    findAllBy(query: any, relations: string[]): Promise<T[]>;
    save(entity: T): Promise<T>;
    saveMany(entities: T[]): Promise<T[]>;
    delete(id: any): Promise<void>;
    count(options?: FindManyOptions<T>): Promise<number>;
}
