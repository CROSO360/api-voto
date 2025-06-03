import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Resolucion } from './resolucion.entity';
import { BaseService } from 'src/commons/commons.service';
import { UpdateResolucionDto } from 'src/auth/dto/update-resolucion.dto';

@Injectable()
export class ResolucionService extends BaseService<Resolucion> {
  constructor(
    @InjectRepository(Resolucion)
    private resolucionRepo: Repository<Resolucion>,
    private dataSource: DataSource,
  ) {
    super();
  }

  getRepository(): Repository<Resolucion> {
    return this.resolucionRepo;
  }

  async actualizarResolucion(dto: UpdateResolucionDto): Promise<void> {
    const { id_punto, id_usuario, nombre, descripcion, voto_manual } = dto;
    const fecha = new Date();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Establecer el usuario actual en la misma conexión
      await queryRunner.query(`SET @usuario_actual = ?`, [id_usuario]);

      // 2️⃣ Ejecutar el update incluyendo voto_manual si viene en el DTO
      const updateData: Partial<Resolucion> = {
        nombre,
        descripcion,
        fecha,
      };

      if (voto_manual !== undefined) {
        updateData.voto_manual = voto_manual;
      }

      await queryRunner.manager.update(Resolucion, id_punto, updateData);

      // 3️⃣ Confirmar cambios
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
