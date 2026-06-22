import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('medical-records')
export class MedicalRecordController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @Roles('admin', 'doctor')
  async getAllMedicalRecords(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.patientService.getAllMedicalRecords(page, pageSize, keyword);
  }

  @Get(':id')
  @Roles('admin', 'doctor')
  async getMedicalRecordById(@Param('id') id: string) {
    const record = (this.patientService as any).mockMedicalRecords.find(
      (r: any) => r.id === id,
    );
    if (!record) {
      throw new Error('病历不存在');
    }
    return record;
  }

  @Post()
  @Roles('admin', 'doctor')
  async createMedicalRecord(@Body() dto: CreateMedicalRecordDto) {
    if (!dto.patientId) {
      throw new Error('patientId 不能为空');
    }
    return this.patientService.createMedicalRecord(dto.patientId, dto);
  }

  @Put(':id')
  @Roles('admin', 'doctor')
  async updateMedicalRecord(
    @Param('id') id: string,
    @Body() dto: UpdateMedicalRecordDto,
  ) {
    const records = (this.patientService as any).mockMedicalRecords;
    const index = records.findIndex((r: any) => r.id === id);
    if (index === -1) {
      throw new Error('病历不存在');
    }
    records[index] = { ...records[index], ...dto };
    return records[index];
  }

  @Delete(':id')
  @Roles('admin')
  async deleteMedicalRecord(@Param('id') id: string) {
    const records = (this.patientService as any).mockMedicalRecords;
    const index = records.findIndex((r: any) => r.id === id);
    if (index === -1) {
      throw new Error('病历不存在');
    }
    records.splice(index, 1);
    return { success: true };
  }
}
