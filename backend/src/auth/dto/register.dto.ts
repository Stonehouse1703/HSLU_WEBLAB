import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { EmergencyContactDto } from '../../users/dto/emergency-contact.dto.js';

export class RegisterDto {
  @IsString({ message: 'Vorname muss ein Text sein.' })
  @IsNotEmpty({ message: 'Vorname ist erforderlich.' })
  firstName: string;

  @IsString({ message: 'Nachname muss ein Text sein.' })
  @IsNotEmpty({ message: 'Nachname ist erforderlich.' })
  lastName: string;

  @IsEmail({}, { message: 'Bitte eine gültige E-Mail-Adresse angeben.' })
  @IsNotEmpty({ message: 'E-Mail ist erforderlich.' })
  email: string;

  @IsString({ message: 'Passwort muss ein Text sein.' })
  @MinLength(6, { message: 'Das Passwort muss mindestens 6 Zeichen lang sein.' })
  password: string;

  @IsOptional()
  @IsString()
  birthday?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;
}
