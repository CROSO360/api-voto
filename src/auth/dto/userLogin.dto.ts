import { IsString } from "class-validator";

export class UserLoginDto {
  @IsString()
  codigo: string;

  @IsString()
  cedula: string;
}