import { Controller, Get, Put, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UpdateSpecialtiesDto } from './dto/specialties.dto';
import {
  UpdateWeeklyScheduleDto,
  TemporaryScheduleDto,
  LeaveApplicationDto,
  ScheduleConflictCheckDto,
} from './dto/schedule.dto';
import {
  CreateCertificationDto,
  UpdateCertificationDto,
  ExpiryReminderQueryDto,
} from './dto/certification.dto';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('profile')
  @Roles('doctor', 'admin')
  async getProfile(@CurrentUser('userId') userId: string) {
    return this.doctorService.getDoctorByUserId(userId);
  }

  @Put('profile')
  @Roles('doctor', 'admin')
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctor(userId, updateDoctorDto);
  }

  @Public()
  @Get()
  async getDoctorList(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('department') department?: string,
    @Query('professionalTitle') professionalTitle?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.doctorService.getDoctorList(page, pageSize, department, professionalTitle, keyword);
  }

  @Public()
  @Get('departments')
  async getDepartments() {
    return this.doctorService.getDepartments();
  }

  @Public()
  @Get('professional-titles')
  async getProfessionalTitles() {
    return this.doctorService.getProfessionalTitles();
  }

  @Public()
  @Get(':id')
  async getDoctorById(@Param('id') id: string) {
    return this.doctorService.getDoctorById(id);
  }

  @Post()
  @Roles('admin')
  async createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.createDoctor(createDoctorDto);
  }

  @Put(':id')
  @Roles('admin')
  async updateDoctor(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctorById(id, updateDoctorDto);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteDoctor(@Param('id') id: string) {
    return this.doctorService.deleteDoctor(id);
  }

  @Public()
  @Get(':id/schedule')
  async getSchedule(@Param('id') doctorId: string) {
    return this.doctorService.getSchedule(doctorId);
  }

  @Public()
  @Get(':id/weekly-schedule')
  async getWeeklySchedule(
    @Param('id') doctorId: string,
    @Query('weekOffset') weekOffset: number = 0,
  ) {
    return this.doctorService.getWeeklySchedule(doctorId, Number(weekOffset));
  }

  @Put(':id/weekly-schedule')
  @Roles('doctor', 'admin')
  async setWeeklySchedule(
    @Param('id') doctorId: string,
    @Body() dto: UpdateWeeklyScheduleDto,
  ) {
    return this.doctorService.setWeeklySchedule(doctorId, dto);
  }

  @Post(':id/temporary-schedule')
  @Roles('doctor', 'admin')
  async setTemporarySchedule(
    @Param('id') doctorId: string,
    @Body() dto: TemporaryScheduleDto,
  ) {
    return this.doctorService.setTemporarySchedule(doctorId, dto);
  }

  @Post(':id/leave')
  @Roles('doctor', 'admin')
  async applyLeave(
    @Param('id') doctorId: string,
    @Body() dto: LeaveApplicationDto,
  ) {
    return this.doctorService.applyLeave(doctorId, dto);
  }

  @Public()
  @Post(':id/check-conflict')
  async checkScheduleConflict(
    @Param('id') doctorId: string,
    @Body() dto: ScheduleConflictCheckDto,
  ) {
    return this.doctorService.checkScheduleConflict(doctorId, dto.date, dto.timeSlot);
  }

  @Public()
  @Get(':id/specialties')
  async getSpecialties(@Param('id') doctorId: string) {
    return this.doctorService.getSpecialties(doctorId);
  }

  @Put(':id/specialties')
  @Roles('doctor', 'admin')
  async updateSpecialties(
    @Param('id') doctorId: string,
    @Body() dto: UpdateSpecialtiesDto,
  ) {
    return this.doctorService.updateSpecialties(doctorId, dto);
  }

  @Public()
  @Get(':id/certifications')
  async getCertifications(@Param('id') doctorId: string) {
    return this.doctorService.getCertifications(doctorId);
  }

  @Post(':id/certifications')
  @Roles('doctor', 'admin')
  async createCertification(
    @Param('id') doctorId: string,
    @Body() dto: CreateCertificationDto,
  ) {
    return this.doctorService.createCertification(doctorId, dto);
  }

  @Put('certifications/:certId')
  @Roles('doctor', 'admin')
  async updateCertification(
    @Param('certId') certId: string,
    @Body() dto: UpdateCertificationDto,
  ) {
    return this.doctorService.updateCertification(certId, dto);
  }

  @Delete('certifications/:certId')
  @Roles('admin')
  async deleteCertification(@Param('certId') certId: string) {
    return this.doctorService.deleteCertification(certId);
  }

  @Get('expiry-reminders')
  @Roles('admin')
  async getExpiryReminders(@Query() query: ExpiryReminderQueryDto) {
    const days = query.days ? Number(query.days) : undefined;
    return this.doctorService.getExpiryReminders(days, query.department);
  }

  @Post(':id/verify')
  @Roles('admin')
  async verifyLicense(
    @Param('id') doctorId: string,
    @Body('verified') verified: boolean,
  ) {
    return this.doctorService.verifyLicense(doctorId, verified);
  }
}
