import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SecurityMatrixDto {
  @IsOptional()
  @IsString()
  participants?: string;

  @IsOptional()
  @IsString()
  cloudCover?: string;

  @IsOptional()
  @IsString()
  precipitation?: string;

  @IsOptional()
  @IsString()
  visibility?: string;

  @IsOptional()
  @IsString()
  wind?: string;

  @IsOptional()
  @IsString()
  temperature2000m?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  avalancheDanger?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dangerSources?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dangerLocations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  otherHazards?: string[];
}
