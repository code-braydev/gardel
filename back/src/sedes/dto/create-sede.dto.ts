import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateSedeDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la sede no puede estar vacío' })
  @MinLength(3, { message: 'El nombre es muy corto' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  ciudad: string;
}
