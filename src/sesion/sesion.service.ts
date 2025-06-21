// ==============================
// Importaciones
// ==============================

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as PdfPrinter from 'pdfmake';
import * as fs from 'fs';
import * as path from 'path';

import { Sesion } from './sesion.entity';
import { Punto } from 'src/punto/punto.entity';
import { PuntoUsuario } from 'src/punto-usuario/punto-usuario.entity';
import { Documento } from 'src/documento/documento.entity';
import { SesionDocumento } from 'src/sesion-documento/sesion-documento.entity';
import { BaseService } from 'src/commons/commons.service';

// ==============================
// Servicio: SesionService
// ==============================

@Injectable()
export class SesionService extends BaseService<Sesion> {
  constructor(
    @InjectRepository(Sesion)
    private readonly sesionRepo: Repository<Sesion>,

    @InjectRepository(Punto)
    private readonly puntoRepo: Repository<Punto>,

    @InjectRepository(PuntoUsuario)
    private readonly puntoUsuarioRepo: Repository<PuntoUsuario>,

    @InjectRepository(Documento)
    private readonly documentoRepo: Repository<Documento>,

    @InjectRepository(SesionDocumento)
    private readonly sesionDocumentoRepo: Repository<SesionDocumento>,
  ) {
    super();
  }

  /**
   * Devuelve el repositorio asociado a la entidad Sesion.
   */
  getRepository(): Repository<Sesion> {
    return this.sesionRepo;
  }

  /**
   * Genera y guarda un reporte PDF con los resultados de una sesión finalizada.
   * Incluye información de puntos, resoluciones y cálculos ponderados.
   */
  async generarReporteSesion(idSesion: number): Promise<Buffer> {
    const sesion = await this.sesionRepo.findOne({
      where: { id_sesion: idSesion },
      relations: ['puntos', 'puntos.resolucion'],
    });

    if (!sesion) {
      throw new BadRequestException('Sesión no encontrada');
    }

    if (sesion.fase !== 'finalizada') {
      throw new BadRequestException('La sesión no está finalizada');
    }

    // ========================
    // Configuración de fuentes PDF
    // ========================

    const fonts = {
      Roboto: {
        normal: path.join(__dirname, '..', '..', 'fonts', 'Roboto-Regular.ttf'),
        bold: path.join(__dirname, '..', '..', 'fonts', 'Roboto-Medium.ttf'),
        italics: path.join(__dirname, '..', '..', 'fonts', 'Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '..', '..', 'fonts', 'Roboto-MediumItalic.ttf'),
      },
    };

    const printer = new PdfPrinter(fonts);
    const content: any[] = [
      { text: `Resultados de la sesión ${sesion.nombre}`, style: 'header' },
    ];

    // ========================
    // Iteración por puntos
    // ========================

    for (const punto of sesion.puntos) {
      const resolucion = punto.resolucion;

      content.push({ text: `Punto ${punto.nombre}`, style: 'subheader' });
      content.push({ text: punto.detalle, margin: [0, 0, 0, 5] });

      // Solo si la resolución es automática
      if (!resolucion?.voto_manual) {
        const resultados = await this.puntoUsuarioRepo.find({
          where: { punto: { id_punto: punto.id_punto } },
          relations: ['usuario', 'usuario.grupoUsuario'],
        });

        const resumen: Record<string, any> = {};

        for (const r of resultados) {
          const grupo = r.usuario.grupoUsuario.nombre;
          const peso = r.usuario.grupoUsuario.peso;

          if (!resumen[grupo]) {
            resumen[grupo] = {
              grupo,
              afavor: 0,
              afavor_peso: 0,
              encontra: 0,
              encontra_peso: 0,
              abstencion: 0,
              abstencion_peso: 0,
            };
          }

          switch (r.opcion) {
            case 'afavor':
              resumen[grupo].afavor++;
              resumen[grupo].afavor_peso += peso;
              break;
            case 'encontra':
              resumen[grupo].encontra++;
              resumen[grupo].encontra_peso += peso;
              break;
            case 'abstencion':
              resumen[grupo].abstencion++;
              resumen[grupo].abstencion_peso += peso;
              break;
          }
        }

        const filas = Object.values(resumen).map((r: any) => [
          r.grupo,
          r.afavor,
          r.afavor_peso.toFixed(2),
          r.encontra,
          r.encontra_peso.toFixed(2),
          r.abstencion,
          r.abstencion_peso.toFixed(2),
        ]);

        let totalAfavorPeso = 0;
        let totalEncontraPeso = 0;
        let totalAbstencionPeso = 0;

        Object.values(resumen).forEach((r: any) => {
          totalAfavorPeso += r.afavor_peso;
          totalEncontraPeso += r.encontra_peso;
          totalAbstencionPeso += r.abstencion_peso;
        });

        filas.push([
          { text: 'Total', bold: true },
          punto.n_afavor,
          `${totalAfavorPeso.toFixed(2)} (${punto.p_afavor}%)`,
          punto.n_encontra,
          `${totalEncontraPeso.toFixed(2)} (${punto.p_encontra}%)`,
          punto.n_abstencion,
          `${totalAbstencionPeso.toFixed(2)} (${punto.p_abstencion}%)`,
        ]);

        content.push({
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: [
              [
                'Grupo Usuario',
                'A Favor',
                'A Favor Peso',
                'En Contra',
                'En Contra Peso',
                'Abstención',
                'Abstención Peso',
              ],
              ...filas,
            ],
          },
          margin: [0, 0, 0, 10],
        });
      }

      // Detalle de resolución (manual o automática)
      if (resolucion) {
        content.push({
          table: {
            widths: ['auto', '*'],
            body: [
              ['Resultado', punto.resultado],
              ['Resolución', resolucion.nombre],
              ['Descripción', resolucion.descripcion],
            ],
          },
          margin: [0, 0, 0, 20],
        });

        content.push({
          text: `Tipo de resolución: ${resolucion.voto_manual ? 'Manual (registrada por Secretaría)' : 'Automática (calculada por el sistema)'}`,
          italics: true,
          margin: [0, 0, 0, 20],
        });
      }
    }

    // ========================
    // Definición del documento PDF
    // ========================

    const docDefinition = {
      content,
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 15, bold: true, margin: [0, 10, 0, 5] },
      },
    };

    // ========================
    // Escritura del archivo
    // ========================

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '_');

    const nombreArchivo = `reporte_sesion_${sesion.codigo || sesion.id_sesion}_${timestamp}.pdf`;
    const rutaArchivo = path.join(process.cwd(), 'uploads', nombreArchivo);

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const stream = fs.createWriteStream(rutaArchivo);
    pdfDoc.pipe(stream);
    pdfDoc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    // ========================
    // Guardado en base de datos
    // ========================

    const documento = this.documentoRepo.create({
      nombre: nombreArchivo,
      url: `${process.env.APP_BASE_URL}/subidas/${nombreArchivo}`,
      fecha_subida: new Date(),
      estado: true,
      status: true,
    });

    const documentoGuardado = await this.documentoRepo.save(documento);

    const sesionDocumento = this.sesionDocumentoRepo.create({
      sesion,
      documento: documentoGuardado,
      estado: true,
      status: true,
    });

    await this.sesionDocumentoRepo.save(sesionDocumento);

    // ========================
    // Devolver buffer del PDF
    // ========================

    const buffer = fs.readFileSync(rutaArchivo);
    return buffer;
  }
}
