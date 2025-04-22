import { BadRequestException, Injectable } from '@nestjs/common';
import { Punto } from './punto.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { CreatePuntoDto } from 'src/auth/dto/create-punto.dto';
import { Sesion } from 'src/sesion/sesion.entity';

@Injectable()
export class PuntoService {
  constructor(
    @InjectRepository(Punto) private puntoRepo: Repository<Punto>,
    @InjectRepository(Sesion)
    private readonly sesionRepo: Repository<Sesion>,
  ) {}

  getRepository(): Repository<Punto> {
    return this.puntoRepo;
  }

  async findAll(relations: string[] = []): Promise<Punto[]> {
    const options: FindManyOptions<Punto> = {};
    if (relations.length > 0) {
      options.relations = relations;
    }
    return this.getRepository().find(options);
  }

  findOne(id: any): Promise<Punto> {
    return this.getRepository().findOne({ where: id });
  }

  async findOneBy(query: any, relations: string[]): Promise<Punto> {
    const entity = await this.getRepository().findOne({
      where: query,
      relations,
    });
    return entity;
  }

  async findAllBy(query: any, relations: string[]): Promise<Punto[]> {
    const entities = await this.getRepository().find({
      where: query,
      relations,
    });
    return entities;
  }

  save(entity: Punto): Promise<Punto> {
    return this.getRepository().save(entity);
  }

  saveMany(entities: Punto[]): Promise<Punto[]> {
    return this.getRepository().save(entities);
  }

  count(options?: FindManyOptions<Punto>): Promise<number> {
    return this.getRepository().count(options);
  }

  async crearPunto(createPuntoDto: CreatePuntoDto): Promise<Punto> {
    const { idSesion, nombre, detalle, es_administrativa } = createPuntoDto;

    // Verificar si la sesión existe
    const sesion = await this.sesionRepo.findOne({
      where: { id_sesion: idSesion },
    });
    if (!sesion) {
      throw new BadRequestException(`La sesión con ID ${idSesion} no existe.`);
    }

    // Obtener el mayor número de orden en la sesión actual
    const maxOrden = await this.puntoRepo
      .createQueryBuilder('punto')
      .select('COALESCE(MAX(punto.orden), 0)', 'max')
      .where('punto.id_sesion = :idSesion', { idSesion })
      .getRawOne();

    // Asignar el siguiente número en la secuencia
    const nuevoOrden = Number(maxOrden.max) + 1;

    // Crear el nuevo punto con orden secuencial
    const nuevoPunto = this.puntoRepo.create({
      sesion,
      nombre,
      detalle: detalle || '',
      orden: nuevoOrden,
      es_administrativa: es_administrativa || false,
    });

    return await this.puntoRepo.save(nuevoPunto);
  }

  async eliminarPunto(idPunto: number): Promise<void> {
    // Buscar el punto a eliminar junto con su sesión
    const punto = await this.puntoRepo.findOne({
      where: { id_punto: idPunto },
      relations: ['sesion'],
    });

    if (!punto) {
      throw new BadRequestException('El punto no existe.');
    }

    // Verificar que el punto no haya sido tratado (estado pendiente)
    if (punto.status !== true) {
      throw new BadRequestException(
        'No se puede eliminar un punto que ya ha sido tratado.',
      );
    }

    // Guardar el ID de la sesión para reajustar los demás puntos
    const idSesion = punto.sesion.id_sesion;

    // Eliminar el punto
    await this.puntoRepo.delete(idPunto);

    // Reajustar el orden de los puntos restantes en la misma sesión
    await this.puntoRepo
      .createQueryBuilder()
      .update(Punto)
      .set({ orden: () => 'orden - 1' }) // Reducir el orden en 1
      .where('id_sesion = :idSesion AND orden > :orden', {
        idSesion,
        orden: punto.orden,
      })
      .execute();
  }

  async reordenarPunto(
    idPunto: number,
    posicionInicial: number,
    posicionFinal: number,
  ): Promise<void> {
    const punto = await this.puntoRepo.findOne({
      where: { id_punto: idPunto },
      relations: ['sesion'],
    });

    if (!punto) {
      throw new BadRequestException('El punto no existe.');
    }

    const idSesion = punto.sesion.id_sesion;

    await this.puntoRepo.manager.transaction(
      async (transactionalEntityManager) => {
        // Paso 1: Obtener los puntos afectados
        let puntos = await transactionalEntityManager.find(Punto, {
          where: {
            sesion: { id_sesion: idSesion },
            status: true,
            orden:
              posicionInicial < posicionFinal
                ? Between(posicionInicial, posicionFinal)
                : Between(posicionFinal, posicionInicial),
          },
          order: { orden: posicionInicial < posicionFinal ? 'ASC' : 'DESC' },
        });

        // Paso 2: Extraer el punto a mover y asignarle un valor temporal en BD
        const puntoMovido = puntos.find((p) => p.id_punto === idPunto);
        if (!puntoMovido) {
          throw new BadRequestException(
            'El punto a mover no se encuentra en el rango afectado.',
          );
        }

        puntoMovido.orden = 999;
        await transactionalEntityManager.save(puntoMovido); // Temporalmente a 999

        // Paso 3: Reordenar los demás puntos afectados
        for (let i = 0; i < puntos.length; i++) {
          const actual = puntos[i];
          if (actual.id_punto === idPunto) continue;

          const nuevoOrden =
            posicionInicial < posicionFinal
              ? actual.orden - 1
              : actual.orden + 1;

          if (nuevoOrden < 1) {
            throw new BadRequestException(
              `No se puede asignar un orden menor que 1. El punto ${actual.nombre} intentó tomar el orden ${nuevoOrden}.`,
            );
          }

          const ocupante = puntos.find(
            (p) => p.orden === nuevoOrden && p.id_punto !== idPunto,
          );
          if (!ocupante) {
            actual.orden = nuevoOrden;
            await transactionalEntityManager.save(actual);
          }
        }

        // Paso 4: Asignar la posición final al punto movido
        puntoMovido.orden = posicionFinal;
        await transactionalEntityManager.save(puntoMovido);

        // Paso final extra: Reordenamiento global para evitar huecos
        const puntosFinales = await transactionalEntityManager.find(Punto, {
          where: { sesion: { id_sesion: idSesion }, status: true },
          order: { orden: 'ASC' },
        });

        for (let i = 0; i < puntosFinales.length; i++) {
          puntosFinales[i].orden = i + 1;
          await transactionalEntityManager.save(puntosFinales[i]);
        }
      },
    );
  }

  async getResultadosPunto(idPunto: number): Promise<any> {
    const query = `
            SELECT
                gu.nombre AS grupo_usuario,
                COALESCE(SUM(CASE WHEN pu.opcion = 'afavor' THEN 1 ELSE 0 END), 0) AS afavor,
                COALESCE(SUM(CASE WHEN pu.opcion = 'afavor' THEN gu.peso ELSE 0 END), 0) AS afavor_peso,
                COALESCE(SUM(CASE WHEN pu.opcion = 'encontra' THEN 1 ELSE 0 END), 0) AS encontra,
                COALESCE(SUM(CASE WHEN pu.opcion = 'encontra' THEN gu.peso ELSE 0 END), 0) AS encontra_peso,
                COALESCE(SUM(CASE WHEN pu.opcion = 'abstinencia' THEN 1 ELSE 0 END), 0) AS abstinencia,
                COALESCE(SUM(CASE WHEN pu.opcion = 'abstinencia' THEN gu.peso ELSE 0 END), 0) AS abstinencia_peso
            FROM
                grupo_usuario gu
            LEFT JOIN
                usuario u ON gu.id_grupo_usuario = u.id_grupo_usuario
            LEFT JOIN
                punto_usuario pu ON u.id_usuario = pu.id_usuario AND pu.id_punto = ?
            GROUP BY
                gu.nombre
            ORDER BY
                CASE
                    WHEN gu.nombre = 'rector' THEN 1
                    WHEN gu.nombre = 'vicerrector' THEN 2
                    WHEN gu.nombre = 'decano' THEN 3
                    WHEN gu.nombre = 'profesor' THEN 4
                    WHEN gu.nombre = 'estudiante' THEN 5
                    WHEN gu.nombre = 'trabajador' THEN 6
                    ELSE 7 -- Para otros grupos de usuarios no especificados
                END;
        `;
    const results = await this.puntoRepo.query(query, [idPunto]);
    return results;
  }

  /*async registerResultadosPunto(idPunto: number): Promise<void> {
        const query = `
            UPDATE punto
            SET
                n_afavor = (
                    SELECT COUNT(*)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'afavor'
                ),
                afavor = (
                    SELECT SUM(gu.peso)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'afavor'
                ),
                n_encontra = (
                    SELECT COUNT(*)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'encontra'
                ),
                encontra = (
                    SELECT SUM(gu.peso)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'encontra'
                ),
                n_abstinencia = (
                    SELECT COUNT(*)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'abstinencia'
                ),
                abstinencia = (
                    SELECT SUM(gu.peso)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'abstinencia'
                )
            WHERE
                id_punto = ?;
        `;
        await this.puntoRepo.query(query, [idPunto, idPunto, idPunto, idPunto, idPunto, idPunto, idPunto]);
    }*/

  /*async registerResultadosPunto(idPunto: number): Promise<void> {
    const query = `
                UPDATE punto
                SET
                    n_afavor = COALESCE(resultados.n_afavor, 0),
                    afavor = COALESCE(resultados.afavor, 0),
                    n_encontra = COALESCE(resultados.n_encontra, 0),
                    encontra = COALESCE(resultados.encontra, 0),
                    n_abstinencia = COALESCE(resultados.n_abstinencia, 0),
                    abstinencia = COALESCE(resultados.abstinencia, 0)
                FROM (
                    SELECT
                        SUM(CASE WHEN pu.opcion = 'afavor' THEN 1 ELSE 0 END) AS n_afavor,
                        SUM(CASE WHEN pu.opcion = 'afavor' THEN gu.peso ELSE 0 END) AS afavor,
                        SUM(CASE WHEN pu.opcion = 'encontra' THEN 1 ELSE 0 END) AS n_encontra,
                        SUM(CASE WHEN pu.opcion = 'encontra' THEN gu.peso ELSE 0 END) AS encontra,
                        SUM(CASE WHEN pu.opcion = 'abstinencia' THEN 1 ELSE 0 END) AS n_abstinencia,
                        SUM(CASE WHEN pu.opcion = 'abstinencia' THEN gu.peso ELSE 0 END) AS abstinencia
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                ) AS resultados
                WHERE id_punto = ?;
            `;

    await this.puntoRepo.query(query, [idPunto, idPunto]);
  }*/
  async registerResultadosPunto(idPunto: number): Promise<void> {
    const query = `
            UPDATE punto
            SET
                n_afavor = COALESCE((
                    SELECT COUNT(*)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'afavor'
                ), 0),
                afavor = COALESCE((
                    SELECT SUM(gu.peso)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'afavor'
                ), 0),
                n_encontra = COALESCE((
                    SELECT COUNT(*)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'encontra'
                ), 0),
                encontra = COALESCE((
                    SELECT SUM(gu.peso)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'encontra'
                ), 0),
                n_abstinencia = COALESCE((
                    SELECT COUNT(*)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'abstinencia'
                ), 0),
                abstinencia = COALESCE((
                    SELECT SUM(gu.peso)
                    FROM punto_usuario pu
                    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario
                    INNER JOIN grupo_usuario gu ON u.id_grupo_usuario = gu.id_grupo_usuario
                    WHERE pu.id_punto = ?
                        AND pu.opcion = 'abstinencia'
                ), 0)
            WHERE
                id_punto = ?;
        `;

    await this.puntoRepo.query(query, [
      idPunto,
      idPunto,
      idPunto,
      idPunto,
      idPunto,
      idPunto,
      idPunto,
    ]);
  }
}
