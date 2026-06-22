import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { AttachmentType } from '../../../entities/consultation-attachment.entity';

export class CreateAttachmentDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  fileUrl: string;

  @IsOptional()
  @IsEnum(AttachmentType)
  fileType?: AttachmentType;

  @IsOptional()
  fileSize?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
