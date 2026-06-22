import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { QueryConsultationDto } from './dto/query-consultation.dto';
import { RejectConsultationDto } from './dto/reject-consultation.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('consultations')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Post()
  @Roles('patient', 'doctor', 'admin')
  async createConsultation(
    @CurrentUser() user: any,
    @Body() createConsultationDto: CreateConsultationDto,
  ) {
    const userId = user.id || user.userId || 'patient-1';
    const userName = user.name || user.username || '用户';
    const userRole = user.role || 'patient';
    return this.consultationService.createConsultation(
      userId,
      userName,
      userRole,
      createConsultationDto,
    );
  }

  @Get()
  @Roles('patient', 'doctor', 'admin')
  async getConsultationList(
    @CurrentUser() user: any,
    @Query() queryDto: QueryConsultationDto,
  ) {
    const userId = user.id || user.userId || (user.role === 'doctor' ? 'doctor-1' : 'patient-1');
    const userRole = user.role || 'patient';
    return this.consultationService.getConsultationList(userId, userRole, queryDto);
  }

  @Get('application-no/generate')
  @Roles('patient', 'doctor', 'admin')
  async generateApplicationNo() {
    return this.consultationService.generateApplicationNoService();
  }

  @Get(':id')
  @Roles('patient', 'doctor', 'admin')
  async getConsultationById(
    @Param('id') consultationId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.id || user.userId || (user.role === 'doctor' ? 'doctor-1' : 'patient-1');
    const userRole = user.role || 'patient';
    return this.consultationService.getConsultationById(consultationId, userId, userRole);
  }

  @Get(':id/timeline')
  @Roles('patient', 'doctor', 'admin')
  async getConsultationTimeline(
    @Param('id') consultationId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.id || user.userId || (user.role === 'doctor' ? 'doctor-1' : 'patient-1');
    const userRole = user.role || 'patient';
    return this.consultationService.getConsultationTimeline(consultationId, userId, userRole);
  }

  @Put(':id/accept')
  @Roles('doctor', 'admin')
  async acceptConsultation(
    @Param('id') consultationId: string,
    @CurrentUser() user: any,
  ) {
    const doctorId = user.id || user.userId || 'doctor-1';
    const doctorName = user.name || '医生';
    return this.consultationService.acceptConsultation(consultationId, doctorId, doctorName);
  }

  @Put(':id/reject')
  @Roles('doctor', 'admin')
  async rejectConsultation(
    @Param('id') consultationId: string,
    @CurrentUser() user: any,
    @Body() rejectDto: RejectConsultationDto,
  ) {
    const doctorId = user.id || user.userId || 'doctor-1';
    return this.consultationService.rejectConsultation(consultationId, doctorId, rejectDto);
  }

  @Put(':id/start')
  @Roles('doctor', 'admin')
  async startConsultation(
    @Param('id') consultationId: string,
    @CurrentUser() user: any,
  ) {
    const doctorId = user.id || user.userId || 'doctor-1';
    return this.consultationService.startConsultation(consultationId, doctorId);
  }

  @Put(':id/complete')
  @Roles('doctor', 'admin')
  async completeConsultation(
    @Param('id') consultationId: string,
    @CurrentUser() user: any,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ) {
    const doctorId = user.id || user.userId || 'doctor-1';
    return this.consultationService.completeConsultation(
      consultationId,
      doctorId,
      updateConsultationDto,
    );
  }

  @Put(':id/cancel')
  @Roles('patient', 'doctor', 'admin')
  async cancelConsultation(
    @Param('id') consultationId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.id || user.userId || (user.role === 'doctor' ? 'doctor-1' : 'patient-1');
    const userRole = user.role || 'patient';
    return this.consultationService.cancelConsultation(consultationId, userId, userRole);
  }

  @Get(':id/attachments')
  @Roles('patient', 'doctor', 'admin')
  async getAttachments(
    @Param('id') consultationId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.id || user.userId || (user.role === 'doctor' ? 'doctor-1' : 'patient-1');
    const userRole = user.role || 'patient';
    return this.consultationService.getAttachments(consultationId, userId, userRole);
  }

  @Post(':id/attachments')
  @Roles('patient', 'doctor', 'admin')
  async addAttachment(
    @Param('id') consultationId: string,
    @CurrentUser() user: any,
    @Body() createAttachmentDto: CreateAttachmentDto,
  ) {
    const userId = user.id || user.userId || (user.role === 'doctor' ? 'doctor-1' : 'patient-1');
    const userName = user.name || user.username || '用户';
    const userRole = user.role || 'patient';
    return this.consultationService.addAttachment(
      consultationId,
      userId,
      userName,
      userRole,
      createAttachmentDto,
    );
  }

  @Delete(':id/attachments/:attachmentId')
  @Roles('patient', 'doctor', 'admin')
  async deleteAttachment(
    @Param('id') consultationId: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.id || user.userId || (user.role === 'doctor' ? 'doctor-1' : 'patient-1');
    const userRole = user.role || 'patient';
    return this.consultationService.deleteAttachment(
      consultationId,
      attachmentId,
      userId,
      userRole,
    );
  }
}
