import { BaseService } from './commons.service';
export declare abstract class BaseController<T> {
    abstract getService(): BaseService<T>;
    findAll(query: any): Promise<T[]>;
    findOne(id: any): Promise<T>;
    findOneBy(query?: any): Promise<T>;
    findAllBy(query?: any): Promise<T[]>;
    save(entity: T): Promise<T>;
    saveMany(entities: T[]): Promise<T[]>;
    delete(id: any): Promise<void>;
    count(): Promise<number>;
}
