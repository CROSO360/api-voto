import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserLoginDto } from './dto/userLogin.dto';
import { VotoDto } from './dto/voto.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() adminloginDto: AdminLoginDto): Promise<any> {
    return this.authService.validateUser(
      adminloginDto.codigo,
      adminloginDto.contrasena,
    );
  }

  @Post('voter-login')
  async voterLogin(@Body() userloginDto: UserLoginDto): Promise<any> {
    return this.authService.validateVoter(
      userloginDto.codigo,
      userloginDto.cedula,
    );
  }

  @Post('voter-reemplazo-login')
  async voterReemplazoLogin(@Body() userloginDto: UserLoginDto): Promise<any> {
    return this.authService.validateVoterReemplazo(
      userloginDto.codigo,
      userloginDto.cedula,
    );
  }

  /*@Post('voto')
  //@UseGuards(AuthGuard)
  async voto(@Body() votoDto :VotoDto): Promise<any> {
    return this.authService.validarVoto(
      votoDto.codigo,
      votoDto.id_usuario,
      votoDto.puntos,
      votoDto.opcion,
    );
  }*/

}
