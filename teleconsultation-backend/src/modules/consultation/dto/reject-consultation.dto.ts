import { IsString, IsNotEmpty } from 'class-validator';

export class RejectConsultationDto {
  @IsNotEmpty()
  @IsString()
  rejectionReason: string;
}
