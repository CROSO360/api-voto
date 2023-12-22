import { Body, Controller, Post } from '@nestjs/common';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { AuthService } from './auth.service';

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
}
