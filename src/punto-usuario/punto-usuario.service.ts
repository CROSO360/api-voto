import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PuntoUsuario } from './punto-usuario.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SesionService } from 'src/sesion/sesion.service';
import { Punto } from 'src/punto/punto.entity';
import { Miembro } from 'src/miembro/miembro.entity';

@Injectable()
export class PuntoUsuarioService extends BaseService<PuntoUsuario>{

    constructor(
        @InjectRepository(PuntoUsuario) private puntoUsuarioRepo: Repository<PuntoUsuario>,
        @InjectRepository(Punto) private readonly puntoRepo: Repository<Punto>,
        @InjectRepository(Miembro) private readonly miembroRepo: Repository<Miembro>,
        private readonly sesionService: SesionService,
    ){
        super();
    }

    getRepository(): Repository<PuntoUsuario> {
        return this.puntoUsuarioRepo;
    }

    async generarVotacionesPorSesion(idSesion: number): Promise<void> {
      const sesion = await this.sesionService.findOne({ id_sesion: idSesion });
      if (!sesion) throw new BadRequestException('La sesión no existe');
    
      // Obtener todos los puntos activos de la sesión
      const puntos = await this.puntoRepo.find({
        where: { sesion: { id_sesion: idSesion }, status: true },
        relations: [],
      });
    
      if (!puntos.length) {
        throw new BadRequestException('No hay puntos disponibles para generar votación');
      }
    
      // Obtener miembros activos con usuario y grupoUsuario
      const miembros = await this.miembroRepo.find({
        where: { estado: true, status: true },
        relations: ['usuario', 'usuario.grupoUsuario'],
      });
    
      if (!miembros.length) {
        throw new BadRequestException('No hay miembros del OCS registrados');
      }
    
      const puntoUsuarios: PuntoUsuario[] = [];
    
      for (const punto of puntos) {
        for (const miembro of miembros) {
          const usuario = miembro.usuario;
          const esTrabajador = usuario.grupoUsuario?.nombre?.toLowerCase() === 'trabajador';
          const estado = punto.es_administrativa && esTrabajador ? false : true;
    
          const existe = await this.puntoUsuarioRepo.findOne({
            where: {
              punto: { id_punto: punto.id_punto },
              usuario: { id_usuario: usuario.id_usuario },
            },
          });
    
          if (!existe) {
            const puntoUsuario = this.puntoUsuarioRepo.create({
              punto: { id_punto: punto.id_punto },
              usuario: { id_usuario: usuario.id_usuario },
              estado,
            });
    
            puntoUsuarios.push(puntoUsuario);
          }
        }
      }
    
      await this.puntoUsuarioRepo.save(puntoUsuarios);
    }

    async eliminarVotacionesPorSesion(idSesion: number): Promise<void> {
      const sesion = await this.sesionService.findOne({ id_sesion: idSesion });
    
      if (!sesion) {
        throw new BadRequestException('La sesión no existe.');
      }
    
      if (sesion.fase?.toLowerCase() !== 'pendiente') {
        throw new BadRequestException('Solo se pueden eliminar votaciones si la sesión está en fase "pendiente".');
      }
    
      // Obtener los puntos activos de la sesión
      const puntos = await this.puntoRepo.find({
        where: { sesion: { id_sesion: idSesion }, status: true },
      });
    
      if (!puntos.length) return;
    
      const idsPuntos = puntos.map(p => p.id_punto);
    
      // Eliminar todos los punto_usuario vinculados a estos puntos
      await this.puntoUsuarioRepo
        .createQueryBuilder()
        .delete()
        .from(PuntoUsuario)
        .where('id_punto IN (:...idsPuntos)', { idsPuntos })
        .execute();
    }
    

    async validarVoto(codigo: string, idUsuario: number, punto: number, opcion: string | null, es_razonado: boolean): Promise<any> {
        const query = { codigo };
        const relations = [];
        
        const sesion = await this.sesionService.findOneBy(query, relations);
      
        // Verifica si se encontró un usuario y si las credenciales coinciden
        if (sesion && idUsuario && punto && ((opcion == "afavor" || opcion == "encontra" || opcion == "abstinencia" || opcion == null)) ) {
          
            let query = { punto: { id_punto: punto }, usuario: { id_usuario: idUsuario } };
            const relations = ['punto','usuario'];
    
            const puntoUsuario = await this.findOneBy(query,relations);
    
            let puntoUsuarioData: any = {
              id_punto_usuario: puntoUsuario.id_punto_usuario,
              opcion: opcion,
              es_razonado: es_razonado
            }
    
            /*const voto = */await this.save(puntoUsuarioData);
            //this.websocketGateway.emitChange(voto.id_punto_usuario);            
    
          return puntoUsuario.id_punto_usuario;
    
        }
      
        throw new UnauthorizedException('Campos del voto incorrectos');
      }

}
