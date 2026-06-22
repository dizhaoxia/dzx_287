import { IsString, IsOptional, IsEnum, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { AnnouncementStatus } from '../../../entities/announcement.entity';

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(AnnouncementStatus)
  status?: AnnouncementStatus;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}
