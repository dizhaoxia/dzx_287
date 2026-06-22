import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AllergenType, AllergySeverity } from '../../../entities/allergy.entity';

export class UpdateAllergyDto {
  @IsOptional()
  @IsEnum(AllergenType)
  allergenType?: AllergenType;

  @IsOptional()
  @IsString()
  allergenName?: string;

  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity;

  @IsOptional()
  @IsString()
  reactionDescription?: string;
}
