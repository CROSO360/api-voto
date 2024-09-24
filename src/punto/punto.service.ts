import { Injectable } from '@nestjs/common';
import { Punto } from './punto.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PuntoService extends BaseService<Punto> {
  constructor(@InjectRepository(Punto) private puntoRepo: Repository<Punto>) {
    super();
  }

  getRepository(): Repository<Punto> {
    return this.puntoRepo;
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
