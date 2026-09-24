import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { EmergencyContactDto } from './emergency-contact.dto.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Vorname muss ein Text sein.' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Nachname muss ein Text sein.' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Geburtstag muss ein Text sein.' })
  birthday?: string;

  @IsOptional()
  @IsString({ message: 'Telefonnummer muss ein Text sein.' })
  phoneNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;
}
