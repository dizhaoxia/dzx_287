import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { CreateExaminationReportDto } from './dto/create-examination-report.dto';
import { UpdateExaminationReportDto } from './dto/update-examination-report.dto';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('profile')
  @Roles('patient', 'admin')
  async getProfile(@CurrentUser('userId') userId: string) {
    return this.patientService.getPatientByUserId(userId);
  }

  @Put('profile')
  @Roles('patient', 'admin')
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientService.updatePatient(userId, updatePatientDto);
  }

  @Get('records')
  @Roles('patient', 'admin')
  async getMyMedicalRecords(@CurrentUser('userId') userId: string) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.getMedicalRecords(patient.id);
  }

  @Get('records/:id')
  @Roles('patient', 'admin')
  async getMyMedicalRecord(
    @CurrentUser('userId') userId: string,
    @Param('id') recordId: string,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.getMedicalRecordById(patient.id, recordId);
  }

  @Post('records')
  @Roles('patient', 'admin', 'doctor')
  async createMyMedicalRecord(
    @CurrentUser('userId') userId: string,
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.createMedicalRecord(patient.id, createMedicalRecordDto);
  }

  @Put('records/:id')
  @Roles('patient', 'admin', 'doctor')
  async updateMyMedicalRecord(
    @CurrentUser('userId') userId: string,
    @Param('id') recordId: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.updateMedicalRecord(
      patient.id,
      recordId,
      updateMedicalRecordDto,
    );
  }

  @Delete('records/:id')
  @Roles('patient', 'admin')
  async deleteMyMedicalRecord(
    @CurrentUser('userId') userId: string,
    @Param('id') recordId: string,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    await this.patientService.deleteMedicalRecord(patient.id, recordId);
  }

  @Get('examinations')
  @Roles('patient', 'admin', 'doctor')
  async getMyExaminationReports(@CurrentUser('userId') userId: string) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.getExaminationReports(patient.id);
  }

  @Get('examinations/:id')
  @Roles('patient', 'admin', 'doctor')
  async getMyExaminationReport(
    @CurrentUser('userId') userId: string,
    @Param('id') reportId: string,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.getExaminationReportById(patient.id, reportId);
  }

  @Post('examinations')
  @Roles('patient', 'admin', 'doctor')
  async createMyExaminationReport(
    @CurrentUser('userId') userId: string,
    @Body() createExaminationReportDto: CreateExaminationReportDto,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.createExaminationReport(
      patient.id,
      createExaminationReportDto,
    );
  }

  @Delete('examinations/:id')
  @Roles('patient', 'admin')
  async deleteMyExaminationReport(
    @CurrentUser('userId') userId: string,
    @Param('id') reportId: string,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    await this.patientService.deleteExaminationReport(patient.id, reportId);
  }

  @Get('allergies')
  @Roles('patient', 'admin', 'doctor')
  async getAllergyList(@CurrentUser('userId') userId: string) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.getAllergyList(patient.id);
  }

  @Get('allergies/:id')
  @Roles('patient', 'admin', 'doctor')
  async getAllergyDetail(
    @CurrentUser('userId') userId: string,
    @Param('id') allergyId: string,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.getAllergyById(patient.id, allergyId);
  }

  @Post('allergies')
  @Roles('patient', 'admin')
  async createAllergy(
    @CurrentUser('userId') userId: string,
    @Body() createAllergyDto: CreateAllergyDto,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.createAllergy(patient.id, createAllergyDto);
  }

  @Put('allergies/:id')
  @Roles('patient', 'admin')
  async updateAllergy(
    @CurrentUser('userId') userId: string,
    @Param('id') allergyId: string,
    @Body() updateAllergyDto: UpdateAllergyDto,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    return this.patientService.updateAllergy(patient.id, allergyId, updateAllergyDto);
  }

  @Delete('allergies/:id')
  @Roles('patient', 'admin')
  async deleteAllergy(
    @CurrentUser('userId') userId: string,
    @Param('id') allergyId: string,
  ) {
    const patient = await this.patientService.getPatientByUserId(userId);
    await this.patientService.deleteAllergy(patient.id, allergyId);
  }

  @Get()
  @Roles('admin')
  async getPatientList(@Query() queryPatientDto: QueryPatientDto) {
    return this.patientService.getPatientList(queryPatientDto);
  }

  @Get(':id')
  @Roles('admin', 'doctor')
  async getPatientById(@Param('id') id: string) {
    return this.patientService.getPatientById(id);
  }

  @Post()
  @Roles('admin')
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.createPatient(createPatientDto);
  }

  @Put(':id')
  @Roles('admin')
  async updatePatientById(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientService.updatePatientById(id, updatePatientDto);
  }

  @Delete(':id')
  @Roles('admin')
  async deletePatient(@Param('id') id: string) {
    await this.patientService.deletePatient(id);
  }

  @Get(':id/records')
  @Roles('admin', 'doctor')
  async getPatientMedicalRecords(@Param('id') patientId: string) {
    return this.patientService.getMedicalRecords(patientId);
  }

  @Get(':id/records/:recordId')
  @Roles('admin', 'doctor')
  async getPatientMedicalRecordDetail(
    @Param('id') patientId: string,
    @Param('recordId') recordId: string,
  ) {
    return this.patientService.getMedicalRecordById(patientId, recordId);
  }

  @Post(':id/records')
  @Roles('admin', 'doctor')
  async createPatientMedicalRecord(
    @Param('id') patientId: string,
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
  ) {
    return this.patientService.createMedicalRecord(patientId, createMedicalRecordDto);
  }

  @Put(':id/records/:recordId')
  @Roles('admin', 'doctor')
  async updatePatientMedicalRecord(
    @Param('id') patientId: string,
    @Param('recordId') recordId: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ) {
    return this.patientService.updateMedicalRecord(
      patientId,
      recordId,
      updateMedicalRecordDto,
    );
  }

  @Delete(':id/records/:recordId')
  @Roles('admin')
  async deletePatientMedicalRecord(
    @Param('id') patientId: string,
    @Param('recordId') recordId: string,
  ) {
    await this.patientService.deleteMedicalRecord(patientId, recordId);
  }

  @Get(':id/examinations')
  @Roles('admin', 'doctor')
  async getPatientExaminationReports(@Param('id') patientId: string) {
    return this.patientService.getExaminationReports(patientId);
  }

  @Get(':id/examinations/:reportId')
  @Roles('admin', 'doctor')
  async getPatientExaminationReportDetail(
    @Param('id') patientId: string,
    @Param('reportId') reportId: string,
  ) {
    return this.patientService.getExaminationReportById(patientId, reportId);
  }

  @Post(':id/examinations')
  @Roles('admin', 'doctor')
  async createPatientExaminationReport(
    @Param('id') patientId: string,
    @Body() createExaminationReportDto: CreateExaminationReportDto,
  ) {
    return this.patientService.createExaminationReport(
      patientId,
      createExaminationReportDto,
    );
  }

  @Delete(':id/examinations/:reportId')
  @Roles('admin')
  async deletePatientExaminationReport(
    @Param('id') patientId: string,
    @Param('reportId') reportId: string,
  ) {
    await this.patientService.deleteExaminationReport(patientId, reportId);
  }

  @Get(':id/allergies')
  @Roles('admin', 'doctor')
  async getPatientAllergyList(@Param('id') patientId: string) {
    return this.patientService.getAllergyList(patientId);
  }

  @Get(':id/allergies/:allergyId')
  @Roles('admin', 'doctor')
  async getPatientAllergyDetail(
    @Param('id') patientId: string,
    @Param('allergyId') allergyId: string,
  ) {
    return this.patientService.getAllergyById(patientId, allergyId);
  }

  @Post(':id/allergies')
  @Roles('admin')
  async createPatientAllergy(
    @Param('id') patientId: string,
    @Body() createAllergyDto: CreateAllergyDto,
  ) {
    return this.patientService.createAllergy(patientId, createAllergyDto);
  }

  @Put(':id/allergies/:allergyId')
  @Roles('admin')
  async updatePatientAllergy(
    @Param('id') patientId: string,
    @Param('allergyId') allergyId: string,
    @Body() updateAllergyDto: UpdateAllergyDto,
  ) {
    return this.patientService.updateAllergy(patientId, allergyId, updateAllergyDto);
  }

  @Delete(':id/allergies/:allergyId')
  @Roles('admin')
  async deletePatientAllergy(
    @Param('id') patientId: string,
    @Param('allergyId') allergyId: string,
  ) {
    await this.patientService.deleteAllergy(patientId, allergyId);
  }
}
