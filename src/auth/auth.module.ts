import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constants';
import { PuntoUsuarioModule } from 'src/punto-usuario/punto-usuario.module';
import { SesionModule } from 'src/sesion/sesion.module';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
  imports: [
    SesionModule,
    PuntoUsuarioModule,
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
