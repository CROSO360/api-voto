// =======================================================
// IMPORTACIONES
// =======================================================

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsuarioModule } from 'src/usuario/usuario.module';
import { PuntoUsuarioModule } from 'src/punto-usuario/punto-usuario.module';
import { SesionModule } from 'src/sesion/sesion.module';

import { jwtConstants } from './constants/jwt.constants';

// =======================================================
// MÓDULO: AuthModule
// =======================================================

@Module({
  imports: [
    SesionModule,
    PuntoUsuarioModule,
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15d' }, // Token válido por 15 días
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
