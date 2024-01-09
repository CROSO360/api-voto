import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

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

  @Get('profile')
  @UseGuards(AuthGuard)
  profile(
    @Request()
    req
  ){
    return req.usuario;
  }

}
