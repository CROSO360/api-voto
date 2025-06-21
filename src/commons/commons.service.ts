// =======================================================
// IMPORTACIONES
// =======================================================

import { FindManyOptions, Repository } from 'typeorm';

// =======================================================
// SERVICIO BASE GENÉRICO
// =======================================================

export abstract class BaseService<T> {
  // Método que debe ser implementado en cada servicio hijo
  abstract getRepository(): Repository<T>;

  // Buscar todos los registros, con relaciones opcionales
  async findAll(relations: string[] = []): Promise<T[]> {
    const options: FindManyOptions<T> = {};
    if (relations.length > 0) {
      options.relations = relations;
    }
    return this.getRepository().find(options);
  }

  // Buscar un registro por ID o criterio simple
  findOne(id: any): Promise<T> {
    return this.getRepository().findOne({ where: id });
  }

  // Buscar un registro con condiciones y relaciones específicas
  async findOneBy(query: any, relations: string[]): Promise<T> {
    return this.getRepository().findOne({ where: query, relations });
  }

  // Buscar múltiples registros con condiciones y relaciones
  async findAllBy(query: any, relations: string[]): Promise<T[]> {
    return this.getRepository().find({ where: query, relations });
  }

  // Guardar un registro
  save(entity: T): Promise<T> {
    return this.getRepository().save(entity);
  }

  // Guardar múltiples registros
  saveMany(entities: T[]): Promise<T[]> {
    return this.getRepository().save(entities);
  }

  // Eliminar por ID o condición
  async delete(id: any): Promise<void> {
    await this.getRepository().delete(id);
  }

  // Contar registros con condiciones opcionales
  count(options?: FindManyOptions<T>): Promise<number> {
    return this.getRepository().count(options);
  }
}
