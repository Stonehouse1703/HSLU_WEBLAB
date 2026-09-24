import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SecurityMatrixDto } from './security-matrix.dto.js';

export class CreateTourDto {
  @IsString({ message: 'Name muss ein Text sein.' })
  @IsNotEmpty({ message: 'Name ist erforderlich.' })
  name: string;

  @IsString({ message: 'Datum muss ein Text sein.' })
  @IsNotEmpty({ message: 'Datum ist erforderlich.' })
  date: string;

  @IsString({ message: 'Zeit muss ein Text sein.' })
  @IsNotEmpty({ message: 'Zeit ist erforderlich.' })
  time: string;

  @IsString({ message: 'Ort muss ein Text sein.' })
  @IsNotEmpty({ message: 'Ort ist erforderlich.' })
  location: string;

  @IsString({ message: 'Schwierigkeitsgrad muss ein Text sein.' })
  @IsNotEmpty({ message: 'Schwierigkeitsgrad ist erforderlich.' })
  difficulty: string;

  @IsString({ message: 'Höhenmeter/Höhe muss ein Text sein.' })
  @IsNotEmpty({ message: 'Höhenmeter/Höhe ist erforderlich.' })
  altitude: string;

  @IsOptional()
  @IsString()
  distance?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Kosten müssen eine Zahl sein.' })
  cost?: number;

  @IsOptional()
  @IsString()
  travelRoute?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  gpxData?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SecurityMatrixDto)
  securityMatrix?: SecurityMatrixDto;
}
