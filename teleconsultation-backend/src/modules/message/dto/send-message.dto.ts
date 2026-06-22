import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MessageType } from '../../../entities/message.entity';

export class SendMessageDto {
  @IsString()
  consultationId: string;

  @IsString()
  receiverId: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}
