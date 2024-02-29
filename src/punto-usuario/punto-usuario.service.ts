import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PuntoUsuario } from './punto-usuario.entity';
import { BaseService } from 'src/commons/commons.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SesionService } from 'src/sesion/sesion.service';

@Injectable()
export class PuntoUsuarioService extends BaseService<PuntoUsuario>{

    constructor(
        @InjectRepository(PuntoUsuario) private puntoUsuarioRepo: Repository<PuntoUsuario>,
        private readonly sesionService: SesionService,
    ){
        super();
    }

    getRepository(): Repository<PuntoUsuario> {
        return this.puntoUsuarioRepo;
    }

    async validarVoto(codigo: string, idUsuario: number, punto: number, opcion: string | null): Promise<any> {
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
            }
    
            /*const voto = */await this.save(puntoUsuarioData);
            //this.websocketGateway.emitChange(voto.id_punto_usuario);            
    
          return puntoUsuario.id_punto_usuario;
    
        }
      
        throw new UnauthorizedException('Credenciales incorrectas');
      }

}
