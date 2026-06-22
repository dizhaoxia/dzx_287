import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AllergenType, AllergySeverity } from '../../../entities/allergy.entity';

export class CreateAllergyDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsNotEmpty()
  @IsEnum(AllergenType)
  allergenType: AllergenType;

  @IsNotEmpty()
  @IsString()
  allergenName: string;

  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity;

  @IsOptional()
  @IsString()
  reactionDescription?: string;
}
