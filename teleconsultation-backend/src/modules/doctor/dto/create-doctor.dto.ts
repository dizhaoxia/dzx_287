import { IsString, IsOptional, IsNumber, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  realName: string;

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
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  professionalTitle: string;

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
  @IsNumber()
  consultationFee?: number;
}
