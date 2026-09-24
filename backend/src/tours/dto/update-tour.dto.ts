import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SecurityMatrixDto } from './security-matrix.dto.js';

export class UpdateTourDto {
  @IsOptional()
  @IsString({ message: 'Name muss ein Text sein.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Datum muss ein Text sein.' })
  date?: string;

  @IsOptional()
  @IsString({ message: 'Zeit muss ein Text sein.' })
  time?: string;

  @IsOptional()
  @IsString({ message: 'Ort muss ein Text sein.' })
  location?: string;

  @IsOptional()
  @IsString({ message: 'Schwierigkeitsgrad muss ein Text sein.' })
  difficulty?: string;

  @IsOptional()
  @IsString({ message: 'Höhenmeter/Höhe muss ein Text sein.' })
  altitude?: string;

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
