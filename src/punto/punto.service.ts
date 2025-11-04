// ==========================================
// IMPORTACIONES
// ==========================================
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  EntityManager,
  FindManyOptions,
  QueryFailedError,
  Repository,
} from 'typeorm';

import { Punto } from './punto.entity';
import { Sesion } from 'src/sesion/sesion.entity';
import { Resolucion } from 'src/resolucion/resolucion.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { PuntoGrupo } from 'src/punto-grupo/punto-grupo.entity';

import { BaseService } from 'src/commons/commons.service';
import { CreatePuntoDto } from 'src/auth/dto/create-punto.dto';
import { ResultadoManualDto } from 'src/auth/dto/resultado-manual.dto';
import { Miembro } from 'src/miembro/miembro.entity';
import { VotoDto } from 'src/auth/dto/voto.dto';
import { Usuario } from 'src/usuario/usuario.entity';
import { PuntoUsuarioService } from 'src/punto-usuario/punto-usuario.service';
import { Auditoria } from 'src/auditoria/auditoria.entity';
import { Asistencia } from 'src/asistencia/asistencia.entity';
import { Resultado } from 'src/resultado/resultado.entity';

type EstadoInterno = 'APROBADO' | 'RECHAZADO' | 'SIN_MAYORIA';
type EstadoFinal = 'aprobada' | 'rechazada' | 'pendiente' | 'empate';

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
    @InjectRepository(PuntoGrupo)
    private readonly puntoGrupoRepo: Repository<PuntoGrupo>,
    @InjectRepository(Miembro)
    private readonly miembroRepo: Repository<Miembro>,
    private dataSource: DataSource,
    private puntoUsuarioService: PuntoUsuarioService,
    @InjectRepository(Asistencia)
    private asistenciaRepo: Repository<Asistencia>,
    @InjectRepository(Resultado)
    private readonly resultadoRepo: Repository<Resultado>,
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
    const {
      idSesion,
      nombre,
      detalle,
      es_administrativa,
      calculo_resultado,
    } = createPuntoDto;

    // 🟡 Verificar existencia de la sesión
    const sesion = await this.sesionRepo.findOne({
      where: { id_sesion: idSesion },
    });
    if (!sesion) {
      throw new BadRequestException(`La sesión con ID ${idSesion} no existe.`);
    }

    // 🟡 Calcular el siguiente valor de orden
    const maxOrden = await this.puntoRepo
      .createQueryBuilder('punto')
      .select('COALESCE(MAX(punto.orden), 0)', 'max')
      .where('punto.id_sesion = :idSesion', { idSesion })
      .getRawOne();
    const nuevoOrden = Number(maxOrden.max) + 1;

    // 🟢 Crear nuevo punto
    const nuevoPunto = this.puntoRepo.create({
      sesion,
      nombre,
      detalle: detalle || '',
      orden: nuevoOrden,
      es_administrativa: es_administrativa || false,
      calculo_resultado: calculo_resultado || 'mayoria_simple',
    });
    const puntoGuardado = await this.puntoRepo.save(nuevoPunto);

    // 🔵 Calcular mapa de es_principal para los usuarios en la sesión
    const mapaEsPrincipal = await this.calcularMapaEsPrincipal(idSesion);

    // 🟢 Obtener miembros activos
    const miembros = await this.miembroRepo.find({
      where: { estado: true, status: true },
      relations: ['usuario', 'usuario.grupoUsuario'],
    });

    // 🟢 Generar registros de punto_usuario
    const puntoUsuarios = miembros.map((miembro) => {
      const usuario = miembro.usuario;
      const grupo = usuario.grupoUsuario?.nombre?.toLowerCase() || '';

      const esTrabajador = grupo === 'trabajador';
      const esRector = grupo === 'rector';

      const es_administrativa_invalida = es_administrativa && esTrabajador;

      const es_principal = mapaEsPrincipal[usuario.id_usuario] ?? true;

      return this.puntoUsuarioRepo.create({
        punto: puntoGuardado,
        usuario: { id_usuario: usuario.id_usuario },
        estado: esRector ? false : !es_administrativa_invalida, // ⬅️ Aplica aquí la lógica del rector
        es_principal,
      });
    });

    if (puntoUsuarios.length) {
      await this.puntoUsuarioRepo
        .createQueryBuilder()
        .insert()
        .into(PuntoUsuario)
        .values(
          puntoUsuarios.map((pu) => ({
            // ⚠️ Usa relaciones (ManyToOne) en vez de ids planos para que cuadre con tu entidad
            punto: { id_punto: puntoGuardado.id_punto },
            usuario: { id_usuario: (pu as any).usuario?.id_usuario },

            // ⚠️ Mantén booleanos (no 0/1) para que no choque con el tipo de la entidad
            estado: !!pu.estado,
            es_principal: !!pu.es_principal,
          })),
        )
        .orIgnore() // ← ignora filas que choquen con UNIQUE (id_punto, id_usuario)
        .execute();
    }

    await this.puntoUsuarioService.syncEstadoByPunto(
      puntoGuardado.id_punto,
      idSesion,
    );

    await this.inicializarResolucionYResultado(puntoGuardado);

    return puntoGuardado;
  }

  /*async crearPunto(createPuntoDto: CreatePuntoDto): Promise<Punto> {
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
  }*/

  /**
   * Determina el valor correcto de `es_principal` para cada usuario en base a sus registros existentes.
   * Si no hay registros previos, se asume `true`.
   */
  private async calcularMapaEsPrincipal(
    sesionId: number,
  ): Promise<Record<number, boolean>> {
    const registros = await this.puntoUsuarioRepo.find({
      where: { punto: { sesion: { id_sesion: sesionId } } },
      relations: ['usuario', 'punto'],
    });

    const mapa: Record<number, boolean> = {};

    const agrupados = new Map<number, boolean[]>();

    for (const registro of registros) {
      const idUsuario = registro.usuario.id_usuario;
      if (!agrupados.has(idUsuario)) {
        agrupados.set(idUsuario, []);
      }
      agrupados.get(idUsuario)!.push(registro.es_principal ?? true);
    }

    for (const [idUsuario, lista] of agrupados) {
      const cantidadTrue = lista.filter((x) => x === true).length;
      const cantidadFalse = lista.length - cantidadTrue;
      mapa[idUsuario] = cantidadTrue >= cantidadFalse;
    }

    return mapa;
  }

  // ========================================
  // ELIMINACIÓN DE PUNTOS
  // ========================================
  async eliminarPunto(idPunto: number): Promise<void> {
  const qr = this.dataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    // 1) Cargar el punto con lo que necesitamos (lock opcional si quieres máxima seguridad)
    const punto = await qr.manager.findOne(Punto, {
      where: { id_punto: idPunto },
      relations: ['sesion', 'resolucion', 'resolucion.auditorias'],
      // lock: { mode: 'pessimistic_write' },
    });

    if (!punto) throw new BadRequestException('El punto no existe.');
    if (punto.sesion.fase !== 'pendiente') {
      throw new BadRequestException(
        `No se puede eliminar un punto si la sesión está ${punto.sesion.fase}.`,
      );
    }

    const idSesion = punto.sesion.id_sesion;
    const ordenPunto = punto.orden;

    // 2) Si hay resolución, eliminar primero sus auditorías (si existen) y luego la resolución
    if (punto.resolucion) {
      // Auditoría usa FK id_punto hacia Resolucion
      await qr.manager
        .createQueryBuilder()
        .delete()
        .from(Auditoria)
        .where('id_punto = :idPunto', { idPunto })
        .execute();

      await qr.manager.delete(Resolucion, { id_punto: idPunto });
      // si no quieres borrar la resolución cuando existan auditorías (política estricta),
      // en lugar de borrarlas arriba, lanza error si había alguna.
      // if (punto.resolucion.auditorias?.length) throw new BadRequestException('No se puede eliminar una resolución con auditorías.');
    }

    // 3) Eliminar el punto (esto cascada los PuntoUsuario, etc., según tu FK ON DELETE CASCADE)
    await qr.manager.delete(Punto, { id_punto: idPunto });

    // 4) Reordenar los puntos restantes de la sesión
    await qr.manager
      .createQueryBuilder()
      .update(Punto)
      .set({ orden: () => 'orden - 1' })
      .where('id_sesion = :idSesion AND orden > :orden', {
        idSesion,
        orden: ordenPunto,
      })
      .execute();

    await qr.commitTransaction();
  } catch (err) {
    await qr.rollbackTransaction();
    throw err;
  } finally {
    await qr.release();
  }
}

  /*async eliminarPunto(idPunto: number): Promise<void> {
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
  }*/

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

  /**
   * Incrementa en 1 el orden de todos los puntos que tengan orden >= desdeOrden
   * dentro de la sesión especificada. Se usa para insertar un nuevo punto
   * entre otros ya existentes sin sobrescribir el orden.
   *
   * @param idSesion - ID de la sesión donde se realiza la operación
   * @param desdeOrden - Orden desde el cual se deben desplazar los puntos
   */
  async incrementarOrdenDesde(
    idSesion: number,
    desdeOrden: number,
  ): Promise<void> {
    await this.puntoRepo
      .createQueryBuilder()
      .update(Punto)
      .set({ orden: () => 'orden + 1' })
      .where('id_sesion = :idSesion AND orden >= :desdeOrden', {
        idSesion,
        desdeOrden,
      })
      .execute();
  }

  // ========================================
  // RECONSIDERACIÓN DE PUNTOS
  // ========================================

  /**
   * Crea un nuevo punto de tipo 'reconsideracion' justo después del punto original.
   * Desplaza el orden de los puntos posteriores si es necesario.
   *
   * @param idPuntoOriginal - ID del punto que se desea reconsiderar
   * @returns Punto creado
   */
  async crearReconsideracion(idPuntoOriginal: number): Promise<Punto> {
    const puntoOriginal = await this.puntoRepo.findOne({
      where: { id_punto: idPuntoOriginal },
      relations: ['sesion'],
    });

    if (!puntoOriginal) {
      throw new NotFoundException('Punto original no encontrado.');
    }

    // Validar si ya existe una reconsideración para este punto
    const yaExiste = await this.puntoRepo.findOne({
      where: {
        puntoReconsiderado: { id_punto: idPuntoOriginal },
        tipo: 'reconsideracion',
      },
    });

    if (yaExiste) {
      throw new BadRequestException(
        'Ya existe una reconsideración para este punto.',
      );
    }

    const sesion = puntoOriginal.sesion;

    const puntoReconsideracion = this.puntoRepo.create({
      sesion,
      nombre: `Reconsideración de: ${puntoOriginal.nombre}`,
      detalle: `Solicitud de reconsideración del punto "${puntoOriginal.nombre}"`,
      orden: 999, // Orden temporal
      es_administrativa: puntoOriginal.es_administrativa,
      tipo: 'reconsideracion',
      puntoReconsiderado: puntoOriginal,
      calculo_resultado: puntoOriginal.calculo_resultado || 'mayoria_simple',
      estado: true,
      status: true,
      resultado: null,
      requiere_voto_dirimente: false,
      n_afavor: 0,
      n_encontra: 0,
      n_abstencion: 0,
      p_afavor: 0,
      p_encontra: 0,
      p_abstencion: 0,
    });

    const puntoGuardado = await this.puntoRepo.save(puntoReconsideracion);

    await this.reordenarPunto(
      puntoGuardado.id_punto,
      999,
      puntoOriginal.orden + 1,
    );

    const mapaEsPrincipal = await this.calcularMapaEsPrincipal(
      sesion.id_sesion,
    );
    const miembros = await this.miembroRepo.find({
      where: { estado: true, status: true },
      relations: ['usuario', 'usuario.grupoUsuario'],
    });

    const puntoUsuarios = miembros.map((miembro) => {
      const usuario = miembro.usuario;
      const grupoNombre = usuario.grupoUsuario?.nombre?.toLowerCase() || '';

      const esTrabajador = grupoNombre === 'trabajador';
      const esRector = grupoNombre === 'rector';

      const es_administrativa_invalida =
        puntoOriginal.es_administrativa && esTrabajador;

      const estado = esRector ? false : !es_administrativa_invalida;
      const es_principal = mapaEsPrincipal[usuario.id_usuario] ?? true;

      return this.puntoUsuarioRepo.create({
        punto: puntoGuardado,
        usuario: { id_usuario: usuario.id_usuario },
        estado,
        es_principal,
      });
    });

    await this.bulkInsertPuntoUsuariosOrIgnore(
      puntoGuardado.id_punto,
      miembros,
      mapaEsPrincipal,
      puntoOriginal.es_administrativa,
    );
    await this.puntoUsuarioService.syncEstadoByPunto(
      puntoGuardado.id_punto,
      sesion.id_sesion
    );

    await this.inicializarResolucionYResultado(puntoGuardado);

    return puntoGuardado;
  }

  /**
   * Genera un nuevo punto (tipo 'repetido') como copia del punto original
   * después de que se aprueba una reconsideración.
   *
   * @param idPuntoReconsideracion - ID del punto de reconsideración aprobado
   * @returns Punto generado para volver a resolver
   */
  async aprobarReconsideracion(idPuntoReconsideracion: number): Promise<Punto> {
    const puntoReconsideracion = await this.puntoRepo.findOne({
      where: { id_punto: idPuntoReconsideracion },
      relations: ['sesion', 'puntoReconsiderado'],
    });

    if (!puntoReconsideracion) {
      throw new NotFoundException('Punto de reconsideración no encontrado.');
    }

    const puntoOriginal = puntoReconsideracion.puntoReconsiderado;
    if (!puntoOriginal) {
      throw new BadRequestException(
        'Este punto no está vinculado a uno original.',
      );
    }

    if (puntoReconsideracion.resultado !== 'aprobada') {
      throw new BadRequestException(
        'No se puede repetir el punto si la reconsideración no fue aprobada.',
      );
    }

    // Validar si ya existe repetición
    const yaRepetido = await this.puntoRepo.findOne({
      where: {
        puntoReconsiderado: { id_punto: puntoOriginal.id_punto },
        tipo: 'repetido',
      },
    });

    if (yaRepetido) {
      throw new BadRequestException(
        'Este punto ya fue reconsiderado y repetido una vez.',
      );
    }

    const sesion = puntoReconsideracion.sesion;

    const puntoRepetido = this.puntoRepo.create({
      sesion,
      nombre: `${puntoOriginal.nombre} (Reconsiderado)`,
      detalle: puntoOriginal.detalle,
      orden: 999,
      es_administrativa: puntoOriginal.es_administrativa,
      tipo: 'repetido',
      puntoReconsiderado: puntoOriginal,
      calculo_resultado: puntoOriginal.calculo_resultado || 'mayoria_simple',
      estado: true,
      status: true,
      resultado: null,
      requiere_voto_dirimente: false,
      n_afavor: 0,
      n_encontra: 0,
      n_abstencion: 0,
      p_afavor: 0,
      p_encontra: 0,
      p_abstencion: 0,
    });

    const puntoGuardado = await this.puntoRepo.save(puntoRepetido);

    await this.reordenarPunto(
      puntoGuardado.id_punto,
      999,
      puntoReconsideracion.orden + 1,
    );

    const mapaEsPrincipal = await this.calcularMapaEsPrincipal(
      sesion.id_sesion,
    );
    const miembros = await this.miembroRepo.find({
      where: { estado: true, status: true },
      relations: ['usuario', 'usuario.grupoUsuario'],
    });

    const puntoUsuarios = miembros.map((miembro) => {
      const usuario = miembro.usuario;
      const grupoNombre = usuario.grupoUsuario?.nombre?.toLowerCase() || '';

      const esTrabajador = grupoNombre === 'trabajador';
      const esRector = grupoNombre === 'rector';

      const es_administrativa_invalida =
        puntoOriginal.es_administrativa && esTrabajador;

      const estado = esRector ? false : !es_administrativa_invalida;
      const es_principal = mapaEsPrincipal[usuario.id_usuario] ?? true;

      return this.puntoUsuarioRepo.create({
        punto: puntoGuardado,
        usuario: { id_usuario: usuario.id_usuario },
        estado,
        es_principal,
      });
    });

    await this.bulkInsertPuntoUsuariosOrIgnore(
      puntoGuardado.id_punto,
      miembros,
      mapaEsPrincipal,
      puntoOriginal.es_administrativa,
    );

    await this.puntoUsuarioService.syncEstadoByPunto(
      puntoGuardado.id_punto,
      sesion.id_sesion,
    );

    await this.inicializarResolucionYResultado(puntoGuardado);

    return puntoGuardado;
  }

  // 🔧 Helper reutilizable
  private async bulkInsertPuntoUsuariosOrIgnore(
    puntoId: number,
    miembros: Miembro[],
    mapaEsPrincipal: Record<number, boolean>,
    esAdministrativa: boolean,
  ) {
    const values = miembros.map((m) => {
      const usuario = m.usuario;
      const grupo = usuario.grupoUsuario?.nombre?.toLowerCase() || '';
      const esTrabajador = grupo === 'trabajador';
      const esRector = grupo === 'rector';

      const estado = esRector ? false : !(esAdministrativa && esTrabajador);
      const es_principal = mapaEsPrincipal[usuario.id_usuario] ?? true;

      return {
        punto: { id_punto: puntoId },
        usuario: { id_usuario: usuario.id_usuario },
        estado,
        es_principal,
      };
    });

    if (!values.length) return;

    await this.puntoUsuarioRepo
      .createQueryBuilder()
      .insert()
      .into(PuntoUsuario)
      .values(values)
      .orIgnore() // ⬅️ Ignora (id_punto, id_usuario) repetidos
      .execute();
  }


  private async inicializarResolucionYResultado(
    punto: Punto,
    manager?: EntityManager,
  ): Promise<void> {
    const resolucionRepo = manager
      ? manager.getRepository(Resolucion)
      : this.resolucionRepo;
    const resultadoRepo = manager
      ? manager.getRepository(Resultado)
      : this.resultadoRepo;

    const resolucionExistente = await resolucionRepo.findOne({
      where: { id_punto: punto.id_punto },
    });

    if (!resolucionExistente) {
      const resolucion = resolucionRepo.create({
        id_punto: punto.id_punto,
        nombre: 'Borrador de resolucion',
        descripcion: 'Resolucion en elaboracion',
        fecha: new Date(),
        fuente_resultado: null,
        estado: true,
        status: true,
      });
      await resolucionRepo.save(resolucion);
    }

    const resultadoExistente = await resultadoRepo.findOne({
      where: { id_punto: punto.id_punto },
    });

    if (!resultadoExistente) {
      const resultado = resultadoRepo.create({
        id_punto: punto.id_punto,
      });
      await resultadoRepo.save(resultado);
    }
  }

  private async asegurarPuntoSinGrupoActivo(idPunto: number): Promise<void> {
    const puntoGrupo = await this.puntoGrupoRepo.findOne({
      where: {
        punto: { id_punto: idPunto },
        estado: true,
        status: true,
        grupo: { status: true },
      },
      relations: ['grupo'],
    });

    if (puntoGrupo?.grupo) {
      const identificadorGrupo =
        puntoGrupo.grupo.nombre ?? `ID ${puntoGrupo.grupo.id_grupo}`;
      throw new BadRequestException(
        `El punto pertenece al grupo ${identificadorGrupo}. Resuelva el grupo para calcular sus resultados.`,
      );
    }
  }

  // ========================================
  // CÁcalculo AUTOMÁTICO DE RESULTADOS
  // ========================================


  async calcularResultados(
    id_punto: number,
    id_usuario: number,
  ): Promise<void> {
    await this.asegurarPuntoSinGrupoActivo(id_punto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this._calcularResultadosInterno(id_punto, id_usuario, queryRunner.manager, {
        fuenteResultado: 'automatico',
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        console.error('Detalles de error SQL:', (error as any).message);
      }

      throw new InternalServerErrorException(
        'Error al calcular los resultados automaticamente. Revisa los logs del servidor.',
      );
    } finally {
      await queryRunner.release();
    }
  }



  async calcularResultadosManual(dto: ResultadoManualDto): Promise<void> {
    const { id_punto, id_usuario, resultado, fuente_resultado } = dto;
    const fuentesPermitidas: Array<'automatico' | 'manual' | 'hibrido'> = [
      'automatico',
      'manual',
      'hibrido',
    ];
    const fuente = fuentesPermitidas.includes(fuente_resultado as any)
      ? (fuente_resultado as 'automatico' | 'manual' | 'hibrido')
      : 'manual';

    await this.asegurarPuntoSinGrupoActivo(id_punto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this._calcularResultadosInterno(id_punto, id_usuario, queryRunner.manager, {
        fuenteResultado: fuente,
        overrideResultado: resultado,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        console.error('Detalles de error SQL:', (error as any).message);
      }

      throw new InternalServerErrorException(
        'No se pudo guardar el resultado manual. Revisa los logs del servidor.',
      );
    } finally {
      await queryRunner.release();
    }
  }



  async calcularResultadosHibrido(
    idPunto: number,
    votos: VotoDto[],
  ): Promise<void> {
    if (!votos || votos.length === 0) {
      throw new BadRequestException('No se recibieron votos para procesar.');
    }

    await this.asegurarPuntoSinGrupoActivo(idPunto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const punto = await queryRunner.manager.findOne(Punto, {
        where: { id_punto: idPunto },
        relations: [
          'puntoUsuarios',
          'puntoUsuarios.usuario',
          'puntoUsuarios.usuario.grupoUsuario',
        ],
      });

      if (!punto) {
        throw new NotFoundException('Punto no encontrado');
      }

      if (punto.resultado !== null && punto.resultado !== undefined) {
        throw new BadRequestException('El punto ya tiene un resultado registrado.');
      }

      for (const voto of votos) {
        if (+voto.punto !== idPunto) {
          throw new BadRequestException(
            `Voto con punto invalido. Esperado: ${idPunto}, recibido: ${voto.punto}`,
          );
        }

        const puntoUsuario = await queryRunner.manager.findOne(PuntoUsuario, {
          where: {
            punto: { id_punto: idPunto },
            usuario: { id_usuario: voto.idUsuario },
          },
          relations: ['usuario', 'punto', 'usuario.grupoUsuario'],
        });

        if (!puntoUsuario) {
          throw new NotFoundException(
            `No se encontro puntoUsuario para usuario ${voto.idUsuario}`,
          );
        }

        const votante = await queryRunner.manager.findOne(Usuario, {
          where: { id_usuario: voto.votante },
        });

        if (!votante) {
          throw new NotFoundException(
            `Votante no encontrado: ID ${voto.votante}`,
          );
        }

        puntoUsuario.opcion = voto.opcion;
        puntoUsuario.es_razonado = voto.es_razonado;
        puntoUsuario.votante = votante;
        puntoUsuario.fecha = new Date();

        await queryRunner.manager.save(PuntoUsuario, puntoUsuario);
      }

      await this._calcularResultadosInterno(idPunto, votos[0].idUsuario, queryRunner.manager, {
        fuenteResultado: 'hibrido',
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        console.error('Detalles de error SQL:', (error as any).message);
      }

      throw error instanceof InternalServerErrorException
        ? error
        : new InternalServerErrorException(
            'Error al procesar el calculo hibrido. Revisa los logs del servidor.',
          );
    } finally {
      await queryRunner.release();
    }
  }


   async _calcularResultadosInterno(
    id_punto: number,
    id_usuario: number,
    manager: EntityManager,
    opciones: {
      fuenteResultado: 'automatico' | 'manual' | 'hibrido';
      overrideResultado?: 'aprobada' | 'rechazada' | 'pendiente' | 'empate';
      recalcularVotos?: boolean;
    } = { fuenteResultado: 'automatico' },
  ): Promise<void> {
    const { fuenteResultado, overrideResultado, recalcularVotos = true } =
      opciones;
    const redondear2 = (valor: number) =>
      Math.round((Number.isFinite(valor) ? valor : 0) * 100) / 100;
    const numeroSeguro = (valor: any) => {
      const parsed = Number(valor);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const normalizarTexto = (texto?: string | null) =>
      (texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    await manager.query(`SET @usuario_actual = ?`, [id_usuario]);

    const punto = await manager.findOne(Punto, {
      where: { id_punto },
      relations: [
        'resolucion',
        'sesion',
        'puntoUsuarios',
        'puntoUsuarios.usuario',
        'puntoUsuarios.usuario.grupoUsuario',
      ],
    });

    if (!punto) {
      throw new NotFoundException('Punto no encontrado');
    }

    if (punto.resultado !== null && punto.resultado !== undefined) {
      throw new BadRequestException(
        'El punto ya tiene un resultado registrado. No es posible recalcularlo.',
      );
    }

    if (fuenteResultado === 'manual' && !punto.resolucion) {
      throw new BadRequestException(
        'No se puede registrar el resultado manual sin una resolucion asociada.',
      );
    }

    const esAdministrativa = !!punto.es_administrativa;
    const dirimentePrevio = !!punto.requiere_voto_dirimente;

    let n_afavor = numeroSeguro(punto.n_afavor);
    let n_encontra = numeroSeguro(punto.n_encontra);
    let n_abstencion = numeroSeguro(punto.n_abstencion);
    let p_afavor = redondear2(punto.p_afavor);
    let p_encontra = redondear2(punto.p_encontra);
    let p_abstencion = redondear2(punto.p_abstencion);

    if (recalcularVotos) {
      let puntoUsuarios = punto.puntoUsuarios.filter((pu) => pu.estado);

      if (esAdministrativa) {
        puntoUsuarios = puntoUsuarios.filter(
          (pu) => normalizarTexto(pu.usuario?.grupoUsuario?.nombre) !== 'trabajador',
        );
      }

      if (fuenteResultado === 'automatico') {
        const sinVoto = puntoUsuarios
          .filter((pu) => !normalizarTexto(pu.opcion))
          .map((pu) => pu.id_punto_usuario)
          .filter((id): id is number => typeof id === 'number' && Number.isFinite(id));

        if (sinVoto.length > 0) {
          throw new BadRequestException({
            code: 'VOTOS_PENDIENTES',
            message: 'Existen miembros habilitados sin voto registrado.',
            data: { puntoUsuariosSinVoto: sinVoto },
          });
        }
      }

      n_afavor = 0;
      n_encontra = 0;
      n_abstencion = 0;
      let sumaPAfavor = 0;
      let sumaPEncontra = 0;
      let sumaPAbstencion = 0;

      for (const pu of puntoUsuarios) {
        const opcion = normalizarTexto(pu.opcion);
        const peso = numeroSeguro(pu.usuario?.grupoUsuario?.peso);
        if (!opcion || peso <= 0) continue;

        switch (opcion) {
          case 'afavor':
            n_afavor += 1;
            sumaPAfavor += peso;
            break;
          case 'encontra':
            n_encontra += 1;
            sumaPEncontra += peso;
            break;
          case 'abstencion':
            n_abstencion += 1;
            sumaPAbstencion += peso;
            break;
        }
      }

      p_afavor = redondear2(sumaPAfavor);
      p_encontra = redondear2(sumaPEncontra);
      p_abstencion = redondear2(sumaPAbstencion);

      punto.n_afavor = n_afavor;
      punto.n_encontra = n_encontra;
      punto.n_abstencion = n_abstencion;
      punto.p_afavor = p_afavor;
      punto.p_encontra = p_encontra;
      punto.p_abstencion = p_abstencion;
    }

    const miembrosRepo = manager.getRepository(Miembro);
    const asistenciaRepo = manager.getRepository(Asistencia);

    const miembros = await miembrosRepo.find({
      where: { estado: true, status: true },
      relations: ['usuario', 'usuario.grupoUsuario'],
    });

    const miembrosElegibles = miembros.filter((m) => {
      const grupo = normalizarTexto(m.usuario?.grupoUsuario?.nombre);
      return !(esAdministrativa && grupo === 'trabajador');
    });

    const miembrosNominal = miembros.length;
    const censoPonderado = redondear2(
      miembrosElegibles.reduce(
        (acc, m) => acc + numeroSeguro(m.usuario?.grupoUsuario?.peso),
        0,
      ),
    );

    const asistencias = await asistenciaRepo.find({
      where: {
        sesion: { id_sesion: punto.sesion.id_sesion },
        estado: true,
        status: true,
      },
      relations: ['usuario', 'usuario.grupoUsuario'],
    });

    const asistenciaPorUsuario = new Map<number, string>();
    for (const asist of asistencias) {
      const idUsuario = asist.usuario?.id_usuario;
      if (!idUsuario) continue;
      asistenciaPorUsuario.set(
        idUsuario,
        normalizarTexto(asist.tipo_asistencia),
      );
    }

    const inhabilitados = new Set<number>();
    for (const pu of punto.puntoUsuarios || []) {
      if (pu.estado === false && pu.usuario?.id_usuario) {
        inhabilitados.add(pu.usuario.id_usuario);
      }
    }

    const presentesFisicos = miembros.filter((m) => {
      const idUsuario = m.usuario?.id_usuario;
      if (!idUsuario) return false;
      const tipo = asistenciaPorUsuario.get(idUsuario) ?? 'ausente';
      if (tipo !== 'presente') return false;
      return true;
    }).length;

    const ausentesNegocio = miembros.filter((m) => {
      const idUsuario = m.usuario?.id_usuario;
      if (!idUsuario) return false;
      const tipo = asistenciaPorUsuario.get(idUsuario);
      if (tipo === 'ausente') return true;
      if (inhabilitados.has(idUsuario)) return true;
      return false;
    }).length;

    if (presentesFisicos <= 0) {
      throw new BadRequestException(
        'No se puede calcular el resultado porque no existen asistentes presentes.',
      );
    }

    const quorumNominalMin = Math.ceil(miembrosNominal / 2);
    if (presentesFisicos < quorumNominalMin) {
      throw new BadRequestException(
        'No se puede calcular el resultado porque no se cumple el quorum nominal minimo.',
      );
    }

    const nMitadMiembrosPresente = redondear2(Math.ceil(presentesFisicos / 2));
    const mitadMiembrosPonderado = redondear2(censoPonderado / 2);
    const dosTercerasPonderado = redondear2((2 * censoPonderado) / 3);
    const nDosTercerasMiembros = redondear2((2 * miembrosNominal) / 3);
    const ausentes = ausentesNegocio;

    const calculo =
      punto.calculo_resultado === 'mayoria_especial'
        ? 'mayoria_especial'
        : 'mayoria_simple';

    const umbralNominal =
      calculo === 'mayoria_especial'
        ? nDosTercerasMiembros
        : nMitadMiembrosPresente;
    const umbralPonderado =
      calculo === 'mayoria_especial'
        ? dosTercerasPonderado
        : mitadMiembrosPonderado;

    const estadoNominalAuto: EstadoInterno =
      n_afavor >= umbralNominal && n_afavor > n_encontra
        ? 'APROBADO'
        : n_encontra >= umbralNominal && n_encontra > n_afavor
        ? 'RECHAZADO'
        : 'SIN_MAYORIA';

    const estadoPonderadoAuto: EstadoInterno =
      p_afavor >= umbralPonderado && p_afavor > p_encontra
        ? 'APROBADO'
        : p_encontra >= umbralPonderado && p_encontra > p_afavor
        ? 'RECHAZADO'
        : 'SIN_MAYORIA';

    const empateNominal =
      n_afavor === n_encontra && n_afavor >= umbralNominal && n_afavor > 0;
    const empatePonderado =
      Math.abs(p_afavor - p_encontra) < 0.01 &&
      p_afavor >= umbralPonderado &&
      p_afavor > 0;

    let requiereDirimente = empateNominal || empatePonderado;

    if (dirimentePrevio) {
      const rector = punto.puntoUsuarios.find((pu) => {
        const grupo = normalizarTexto(pu.usuario?.grupoUsuario?.nombre);
        return grupo === 'rector';
      });

      if (!rector || !rector.opcion) {
        throw new BadRequestException(
          'El Rector debe registrar su voto dirimente antes de cerrar el resultado.',
        );
      }

      requiereDirimente = false;
    }

    let estadoNominal: EstadoInterno = estadoNominalAuto;
    let estadoPonderado: EstadoInterno = estadoPonderadoAuto;

    if (overrideResultado) {
      const estadoOverride: EstadoInterno =
        overrideResultado === 'aprobada'
          ? 'APROBADO'
          : overrideResultado === 'rechazada'
          ? 'RECHAZADO'
          : 'SIN_MAYORIA';
      estadoNominal = estadoOverride;
      estadoPonderado = estadoOverride;
    }

    let resultadoFinal:
      | 'aprobada'
      | 'rechazada'
      | 'pendiente'
      | 'empate'
      | null = null;

    if (overrideResultado) {
      resultadoFinal = overrideResultado;
      requiereDirimente = false;
    } else if (requiereDirimente) {
      resultadoFinal = null;
    } else if (estadoNominal === 'APROBADO' && estadoPonderado === 'APROBADO') {
      resultadoFinal = 'aprobada';
    } else if (
      estadoNominal === 'RECHAZADO' &&
      estadoPonderado === 'RECHAZADO'
    ) {
      resultadoFinal = 'rechazada';
    } else {
      resultadoFinal = 'pendiente';
    }

    punto.requiere_voto_dirimente = requiereDirimente;
    punto.resultado = resultadoFinal;
    punto.estado = resultadoFinal !== null ? false : punto.estado;

    if (punto.resolucion) {
      await manager
        .getRepository(Resolucion)
        .update(punto.resolucion.id_punto, { fuente_resultado: fuenteResultado });
    }

    let resultadoDetalle = await manager.findOne(Resultado, {
      where: { id_punto: punto.id_punto },
    });

    if (!resultadoDetalle) {
      resultadoDetalle = this.resultadoRepo.create({
        id_punto: punto.id_punto,
      });
    }

    resultadoDetalle.n_mitad_miembros_presente = nMitadMiembrosPresente;
    resultadoDetalle.mitad_miembros_ponderado = mitadMiembrosPonderado;
    resultadoDetalle.dos_terceras_ponderado = dosTercerasPonderado;
    resultadoDetalle.n_dos_terceras_miembros = nDosTercerasMiembros;
    const mapEstadoResultado = (
      estado: EstadoInterno,
      esEmpate: boolean,
    ): EstadoFinal => {
      if (estado === 'APROBADO') return 'aprobada';
      if (estado === 'RECHAZADO') return 'rechazada';
      return esEmpate ? 'empate' : 'pendiente';
    };

    resultadoDetalle.n_ausentes = ausentes;
    resultadoDetalle.n_total = miembrosNominal;
    resultadoDetalle.estado_nominal = mapEstadoResultado(
      estadoNominal,
      empateNominal,
    );
    resultadoDetalle.estado_ponderado = mapEstadoResultado(
      estadoPonderado,
      empatePonderado,
    );

    punto.resultadoDetalle = resultadoDetalle;

    await manager.save(Resultado, resultadoDetalle);
    await manager.save(punto);
  }

  /**
   * Devuelve true si el punto existe y está habilitado (estado = true).
   * No lanza excepción si no existe: simplemente retorna false,
   * para que el cliente pueda decidir no enviar el voto.
   */
  async estaHabilitado(idPunto: number): Promise<boolean> {
    const row = await this.puntoRepo
      .createQueryBuilder('p')
      .select(['p.id_punto', 'p.estado', 'p.status'])
      .where('p.id_punto = :idPunto', { idPunto })
      .getOne();

    // Si no existe o está desactivado lógicamente, consideramos no habilitado
    if (!row) return false;
    return !!row.estado; // solo validas "estado"; si quieres, puedes añadir && !!row.status
  }

  

async getResumenBase(idPunto: number) {
  const punto = await this.puntoRepo.findOne({
    where: { id_punto: idPunto },
    relations: ['sesion'],
  });
  if (!punto) throw new NotFoundException('Punto no encontrado');

  const esAdmin = !!punto.es_administrativa;
  const idSesion = punto.sesion.id_sesion;

  // Censo (Miembro)
  const miembros = await this.miembroRepo.find({
    where: { estado: true, status: true },
    relations: ['usuario', 'usuario.grupoUsuario'],
  });
  const elegibleMiembro = (m:any) => !(esAdmin && (m.usuario?.grupoUsuario?.nombre||'').toLowerCase()==='trabajador');
  const miembrosElig = miembros.filter(elegibleMiembro);
  const miembrosNominal = miembrosElig.length;
  const censoPond = +miembrosElig.reduce((a,m)=>a+(m.usuario?.grupoUsuario?.peso||0),0).toFixed(2);

  // Presentes (Asistencia)
  const asist = await this.asistenciaRepo.find({
    where: { sesion: { id_sesion: idSesion }, estado: true, status: true },
    relations: ['usuario','usuario.grupoUsuario'],
  });
  const elegiblePresente = (a:any)=>{
    const t=(a.tipo_asistencia||'').toLowerCase();
    const g=a.usuario?.grupoUsuario?.nombre||'';
    const okT=(t==='presente');
    return okT && !(esAdmin && g.toLowerCase()==='trabajador');
  };
  const presentesNominal = asist.filter(elegiblePresente).length;

  // Míminimos (igual al Excel, con 2 decimales)
  const to2 = (n:number)=>+n.toFixed(2);
  return {
    punto: { id: punto.id_punto, esAdministrativa: esAdmin, id_sesion: idSesion },
    resumen_excel: {
      bases: {
        presentes_nominal: presentesNominal,
        miembros_nominal: miembrosNominal,
        censo_ponderado: to2(censoPond),
      },
      minimos: {
        mitad_presentes_nominal: to2(presentesNominal/2),
        mitad_miembros_ponderado: to2(censoPond/2),
        dos_tercios_ponderado: to2((2*censoPond)/3),
        dos_tercios_miembros_nominal: to2((2*miembrosNominal)/3),
        mayoria_simple: to2(presentesNominal/2),
      }
    }
  };
}

async getResumenPonderado(idPunto: number) {
  const punto = await this.puntoRepo.findOne({
    where: { id_punto: idPunto },
    relations: ['sesion'],
  });
  if (!punto) throw new NotFoundException('Punto no encontrado');
  const esAdmin = !!punto.es_administrativa;

  // helpers numéricos robustos
  const num = (v: any) => {
    if (v === null || v === undefined) return 0;
    const n = typeof v === 'number' ? v : parseFloat(String(v));
    return Number.isFinite(n) ? n : 0;
  };
  const to2 = (n: number) => Math.round(n * 100) / 100;

  // 1) Resultados ya guardados (forzar a número)
  const nA = num(punto.n_afavor);
  const nC = num(punto.n_encontra);
  const nAb = num(punto.n_abstencion);

  const pA = to2(num(punto.p_afavor));
  const pC = to2(num(punto.p_encontra));
  const pAb = to2(num(punto.p_abstencion));

  const presNom = nA + nC + nAb;
  const presPond = to2(pA + pC + pAb);

  // 2) Censo y presentes (para míminimos y ausentes)
  const miembros = await this.miembroRepo.find({
    where: { estado: true, status: true },
    relations: ['usuario', 'usuario.grupoUsuario'],
  });
  const miembrosElig = miembros.filter((m: any) => {
    const g = (m.usuario?.grupoUsuario?.nombre || '').toLowerCase();
    return !(esAdmin && g === 'trabajador');
  });

  const miembrosNominal = miembrosElig.length;
  const censoPond = to2(
    miembrosElig.reduce((a: number, m: any) => a + num(m.usuario?.grupoUsuario?.peso), 0)
  );

  const minNom = to2(presNom / 2);
  const minPond = to2(censoPond / 2);

  // 3) Estados
  const estadoPond =
    pA >= minPond && pA > pC ? 'APROBADO' :
    pC >= minPond && pC > pA ? 'RECHAZADO' :
    pA === pC && pA >= minPond ? 'SIN_MAYORIA' : 'SIN_MAYORIA';

  const estadoNom =
    nA >= minNom && nA > nC ? 'APROBADO' :
    nC >= minNom && nC > nA ? 'RECHAZADO' :
    nA === nC && nA >= minNom ? 'SIN_MAYORIA' : 'SIN_MAYORIA';

  const requiereDirimente = (pA === pC && pA >= minPond) || (nA === nC && nA >= minNom);

  return {
    punto: { id: punto.id_punto, esAdministrativa: esAdmin },
    resultados: {
      nominal:   { a_favor: nA, en_contra: nC, abstencion: nAb, presentes: presNom },
      ponderado: { a_favor: pA, en_contra: pC, abstencion: pAb, presentes: presPond }
    },
    minimos: { nominal: minNom, ponderado: minPond },
    estados: {
      ponderado: estadoPond,
      nominal: estadoNom,
      requiere_voto_dirimente: requiereDirimente,
      motivo: (estadoPond === 'APROBADO' || estadoNom === 'APROBADO') ? 'a_favor >= minimo' : 'sin umbral suficiente'
    },
    votos_resumen: {
      a_favor: nA,
      en_contra: nC,
      abstencion: nAb,
      ausentes: Math.max(0, miembrosNominal - presNom),
      total: miembrosNominal
    }
  };
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
