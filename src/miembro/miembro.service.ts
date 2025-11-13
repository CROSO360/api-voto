// =======================================================
// IMPORTACIONES
// =======================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// =======================================================
// ENTIDADES Y SERVICIOS BASE
// =======================================================

import { Miembro } from './miembro.entity';
import { BaseService } from 'src/commons/commons.service';
import { MiembroConReemplazoDto } from 'src/auth/dto/miembros-reemplazos.dto';

// =======================================================
// SERVICIO: MiembroService
// =======================================================

@Injectable()
export class MiembroService extends BaseService<Miembro> {
  constructor(
    @InjectRepository(Miembro)
    private readonly miembroRepo: Repository<Miembro>,
  ) {
    super();
  }

  getRepository(): Repository<Miembro> {
    return this.miembroRepo;
  }

  async getMiembrosYReemplazos(): Promise<MiembroConReemplazoDto[]> {
    const miembros = await this.miembroRepo.find({
      relations: [
        'usuario',
        'usuario.grupoUsuario',
        'usuario.usuarioReemplazo',
        'usuario.usuarioReemplazo.grupoUsuario',
      ],
    });

    const resultado: MiembroConReemplazoDto[] = [];
    const agregados = new Set<number>();

    const agregarItem = (
      idUsuario: number | undefined,
      nombre: string | undefined,
      grupo: string | null,
      reemplazo: string | null,
      esReemplazo: boolean,
    ) => {
      if (!idUsuario || !nombre || agregados.has(idUsuario)) {
        return;
      }

      resultado.push({
        idUsuario: idUsuario,
        nombre: nombre,
        grupoUsuario: grupo,
        reemplazo,
        esReemplazo,
      });
      agregados.add(idUsuario);
    };

    for (const miembro of miembros) {
      const usuario = miembro.usuario;
      if (!usuario) {
        continue;
      }

      const grupoDelUsuario = usuario.grupoUsuario?.nombre ?? null;
      const reemplazo = usuario.usuarioReemplazo ?? null;

      agregarItem(
        usuario.id_usuario,
        usuario.nombre,
        grupoDelUsuario,
        reemplazo?.nombre ?? null,
        false,
      );

      if (reemplazo) {
        const grupoReemplazo = reemplazo.grupoUsuario?.nombre ?? grupoDelUsuario;
        agregarItem(
          reemplazo.id_usuario,
          reemplazo.nombre,
          grupoReemplazo,
          usuario.nombre,
          true,
        );
      }
    }

    return resultado;
  }
}
