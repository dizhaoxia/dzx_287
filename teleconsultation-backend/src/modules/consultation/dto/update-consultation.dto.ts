import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ConsultationType, UrgencyLevel } from '../../../entities/consultation.entity';

export class UpdateConsultationDto {
  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsEnum(ConsultationType)
  consultationType?: ConsultationType;

  @IsOptional()
  @IsArray()
  targetDoctorIds?: string[];

  @IsOptional()
  @IsArray()
  targetDoctorNames?: string[];

  @IsOptional()
  @IsArray()
  targetDepartments?: string[];

  @IsOptional()
  @IsString()
  consultationPurpose?: string;

  @IsOptional()
  @IsString()
  conditionSummary?: string;

  @IsOptional()
  @IsEnum(UrgencyLevel)
  urgencyLevel?: UrgencyLevel;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsOptional()
  scheduledAt?: Date;
}
