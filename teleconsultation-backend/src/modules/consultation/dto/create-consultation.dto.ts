import { IsString, IsOptional, IsEnum, IsArray, IsNotEmpty } from 'class-validator';
import { ConsultationType, UrgencyLevel } from '../../../entities/consultation.entity';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsEnum(ConsultationType)
  consultationType: ConsultationType;

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

  @IsNotEmpty()
  @IsEnum(UrgencyLevel)
  urgencyLevel: UrgencyLevel;

  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  patientName?: string;

  @IsOptional()
  scheduledAt?: Date;
}
