import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  realName?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  professionalTitle?: string;

  @IsOptional()
  @IsString()
  hospitalName?: string;

  @IsOptional()
  @IsString()
  specialties?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsBoolean()
  licenseVerified?: boolean;

  @IsOptional()
  @IsNumber()
  consultationFee?: number;
}
