import {
  Controller,
  Get,
  Query,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreateExaminationReportDto } from './dto/create-examination-report.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('examination-reports')
export class ExaminationReportController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @Roles('admin', 'doctor')
  async getAllExaminationReports(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.patientService.getAllExaminationReports(page, pageSize, keyword);
  }

  @Get(':id')
  @Roles('admin', 'doctor')
  async getExaminationReportById(@Param('id') id: string) {
    const report = (this.patientService as any).mockExaminationReports.find(
      (r: any) => r.id === id,
    );
    if (!report) {
      throw new Error('检查报告不存在');
    }
    return report;
  }

  @Post()
  @Roles('admin', 'doctor')
  async createExaminationReport(@Body() dto: CreateExaminationReportDto) {
    if (!dto.patientId) {
      throw new Error('patientId 不能为空');
    }
    return this.patientService.createExaminationReport(dto.patientId, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteExaminationReport(@Param('id') id: string) {
    const reports = (this.patientService as any).mockExaminationReports;
    const index = reports.findIndex((r: any) => r.id === id);
    if (index === -1) {
      throw new Error('检查报告不存在');
    }
    reports.splice(index, 1);
    return { success: true };
  }
}
