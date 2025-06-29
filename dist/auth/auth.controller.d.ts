import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { UserLoginDto } from './dto/userLogin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(adminLoginDto: AdminLoginDto): Promise<any>;
    voterLogin(userLoginDto: UserLoginDto): Promise<any>;
    voterReemplazoLogin(userLoginDto: UserLoginDto): Promise<any>;
}
