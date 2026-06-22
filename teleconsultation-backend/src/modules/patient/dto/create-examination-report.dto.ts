import { IsString, IsOptional } from 'class-validator';

export class CreateExaminationReportDto {
  @IsOptional()
  @IsString()
  reportName?: string;

  @IsOptional()
  @IsString()
  reportType?: string;

  @IsOptional()
  examinationDate?: Date;

  @IsOptional()
  @IsString()
  hospitalName?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  doctorName?: string;

  @IsOptional()
  @IsString()
  examinationItems?: string;

  @IsOptional()
  @IsString()
  examinationResults?: string;

  @IsOptional()
  @IsString()
  conclusion?: string;

  @IsOptional()
  @IsString()
  suggestions?: string;

  @IsOptional()
  @IsString()
  reportFileUrl?: string;

  @IsOptional()
  @IsString()
  reportImages?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @IsOptional()
  @IsString()
  uploadedByName?: string;

  @IsOptional()
  uploadTime?: Date;
}
