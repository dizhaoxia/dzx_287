import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateSpecialtiesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  diseaseTags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  surgeryTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  treatmentAreas?: string[];
}

export class SpecialtiesResponse {
  diseaseTags: string[];
  surgeryTypes: string[];
  treatmentAreas: string[];
}
