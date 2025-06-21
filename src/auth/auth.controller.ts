// =======================================================
// IMPORTACIONES
// =======================================================

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AdminLoginDto } from './dto/adminLogin.dto';
import { UserLoginDto } from './dto/userLogin.dto';

// =======================================================
// CONTROLADOR: AuthController
// =======================================================

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ===================================================
  // POST: /auth/login
  // Autenticación de administradores
  // ===================================================
  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<any> {
    return this.authService.validateUser(
      adminLoginDto.codigo,
      adminLoginDto.contrasena,
    );
  }

  // ===================================================
  // POST: /auth/voter-login
  // Autenticación de votantes principales
  // ===================================================
  @Post('voter-login')
  async voterLogin(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return this.authService.validateVoter(
      userLoginDto.codigo,
      userLoginDto.cedula,
    );
  }

  // ===================================================
  // POST: /auth/voter-reemplazo-login
  // Autenticación de votantes reemplazo
  // ===================================================
  @Post('voter-reemplazo-login')
  async voterReemplazoLogin(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return this.authService.validateVoterReemplazo(
      userLoginDto.codigo,
      userLoginDto.cedula,
    );
  }
}
