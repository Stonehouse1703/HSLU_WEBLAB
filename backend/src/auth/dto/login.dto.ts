import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Bitte eine gültige E-Mail-Adresse angeben.' })
  @IsNotEmpty({ message: 'E-Mail ist erforderlich.' })
  email: string;

  @IsString({ message: 'Passwort muss ein Text sein.' })
  @IsNotEmpty({ message: 'Passwort ist erforderlich.' })
  password: string;
}
