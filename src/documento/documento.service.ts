// =======================================================
// IMPORTACIONES
// =======================================================

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

import { Documento } from './documento.entity';
import { BaseService } from 'src/commons/commons.service';

// =======================================================
// SERVICIO: DocumentoService
// =======================================================

@Injectable()
export class DocumentoService extends BaseService<Documento> {
  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepo: Repository<Documento>,
  ) {
    super();
  }

  getRepository(): Repository<Documento> {
    return this.documentoRepo;
  }

  // ===================================================
  // MÉTODO: subirDocumento
  // Sube un archivo y crea el registro correspondiente
  // ===================================================

  async subirDocumento(file: Express.Multer.File): Promise<Documento> {
    if (!file) {
      throw new BadRequestException('No se ha recibido ningún archivo');
    }

    // Se construye la URL pública del archivo subido
    const fileUrl = `${process.env.APP_BASE_URL}/subidas/${file.filename}`;

    const nuevoDocumento = this.documentoRepo.create({
      nombre: file.originalname,
      url: fileUrl,
      fecha_subida: new Date(),
      estado: true,
      status: true,
    });

    return await this.documentoRepo.save(nuevoDocumento);
  }

  // ===================================================
  // MÉTODO: eliminarDocumento
  // Elimina el archivo del sistema y su registro
  // ===================================================

  async eliminarDocumento(id: number): Promise<{ message: string }> {
    const documento = await this.documentoRepo.findOne({
      where: { id_documento: id },
    });

    if (!documento) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado.`);
    }

    const filePath = path.join(
      process.cwd(),
      'uploads',
      path.basename(documento.url),
    );

    try {
      // Si el archivo existe en el sistema, se elimina
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(
          `Archivo no encontrado en ${filePath}, pero se eliminará el registro de BD.`,
        );
      }

      await this.documentoRepo.remove(documento);

      return {
        message: `Documento "${documento.nombre}" eliminado correctamente.`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al eliminar el documento.',
      );
    }
  }
}
