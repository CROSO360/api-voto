import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/commons/commons.service';
import { Documento } from './documento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentoService extends BaseService<Documento>{

    constructor(
        @InjectRepository(Documento) private documentoRepo: Repository<Documento>
    ){
        super();
    }

    getRepository(): Repository<Documento> {
        return this.documentoRepo;
    }

    async subirDocumento(file: Express.Multer.File): Promise<Documento> {
        if (!file) {
            throw new BadRequestException('No se ha recibido ningún archivo');
        }
    
        // 📌 Usar el nombre real del archivo en lugar de generarlo nuevamente
        const fileUrl = `http://localhost:3000/subidas/${file.filename}`;
    
        const nuevoDocumento = this.documentoRepo.create({
            nombre: file.originalname,
            url: fileUrl,
            fecha_subida: new Date(),
            estado: true,
            status: true,
        });
    
        return await this.documentoRepo.save(nuevoDocumento);
    }
    
    async eliminarDocumento(id: number): Promise<{ message: string }> {
        const documento = await this.documentoRepo.findOne({ where: { id_documento: id } });

        if (!documento) {
            throw new NotFoundException(`Documento con ID ${id} no encontrado.`);
        }

        const filePath = path.join(process.cwd(), 'uploads', path.basename(documento.url));

        try {
            // 📌 Verificar si el archivo existe antes de eliminarlo
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // ✅ Eliminar archivo de la carpeta `uploads/`
            } else {
                console.warn(`Archivo no encontrado en ${filePath}, pero eliminando registro de la base de datos.`);
            }

            // ✅ Eliminar el registro de la base de datos
            await this.documentoRepo.remove(documento);

            return { message: `Documento ${documento.nombre} eliminado correctamente.` };
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar el documento.');
        }
    }

}

