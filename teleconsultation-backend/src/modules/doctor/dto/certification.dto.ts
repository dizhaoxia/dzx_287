import { IsString, IsOptional, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import type { CertificationType } from '../../../entities/doctor-certification.entity';

export class CreateCertificationDto {
  @IsEnum(['practice', 'professional_title', 'specialty'])
  certType: CertificationType;

  @IsNotEmpty()
  @IsString()
  certNumber: string;

  @IsNotEmpty()
  @IsString()
  certName: string;

  @IsOptional()
  @IsString()
  certFileUrl?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateCertificationDto {
  @IsOptional()
  @IsString()
  certNumber?: string;

  @IsOptional()
  @IsString()
  certName?: string;

  @IsOptional()
  @IsString()
  certFileUrl?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class ExpiryReminderQueryDto {
  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  days?: string;
}

export interface ExpiryReminderItem {
  doctorId: string;
  doctorName: string;
  department: string;
  certId: string;
  certType: CertificationType;
  certName: string;
  expiryDate: string;
  daysRemaining: number;
}
