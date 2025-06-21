// ==========================================
// IMPORTACIONES
// ==========================================
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, FindManyOptions, Repository } from 'typeorm';

import { Punto } from './punto.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Resolucion } from 'src/resolucion/resolucion.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';

import { BaseService } from 'src/commons/commons.service';
import { CreatePuntoDto } from 'src/auth/dto/create-punto.dto';
import { ResultadoManualDto } from 'src/auth/dto/resultado-manual.dto';

// ==========================================
// SERVICIO: PuntoService
// ==========================================
@Injectable()
export class PuntoService {
  constructor(
    @InjectRepository(Punto) private puntoRepo: Repository<Punto>,
    @InjectRepository(Sesion) private readonly sesionRepo: Repository<Sesion>,
    @InjectRepository(Resolucion)
    private readonly resolucionRepo: Repository<Resolucion>,
    @InjectRepository(PuntoUsuario)
    private readonly puntoUsuarioRepo: Repository<PuntoUsuario>,
    private dataSource: DataSource,
  ) {}

  // ========================================
  // MÉTODOS BÁSICOS (consultas y persistencia)
  // ========================================

  getRepository(): Repository<Punto> {
    return this.puntoRepo;
  }

  async findAll(relations: string[] = []): Promise<Punto[]> {
    const options: FindManyOptions<Punto> = {};
    if (relations.length > 0) options.relations = relations;
    return this.puntoRepo.find(options);
  }

  findOne(id: any): Promise<Punto> {
    return this.puntoRepo.findOne({ where: id });
  }

  async findOneBy(query: any, relations: string[]): Promise<Punto> {
    return this.puntoRepo.findOne({ where: query, relations });
  }

  async findAllBy(query: any, relations: string[]): Promise<Punto[]> {
    return this.puntoRepo.find({ where: query, relations });
  }

  save(entity: Punto): Promise<Punto> {
    return this.puntoRepo.save(entity);
  }

  saveMany(entities: Punto[]): Promise<Punto[]> {
    return this.puntoRepo.save(entities);
  }

  count(options?: FindManyOptions<Punto>): Promise<number> {
    return this.puntoRepo.count(options);
  }

  // ========================================
  // CREACIÓN DE PUNTOS
  // ========================================
  async crearPunto(createPuntoDto: CreatePuntoDto): Promise<Punto> {
    const { idSesion, nombre, detalle, es_administrativa } = createPuntoDto;

    const sesion = await this.sesionRepo.findOne({
      where: { id_sesion: idSesion },
    });
    if (!sesion)
      throw new BadRequestException(`La sesión con ID ${idSesion} no existe.`);

    const maxOrden = await this.puntoRepo
      .createQueryBuilder('punto')
      .select('COALESCE(MAX(punto.orden), 0)', 'max')
      .where('punto.id_sesion = :idSesion', { idSesion })
      .getRawOne();

    const nuevoOrden = Number(maxOrden.max) + 1;

    const nuevoPunto = this.puntoRepo.create({
      sesion,
      nombre,
      detalle: detalle || '',
      orden: nuevoOrden,
      es_administrativa: es_administrativa || false,
    });

    return await this.puntoRepo.save(nuevoPunto);
  }

  // ========================================
  // ELIMINACIÓN DE PUNTOS
  // ========================================
  async eliminarPunto(idPunto: number): Promise<void> {
    const punto = await this.puntoRepo.findOne({
      where: { id_punto: idPunto },
      relations: ['sesion'],
    });

    if (!punto) throw new BadRequestException('El punto no existe.');
    if (punto.status !== true)
      throw new BadRequestException(
        'No se puede eliminar un punto que ya ha sido tratado.',
      );

    const idSesion = punto.sesion.id_sesion;

    await this.puntoRepo.delete(idPunto);

    await this.puntoRepo
      .createQueryBuilder()
      .update(Punto)
      .set({ orden: () => 'orden - 1' })
      .where('id_sesion = :idSesion AND orden > :orden', {
        idSesion,
        orden: punto.orden,
      })
      .execute();
  }

  // ========================================
  // REORDENAMIENTO DE PUNTOS
  // ========================================
  async reordenarPunto(
    idPunto: number,
    posicionInicial: number,
    posicionFinal: number,
  ): Promise<void> {
    const punto = await this.puntoRepo.findOne({
      where: { id_punto: idPunto },
      relations: ['sesion'],
    });

    if (!punto) throw new BadRequestException('El punto no existe.');

    const idSesion = punto.sesion.id_sesion;

    await this.puntoRepo.manager.transaction(async (manager) => {
      let puntos = await manager.find(Punto, {
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

      const puntoMovido = puntos.find((p) => p.id_punto === idPunto);
      if (!puntoMovido)
        throw new BadRequestException(
          'El punto a mover no se encuentra en el rango afectado.',
        );

      puntoMovido.orden = 999;
      await manager.save(puntoMovido); // Temporalmente a 999

      for (const actual of puntos) {
        if (actual.id_punto === idPunto) continue;
        const nuevoOrden =
          posicionInicial < posicionFinal ? actual.orden - 1 : actual.orden + 1;

        if (nuevoOrden < 1)
          throw new BadRequestException(
            `No se puede asignar un orden menor que 1.`,
          );

        const ocupante = puntos.find(
          (p) => p.orden === nuevoOrden && p.id_punto !== idPunto,
        );
        if (!ocupante) {
          actual.orden = nuevoOrden;
          await manager.save(actual);
        }
      }

      puntoMovido.orden = posicionFinal;
      await manager.save(puntoMovido);

      const puntosFinales = await manager.find(Punto, {
        where: { sesion: { id_sesion: idSesion }, status: true },
        order: { orden: 'ASC' },
      });

      for (let i = 0; i < puntosFinales.length; i++) {
        puntosFinales[i].orden = i + 1;
        await manager.save(puntosFinales[i]);
      }
    });
  }

  // ========================================
  // CÁLCULO AUTOMÁTICO DE RESULTADOS
  // ========================================
  async calcularResultados(id_punto: number): Promise<void> {
    const punto = await this.puntoRepo.findOne({
      where: { id_punto },
      relations: [
        'resolucion',
        'puntoUsuarios',
        'puntoUsuarios.usuario',
        'puntoUsuarios.usuario.grupoUsuario',
      ],
    });

    if (!punto) throw new NotFoundException('Punto no encontrado');

    let puntoUsuarios = punto.puntoUsuarios.filter((pu) => pu.estado);

    if (punto.es_administrativa) {
      puntoUsuarios = puntoUsuarios.filter(
        (pu) => pu.usuario.grupoUsuario.nombre.toLowerCase() !== 'trabajador',
      );
    }

    let n_afavor = 0,
      n_encontra = 0,
      n_abstencion = 0;
    let p_afavor = 0,
      p_encontra = 0,
      p_abstencion = 0;
    let totalPeso = 0;

    for (const pu of puntoUsuarios) {
      const peso = pu.usuario.grupoUsuario.peso || 0;
      if (!pu.opcion || peso === 0) continue;

      totalPeso += peso;

      switch (pu.opcion) {
        case 'afavor':
          n_afavor++;
          p_afavor += peso;
          break;
        case 'encontra':
          n_encontra++;
          p_encontra += peso;
          break;
        case 'abstencion':
          n_abstencion++;
          p_abstencion += peso;
          break;
      }
    }

    const normalizar = (valor: number) =>
      totalPeso > 0 ? parseFloat(((valor / totalPeso) * 100).toFixed(2)) : 0;

    punto.n_afavor = n_afavor;
    punto.n_encontra = n_encontra;
    punto.n_abstencion = n_abstencion;

    punto.p_afavor = normalizar(p_afavor);
    punto.p_encontra = normalizar(p_encontra);
    punto.p_abstencion = normalizar(p_abstencion);

    if (punto.resolucion) {
      punto.resolucion.voto_manual = false;
      await this.resolucionRepo.save(punto.resolucion);
    }

    if (
      punto.p_afavor > punto.p_encontra &&
      punto.p_afavor > punto.p_abstencion
    ) {
      punto.resultado = 'aprobada';
    } else if (
      punto.p_encontra > punto.p_afavor &&
      punto.p_encontra > punto.p_abstencion
    ) {
      punto.resultado = 'rechazada';
    } else {
      punto.resultado = 'pendiente';
    }

    await this.resolucionRepo.save(punto.resolucion);
    await this.puntoRepo.save(punto);
  }

  // ========================================
  // CÁLCULO MANUAL DE RESULTADOS
  // ========================================
  async calcularResultadosManual(dto: ResultadoManualDto): Promise<void> {
    const { id_punto, id_usuario, resultado } = dto;

    const punto = await this.puntoRepo.findOne({
      where: { id_punto },
      relations: ['resolucion'],
    });

    if (!punto) throw new NotFoundException('Punto no encontrado');
    if (!punto.resolucion)
      throw new BadRequestException(
        'No se puede registrar el resultado manual sin una resolución',
      );

    punto.resultado = resultado;
    punto.resolucion.voto_manual = true;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`SET @usuario_actual = ?`, [id_usuario]);
      await queryRunner.manager.save(punto.resolucion);
      await queryRunner.manager.save(punto);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error al guardar la resolución manual:', error);
      throw new BadRequestException('No se pudo guardar el resultado manual.');
    } finally {
      await queryRunner.release();
    }
  }

  // ========================================
  // CONSULTA AVANZADA DE RESULTADOS
  // ========================================
  async getResultadosPunto(idPunto: number): Promise<any[]> {
    const query = `
      SELECT
        gu.nombre AS grupo_usuario,
        COALESCE(SUM(CASE WHEN pu.opcion = 'afavor' THEN 1 ELSE 0 END), 0) AS afavor,
        ROUND(COALESCE(SUM(CASE WHEN pu.opcion = 'afavor' THEN gu.peso ELSE 0 END), 2), 2) AS afavor_peso,
        COALESCE(SUM(CASE WHEN pu.opcion = 'encontra' THEN 1 ELSE 0 END), 0) AS encontra,
        ROUND(COALESCE(SUM(CASE WHEN pu.opcion = 'encontra' THEN gu.peso ELSE 0 END), 2), 2) AS encontra_peso,
        COALESCE(SUM(CASE WHEN pu.opcion = 'abstencion' THEN 1 ELSE 0 END), 0) AS abstencion,
        ROUND(COALESCE(SUM(CASE WHEN pu.opcion = 'abstencion' THEN gu.peso ELSE 0 END), 2), 2) AS abstencion_peso
      FROM grupo_usuario gu
      LEFT JOIN usuario u ON gu.id_grupo_usuario = u.id_grupo_usuario
      LEFT JOIN punto_usuario pu ON u.id_usuario = pu.id_usuario AND pu.id_punto = ?
      GROUP BY gu.nombre
      ORDER BY
        CASE
          WHEN gu.nombre = 'rector' THEN 1
          WHEN gu.nombre = 'vicerrector' THEN 2
          WHEN gu.nombre = 'decano' THEN 3
          WHEN gu.nombre = 'profesor' THEN 4
          WHEN gu.nombre = 'estudiante' THEN 5
          WHEN gu.nombre = 'trabajador' THEN 6
          ELSE 7
        END;
    `;

    const resultados = await this.puntoRepo.query(query, [idPunto]);

    const totales = resultados.reduce(
      (acc, item) => {
        acc.afavor += parseInt(item.afavor);
        acc.afavor_peso += parseFloat(item.afavor_peso);
        acc.encontra += parseInt(item.encontra);
        acc.encontra_peso += parseFloat(item.encontra_peso);
        acc.abstencion += parseInt(item.abstencion);
        acc.abstencion_peso += parseFloat(item.abstencion_peso);
        return acc;
      },
      {
        afavor: 0,
        afavor_peso: 0,
        encontra: 0,
        encontra_peso: 0,
        abstencion: 0,
        abstencion_peso: 0,
      },
    );

    totales.afavor_peso = +totales.afavor_peso.toFixed(2);
    totales.encontra_peso = +totales.encontra_peso.toFixed(2);
    totales.abstencion_peso = +totales.abstencion_peso.toFixed(2);

    return [...resultados, { resultado: totales }];
  }
}
