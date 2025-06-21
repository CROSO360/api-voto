// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Resolucion } from './resolucion.entity';
import { BaseService } from 'src/commons/commons.service';
import { UpdateResolucionDto } from 'src/auth/dto/update-resolucion.dto';

// =======================================================
// SERVICIO: ResolucionService
// =======================================================

@Injectable()
export class ResolucionService extends BaseService<Resolucion> {
  constructor(
    @InjectRepository(Resolucion)
    private readonly resolucionRepo: Repository<Resolucion>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  getRepository(): Repository<Resolucion> {
    return this.resolucionRepo;
  }

  // ✅ Actualiza nombre, descripción, fecha y voto_manual (opcional)
  async actualizarResolucion(dto: UpdateResolucionDto): Promise<void> {
    const { id_punto, id_usuario, nombre, descripcion, voto_manual } = dto;
    const fecha = new Date();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Establecer el usuario actual para auditoría
      await queryRunner.query(`SET @usuario_actual = ?`, [id_usuario]);

      // 2. Armar el objeto de actualización
      const updateData: Partial<Resolucion> = { nombre, descripcion, fecha };
      if (voto_manual !== undefined) {
        updateData.voto_manual = voto_manual;
      }

      // 3. Ejecutar el update
      await queryRunner.manager.update(Resolucion, id_punto, updateData);

      // 4. Confirmar cambios
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
