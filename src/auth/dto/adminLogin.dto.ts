import { IsString } from "class-validator";

export class AdminLoginDto {
  @IsString()
  codigo: string;

  @IsString()
  contrasena: string;
}