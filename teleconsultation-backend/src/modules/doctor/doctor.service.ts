import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Doctor } from '../../entities/doctor.entity';
import { DoctorSchedule, ScheduleDay, ScheduleSlot } from '../../entities/doctor-schedule.entity';
import { DoctorCertification, CertificationType } from '../../entities/doctor-certification.entity';
import { Department } from '../../entities/department.entity';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateSpecialtiesDto, SpecialtiesResponse } from './dto/specialties.dto';
import {
  UpdateWeeklyScheduleDto,
  TemporaryScheduleDto,
  LeaveApplicationDto,
  WeeklyScheduleResponse,
  DaySchedule,
  ScheduleConflictResult,
  ScheduleSlotDto,
} from './dto/schedule.dto';
import {
  CreateCertificationDto,
  UpdateCertificationDto,
  ExpiryReminderItem,
} from './dto/certification.dto';

@Injectable()
export class DoctorService {
  private mockDoctors: Doctor[] = [];
  private mockSchedules: DoctorSchedule[] = [];
  private mockCertifications: DoctorCertification[] = [];
  private mockDepartments: Department[] = [];
  private mockSpecialties: Map<string, SpecialtiesResponse> = new Map();
  private mockTemporarySchedules: Map<string, Map<string, any>> = new Map();
  private mockLeaves: any[] = [];

  constructor() {
    this.initMockData();
  }

  private initMockData() {
    this.mockDepartments = [
      { id: 'dept-1', deptName: '内科', deptCode: 'NM', description: '内科综合诊疗', parentId: null, sortOrder: 1, status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'dept-2', deptName: '外科', deptCode: 'SM', description: '外科手术诊疗', parentId: null, sortOrder: 2, status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'dept-3', deptName: '儿科', deptCode: 'PD', description: '儿童疾病诊疗', parentId: null, sortOrder: 3, status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'dept-4', deptName: '妇产科', deptCode: 'OBG', description: '妇产科诊疗', parentId: null, sortOrder: 4, status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'dept-5', deptName: '骨科', deptCode: 'OR', description: '骨科疾病诊疗', parentId: null, sortOrder: 5, status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'dept-6', deptName: '眼科', deptCode: 'OPH', description: '眼科疾病诊疗', parentId: null, sortOrder: 6, status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'dept-7', deptName: '皮肤科', deptCode: 'DER', description: '皮肤科疾病诊疗', parentId: null, sortOrder: 7, status: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'dept-8', deptName: '神经内科', deptCode: 'NEU', description: '神经内科疾病诊疗', parentId: null, sortOrder: 8, status: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    this.mockDoctors = [
      {
        id: 'doctor-1',
        userId: 'mock-doctor-1',
        realName: '李医生',
        gender: '男',
        age: 45,
        phoneNumber: '13900139001',
        avatarUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20doctor%20portrait%20headshot%20white%20coat%20friendly%20smile&image_size=square',
        department: '内科',
        professionalTitle: '主任医师',
        hospitalName: '北京协和医院',
        specialties: '高血压, 糖尿病, 冠心病',
        bio: '从事心血管内科临床工作20年，擅长高血压、冠心病、心力衰竭等疾病的诊治。',
        licenseNumber: '1101234567',
        licenseVerified: true,
        consultationFee: 200,
        rating: 4.8,
        consultationCount: 156,
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: 'doctor-2',
        userId: 'mock-doctor-2',
        realName: '王医生',
        gender: '女',
        age: 38,
        phoneNumber: '13900139002',
        avatarUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20doctor%20portrait%20headshot%20white%20coat%20friendly%20smile&image_size=square',
        department: '儿科',
        professionalTitle: '副主任医师',
        hospitalName: '北京儿童医院',
        specialties: '小儿呼吸系统疾病, 小儿感染性疾病',
        bio: '从事儿科临床工作15年，擅长小儿呼吸系统疾病、感染性疾病的诊治。',
        licenseNumber: '1101234568',
        licenseVerified: true,
        consultationFee: 150,
        rating: 4.9,
        consultationCount: 289,
        createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: 'doctor-3',
        userId: 'mock-doctor-3',
        realName: '张医生',
        gender: '男',
        age: 50,
        phoneNumber: '13900139003',
        avatarUrl: '',
        department: '骨科',
        professionalTitle: '主任医师',
        hospitalName: '北京积水潭医院',
        specialties: '关节置换, 骨折, 脊柱外科',
        bio: '骨科专家，从事临床工作25年，擅长关节置换手术。',
        licenseNumber: '1101234569',
        licenseVerified: true,
        consultationFee: 300,
        rating: 4.7,
        consultationCount: 203,
        createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: 'doctor-4',
        userId: 'mock-doctor-4',
        realName: '刘医生',
        gender: '女',
        age: 42,
        phoneNumber: '13900139004',
        avatarUrl: '',
        department: '皮肤科',
        professionalTitle: '副主任医师',
        hospitalName: '北京协和医院',
        specialties: '湿疹, 皮炎, 皮肤美容',
        bio: '皮肤病专家，从事临床工作18年。',
        licenseNumber: '1101234570',
        licenseVerified: false,
        consultationFee: 180,
        rating: 4.6,
        consultationCount: 178,
        createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: 'doctor-5',
        userId: 'mock-doctor-5',
        realName: '陈医生',
        gender: '男',
        age: 35,
        phoneNumber: '13900139005',
        avatarUrl: '',
        department: '神经内科',
        professionalTitle: '主治医师',
        hospitalName: '宣武医院',
        specialties: '头痛, 癫痫, 脑血管病',
        bio: '神经内科主治医师，擅长脑血管疾病诊治。',
        licenseNumber: '1101234571',
        licenseVerified: true,
        consultationFee: 120,
        rating: 4.5,
        consultationCount: 98,
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: 'doctor-6',
        userId: 'mock-doctor-6',
        realName: '赵医生',
        gender: '女',
        age: 48,
        phoneNumber: '13900139006',
        avatarUrl: '',
        department: '眼科',
        professionalTitle: '主任医师',
        hospitalName: '北京同仁医院',
        specialties: '白内障, 青光眼, 近视矫正',
        bio: '眼科专家，从事眼科临床工作25年。',
        licenseNumber: '1101234572',
        licenseVerified: true,
        consultationFee: 250,
        rating: 4.9,
        consultationCount: 312,
        createdAt: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ];

    const days: ScheduleDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    this.mockDoctors.forEach(doctor => {
      days.forEach((day, index) => {
        const morning: ScheduleSlot = {
          available: index < 5,
          slots: index < 5 ? 8 : 0,
          startTime: '08:00',
          endTime: '12:00',
        };
        const afternoon: ScheduleSlot = {
          available: index < 5,
          slots: index < 5 ? 6 : 0,
          startTime: '14:00',
          endTime: '17:30',
        };
        const evening: ScheduleSlot = {
          available: false,
          slots: 0,
          startTime: '19:00',
          endTime: '21:00',
        };
        this.mockSchedules.push({
          id: `schedule-${doctor.id}-${day}`,
          doctorId: doctor.id,
          day,
          morning,
          afternoon,
          evening,
          isTemporary: false,
          specificDate: null,
          leaveType: null,
          leaveReason: null,
          leaveStatus: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    const today = new Date();
    const addDays = (d: Date, days: number) => {
      const date = new Date(d);
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    };

    this.mockCertifications = [
      {
        id: 'cert-1',
        doctorId: 'doctor-1',
        certType: 'practice',
        certNumber: '1101234567',
        certName: '医师执业证书',
        certFileUrl: '',
        issueDate: addDays(today, -1000),
        expiryDate: addDays(today, 365),
        issuingAuthority: '北京市卫生健康委员会',
        status: 'verified',
        verifiedAt: new Date(),
        verifiedBy: 'admin',
        remark: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cert-2',
        doctorId: 'doctor-1',
        certType: 'professional_title',
        certNumber: 'ZC-2020-001',
        certName: '主任医师资格证书',
        certFileUrl: '',
        issueDate: addDays(today, -800),
        expiryDate: addDays(today, 1800),
        issuingAuthority: '北京市人力资源和社会保障局',
        status: 'verified',
        verifiedAt: new Date(),
        verifiedBy: 'admin',
        remark: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cert-3',
        doctorId: 'doctor-2',
        certType: 'practice',
        certNumber: '1101234568',
        certName: '医师执业证书',
        certFileUrl: '',
        issueDate: addDays(today, -700),
        expiryDate: addDays(today, 60),
        issuingAuthority: '北京市卫生健康委员会',
        status: 'verified',
        verifiedAt: new Date(),
        verifiedBy: 'admin',
        remark: '即将到期，请注意续期',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cert-4',
        doctorId: 'doctor-4',
        certType: 'practice',
        certNumber: '1101234570',
        certName: '医师执业证书',
        certFileUrl: '',
        issueDate: addDays(today, -200),
        expiryDate: addDays(today, 20),
        issuingAuthority: '北京市卫生健康委员会',
        status: 'pending',
        verifiedAt: null,
        verifiedBy: null,
        remark: '待审核',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    this.mockSpecialties.set('doctor-1', {
      diseaseTags: ['高血压', '糖尿病', '冠心病', '心力衰竭', '心律失常'],
      surgeryTypes: ['冠脉介入治疗', '心脏起搏器植入'],
      treatmentAreas: ['心血管内科', '高血压专科', '糖尿病心血管并发症'],
    });
    this.mockSpecialties.set('doctor-2', {
      diseaseTags: ['小儿感冒', '小儿肺炎', '小儿哮喘', '小儿腹泻'],
      surgeryTypes: [],
      treatmentAreas: ['小儿呼吸系统', '小儿感染性疾病', '儿童保健'],
    });
    this.mockSpecialties.set('doctor-3', {
      diseaseTags: ['骨折', '关节炎', '腰椎间盘突出', '骨质疏松'],
      surgeryTypes: ['全髋关节置换', '全膝关节置换', '脊柱内固定术'],
      treatmentAreas: ['关节外科', '脊柱外科', '创伤骨科'],
    });
    this.mockSpecialties.set('doctor-4', {
      diseaseTags: ['湿疹', '皮炎', '痤疮', '银屑病', '白癜风'],
      surgeryTypes: ['皮肤美容手术', '激光治疗'],
      treatmentAreas: ['皮肤病', '皮肤美容', '过敏性疾病'],
    });
    this.mockSpecialties.set('doctor-5', {
      diseaseTags: ['头痛', '癫痫', '脑梗塞', '脑出血', '帕金森病'],
      surgeryTypes: [],
      treatmentAreas: ['脑血管病', '癫痫专科', '头痛专科'],
    });
    this.mockSpecialties.set('doctor-6', {
      diseaseTags: ['白内障', '青光眼', '近视', '远视', '干眼症'],
      surgeryTypes: ['白内障超声乳化术', '青光眼小梁切除术', '激光近视矫正术'],
      treatmentAreas: ['白内障专科', '青光眼专科', '屈光不正'],
    });
  }

  async getDoctorByUserId(userId: string): Promise<Doctor> {
    const doctor = this.mockDoctors.find(d => d.userId === userId);
    if (!doctor) {
      throw new NotFoundException('医生档案不存在');
    }
    return doctor;
  }

  async getDoctorById(id: string): Promise<Doctor> {
    const doctor = this.mockDoctors.find(d => d.id === id);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }
    return doctor;
  }

  async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const newDoctor: Doctor = {
      id: `doctor-${Date.now()}`,
      userId: `user-${Date.now()}`,
      ...createDoctorDto,
      rating: 0,
      consultationCount: 0,
      licenseVerified: false,
      consultationFee: createDoctorDto.consultationFee || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Doctor;
    this.mockDoctors.push(newDoctor);
    this.initDoctorSchedule(newDoctor.id);
    return newDoctor;
  }

  private initDoctorSchedule(doctorId: string) {
    const days: ScheduleDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
      this.mockSchedules.push({
        id: `schedule-${doctorId}-${day}`,
        doctorId,
        day,
        morning: { available: true, slots: 8, startTime: '08:00', endTime: '12:00' },
        afternoon: { available: true, slots: 6, startTime: '14:00', endTime: '17:30' },
        evening: { available: false, slots: 0, startTime: '19:00', endTime: '21:00' },
        isTemporary: false,
        specificDate: null,
        leaveType: null,
        leaveReason: null,
        leaveStatus: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  async updateDoctor(userId: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const index = this.mockDoctors.findIndex(d => d.userId === userId);
    if (index === -1) {
      throw new NotFoundException('医生档案不存在');
    }
    this.mockDoctors[index] = {
      ...this.mockDoctors[index],
      ...updateDoctorDto,
      updatedAt: new Date(),
    };
    return this.mockDoctors[index];
  }

  async updateDoctorById(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const index = this.mockDoctors.findIndex(d => d.id === id);
    if (index === -1) {
      throw new NotFoundException('医生不存在');
    }
    this.mockDoctors[index] = {
      ...this.mockDoctors[index],
      ...updateDoctorDto,
      updatedAt: new Date(),
    };
    return this.mockDoctors[index];
  }

  async deleteDoctor(id: string): Promise<void> {
    const index = this.mockDoctors.findIndex(d => d.id === id);
    if (index === -1) {
      throw new NotFoundException('医生不存在');
    }
    this.mockDoctors.splice(index, 1);
    this.mockSchedules = this.mockSchedules.filter(s => s.doctorId !== id);
    this.mockCertifications = this.mockCertifications.filter(c => c.doctorId !== id);
    this.mockSpecialties.delete(id);
  }

  async getDoctorList(
    page: any = 1,
    pageSize: any = 10,
    department?: string,
    professionalTitle?: string,
    keyword?: string,
  ): Promise<{ list: Doctor[]; total: number; page: number; pageSize: number }> {
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;

    let filtered = [...this.mockDoctors];

    if (department) {
      filtered = filtered.filter(d => d.department === department);
    }

    if (professionalTitle) {
      filtered = filtered.filter(d => d.professionalTitle === professionalTitle);
    }

    if (keyword) {
      filtered = filtered.filter(
        d =>
          d.realName?.includes(keyword) ||
          d.specialties?.includes(keyword) ||
          d.hospitalName?.includes(keyword),
      );
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSizeNum;
    const list = filtered.slice(start, start + pageSizeNum);

    return { list, total, page: pageNum, pageSize: pageSizeNum };
  }

  async getDepartments(): Promise<Department[]> {
    return this.mockDepartments.filter(d => d.status);
  }

  async getProfessionalTitles(): Promise<string[]> {
    return [...new Set(this.mockDoctors.map(d => d.professionalTitle).filter(Boolean))];
  }

  async getSchedule(doctorId: string): Promise<any[]> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }

    const schedule = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayIndex = date.getDay();
      const dayNames: ScheduleDay[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayIndex];
      
      const daySchedule = this.mockSchedules.find(s => s.doctorId === doctorId && s.day === dayName);
      const tempSchedules = this.mockTemporarySchedules.get(doctorId);
      const dateStr = date.toISOString().split('T')[0];
      const tempSchedule = tempSchedules?.get(dateStr);

      const isLeave = this.mockLeaves.some(
        l => l.doctorId === doctorId && dateStr >= l.startDate && dateStr <= l.endDate && l.status === 'approved'
      );

      schedule.push({
        date: dateStr,
        day: dayName,
        morning: tempSchedule?.morning || daySchedule?.morning || { available: false, slots: 0 },
        afternoon: tempSchedule?.afternoon || daySchedule?.afternoon || { available: false, slots: 0 },
        evening: tempSchedule?.evening || daySchedule?.evening || { available: false, slots: 0 },
        isLeave,
        leaveType: isLeave ? '事假' : null,
        isTemporary: !!tempSchedule,
      });
    }
    return schedule;
  }

  async getWeeklySchedule(doctorId: string, weekOffset: number = 0): Promise<WeeklyScheduleResponse> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const days: ScheduleDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const schedule: DaySchedule[] = [];

    days.forEach((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySchedule = this.mockSchedules.find(s => s.doctorId === doctorId && s.day === day);
      const tempSchedules = this.mockTemporarySchedules.get(doctorId);
      const tempSchedule = tempSchedules?.get(dateStr);

      const isLeave = this.mockLeaves.some(
        l => l.doctorId === doctorId && dateStr >= l.startDate && dateStr <= l.endDate && l.status === 'approved'
      );
      const leaveRecord = this.mockLeaves.find(
        l => l.doctorId === doctorId && dateStr >= l.startDate && dateStr <= l.endDate
      );

      schedule.push({
        day,
        date: dateStr,
        morning: (tempSchedule?.morning || daySchedule?.morning) as ScheduleSlotDto,
        afternoon: (tempSchedule?.afternoon || daySchedule?.afternoon) as ScheduleSlotDto,
        evening: (tempSchedule?.evening || daySchedule?.evening) as ScheduleSlotDto,
        isLeave,
        leaveType: leaveRecord?.leaveType,
        isTemporary: !!tempSchedule,
      });
    });

    return {
      doctorId,
      weekStart: monday.toISOString().split('T')[0],
      weekEnd: sunday.toISOString().split('T')[0],
      schedule,
    };
  }

  async setWeeklySchedule(doctorId: string, dto: UpdateWeeklyScheduleDto): Promise<void> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }

    const days: ScheduleDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
      const dayData = (dto as any)[day];
      if (dayData) {
        const index = this.mockSchedules.findIndex(s => s.doctorId === doctorId && s.day === day);
        if (index !== -1) {
          if (dayData.morning) this.mockSchedules[index].morning = dayData.morning;
          if (dayData.afternoon) this.mockSchedules[index].afternoon = dayData.afternoon;
          if (dayData.evening) this.mockSchedules[index].evening = dayData.evening;
          this.mockSchedules[index].updatedAt = new Date();
        }
      }
    });
  }

  async setTemporarySchedule(doctorId: string, dto: TemporaryScheduleDto): Promise<ScheduleConflictResult> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }

    const conflict = await this.checkScheduleConflict(doctorId, dto.date, 'morning');
    if (conflict.hasConflict) {
      return conflict;
    }

    if (!this.mockTemporarySchedules.has(doctorId)) {
      this.mockTemporarySchedules.set(doctorId, new Map());
    }
    this.mockTemporarySchedules.get(doctorId)!.set(dto.date, {
      morning: dto.morning,
      afternoon: dto.afternoon,
      evening: dto.evening,
    });

    return { hasConflict: false };
  }

  async applyLeave(doctorId: string, dto: LeaveApplicationDto): Promise<any> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }

    if (new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new BadRequestException('结束日期不能早于开始日期');
    }

    const leave = {
      id: `leave-${Date.now()}`,
      doctorId,
      doctorName: doctor.realName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      leaveType: dto.leaveType,
      reason: dto.reason,
      status: 'pending',
      createdAt: new Date(),
    };
    this.mockLeaves.push(leave);
    return leave;
  }

  async checkScheduleConflict(
    doctorId: string,
    date: string,
    timeSlot: 'morning' | 'afternoon' | 'evening',
  ): Promise<ScheduleConflictResult> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }

    const isOnLeave = this.mockLeaves.some(
      l => l.doctorId === doctorId && date >= l.startDate && date <= l.endDate && l.status === 'approved'
    );
    if (isOnLeave) {
      return {
        hasConflict: true,
        message: '该日期医生已请假，存在排班冲突',
      };
    }

    return { hasConflict: false };
  }

  async getSpecialties(doctorId: string): Promise<SpecialtiesResponse> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }
    if (this.mockSpecialties.has(doctorId)) {
      return this.mockSpecialties.get(doctorId)!;
    }
    return { diseaseTags: [], surgeryTypes: [], treatmentAreas: [] };
  }

  async updateSpecialties(doctorId: string, dto: UpdateSpecialtiesDto): Promise<SpecialtiesResponse> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }
    const current = this.mockSpecialties.get(doctorId) || { diseaseTags: [], surgeryTypes: [], treatmentAreas: [] };
    const updated = {
      diseaseTags: dto.diseaseTags ?? current.diseaseTags,
      surgeryTypes: dto.surgeryTypes ?? current.surgeryTypes,
      treatmentAreas: dto.treatmentAreas ?? current.treatmentAreas,
    };
    this.mockSpecialties.set(doctorId, updated);
    return updated;
  }

  async getCertifications(doctorId: string): Promise<DoctorCertification[]> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }
    return this.mockCertifications.filter(c => c.doctorId === doctorId);
  }

  async createCertification(doctorId: string, dto: CreateCertificationDto): Promise<DoctorCertification> {
    const doctor = this.mockDoctors.find(d => d.id === doctorId);
    if (!doctor) {
      throw new NotFoundException('医生不存在');
    }
    const cert: DoctorCertification = {
      id: `cert-${Date.now()}`,
      doctorId,
      ...dto,
      status: 'pending',
      verifiedAt: null,
      verifiedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as DoctorCertification;
    this.mockCertifications.push(cert);
    return cert;
  }

  async updateCertification(certId: string, dto: UpdateCertificationDto): Promise<DoctorCertification> {
    const index = this.mockCertifications.findIndex(c => c.id === certId);
    if (index === -1) {
      throw new NotFoundException('资质认证不存在');
    }
    this.mockCertifications[index] = {
      ...this.mockCertifications[index],
      ...dto,
      updatedAt: new Date(),
    };
    return this.mockCertifications[index];
  }

  async deleteCertification(certId: string): Promise<void> {
    const index = this.mockCertifications.findIndex(c => c.id === certId);
    if (index === -1) {
      throw new NotFoundException('资质认证不存在');
    }
    this.mockCertifications.splice(index, 1);
  }

  async getExpiryReminders(days?: number, department?: string): Promise<ExpiryReminderItem[]> {
    const today = new Date();
    const thresholdDays = days || 90;
    const result: ExpiryReminderItem[] = [];

    this.mockCertifications.forEach(cert => {
      if (!cert.expiryDate) return;
      const expiry = new Date(cert.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= thresholdDays) {
        const doctor = this.mockDoctors.find(d => d.id === cert.doctorId);
        if (doctor) {
          if (department && doctor.department !== department) return;
          result.push({
            doctorId: doctor.id,
            doctorName: doctor.realName,
            department: doctor.department,
            certId: cert.id,
            certType: cert.certType,
            certName: cert.certName,
            expiryDate: cert.expiryDate,
            daysRemaining: diffDays,
          });
        }
      }
    });

    result.sort((a, b) => a.daysRemaining - b.daysRemaining);
    return result;
  }

  async verifyLicense(doctorId: string, verified: boolean): Promise<Doctor> {
    const index = this.mockDoctors.findIndex(d => d.id === doctorId);
    if (index === -1) {
      throw new NotFoundException('医生不存在');
    }
    this.mockDoctors[index].licenseVerified = verified;
    this.mockDoctors[index].updatedAt = new Date();
    return this.mockDoctors[index];
  }
}
