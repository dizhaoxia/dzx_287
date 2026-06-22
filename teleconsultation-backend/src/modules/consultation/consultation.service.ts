import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Consultation, ConsultationStatus, ConsultationType, UrgencyLevel } from '../../entities/consultation.entity';
import { ConsultationAttachment, AttachmentType } from '../../entities/consultation-attachment.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { QueryConsultationDto } from './dto/query-consultation.dto';
import { RejectConsultationDto } from './dto/reject-consultation.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class ConsultationService {
  private mockConsultations: Consultation[] = [];
  private mockAttachments: ConsultationAttachment[] = [];
  private sequenceCounter = 0;

  constructor() {
    this.initMockData();
  }

  private initMockData() {
    const baseDate = new Date('2024-01-15');

    this.mockConsultations = [
      {
        id: 'consultation-1',
        applicationNo: 'HZ20240115000001',
        patientId: 'patient-1',
        applicantId: 'patient-1',
        applicantName: '张三',
        applicantRole: 'patient',
        patientName: '张三',
        department: '心内科',
        consultationType: ConsultationType.SINGLE,
        urgencyLevel: UrgencyLevel.NORMAL,
        targetDoctorIds: ['doctor-1'],
        targetDoctorNames: ['李医生'],
        targetDepartments: [],
        consultationPurpose: '高血压复诊，调整用药方案',
        conditionSummary: '患者有3年高血压病史，一直服用氨氯地平5mg qd，近期血压控制不佳，收缩压常在150-160mmHg之间波动，伴有头痛、头晕症状。',
        status: ConsultationStatus.COMPLETED,
        fee: 200,
        isPaid: true,
        scheduledAt: new Date('2024-01-20T10:00:00'),
        startedAt: new Date('2024-01-20T10:05:00'),
        endedAt: new Date('2024-01-20T10:35:00'),
        duration: 30,
        rejectionReason: null,
        chiefDoctorId: 'doctor-1',
        chiefDoctorName: '李医生',
        createdAt: new Date('2024-01-19T09:30:00'),
        updatedAt: new Date('2024-01-20T10:35:00'),
        attachments: [
          {
            id: 'attach-1',
            consultationId: 'consultation-1',
            fileName: '心电图报告.pdf',
            fileUrl: '/files/ecg-report.pdf',
            fileType: AttachmentType.PDF,
            fileSize: 1024000,
            uploaderId: 'patient-1',
            uploaderName: '张三',
            description: '近期心电图检查报告',
            createdAt: new Date('2024-01-19T09:35:00'),
            updatedAt: new Date('2024-01-19T09:35:00'),
          },
          {
            id: 'attach-2',
            consultationId: 'consultation-1',
            fileName: '血压监测记录.xlsx',
            fileUrl: '/files/bp-record.xlsx',
            fileType: AttachmentType.OTHER,
            fileSize: 51200,
            uploaderId: 'patient-1',
            uploaderName: '张三',
            description: '近一个月血压监测记录',
            createdAt: new Date('2024-01-19T09:36:00'),
            updatedAt: new Date('2024-01-19T09:36:00'),
          },
        ],
      },
      {
        id: 'consultation-2',
        applicationNo: 'HZ20240120000002',
        patientId: 'patient-1',
        applicantId: 'patient-1',
        applicantName: '张三',
        applicantRole: 'patient',
        patientName: '张三',
        department: '神经内科',
        consultationType: ConsultationType.MULTI,
        urgencyLevel: UrgencyLevel.URGENT,
        targetDoctorIds: ['doctor-2', 'doctor-3'],
        targetDoctorNames: ['王医生', '赵医生'],
        targetDepartments: ['神经内科', '心内科'],
        consultationPurpose: '多学科会诊，头痛原因待查',
        conditionSummary: '患者反复头痛1月余，伴有头晕、恶心，曾在内科就诊，诊断为高血压，但血压控制后头痛症状无明显缓解。请神经内科会诊协助诊断。',
        status: ConsultationStatus.PENDING,
        fee: 350,
        isPaid: false,
        scheduledAt: new Date(Date.now() + 86400000 * 2),
        startedAt: null,
        endedAt: null,
        duration: 0,
        rejectionReason: null,
        chiefDoctorId: null,
        chiefDoctorName: null,
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        attachments: [
          {
            id: 'attach-3',
            consultationId: 'consultation-2',
            fileName: '头颅CT影像.dcm',
            fileUrl: '/files/head-ct.dcm',
            fileType: AttachmentType.DICOM,
            fileSize: 52428800,
            uploaderId: 'patient-1',
            uploaderName: '张三',
            description: '头颅CT检查DICOM文件',
            createdAt: new Date(Date.now() - 3500000),
            updatedAt: new Date(Date.now() - 3500000),
          },
        ],
      },
      {
        id: 'consultation-3',
        applicationNo: 'HZ20240121000003',
        patientId: 'patient-2',
        applicantId: 'doctor-1',
        applicantName: '李医生',
        applicantRole: 'doctor',
        patientName: '李四',
        department: '急诊科',
        consultationType: ConsultationType.EMERGENCY,
        urgencyLevel: UrgencyLevel.EMERGENCY,
        targetDoctorIds: ['doctor-4'],
        targetDoctorNames: ['陈主任'],
        targetDepartments: [],
        consultationPurpose: '急危重症会诊，急性胸痛',
        conditionSummary: '患者因"突发胸痛2小时"入院，心电图提示ST段抬高，心肌酶升高，考虑急性心梗。请心内科主任紧急会诊。',
        status: ConsultationStatus.ACCEPTED,
        fee: 500,
        isPaid: true,
        scheduledAt: new Date(Date.now() + 1800000),
        startedAt: null,
        endedAt: null,
        duration: 0,
        rejectionReason: null,
        chiefDoctorId: 'doctor-4',
        chiefDoctorName: '陈主任',
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 900000),
        attachments: [],
      },
      {
        id: 'consultation-4',
        applicationNo: 'HZ20240118000004',
        patientId: 'patient-3',
        applicantId: 'patient-3',
        applicantName: '王五',
        applicantRole: 'patient',
        patientName: '王五',
        department: '皮肤科',
        consultationType: ConsultationType.SINGLE,
        urgencyLevel: UrgencyLevel.NORMAL,
        targetDoctorIds: ['doctor-5'],
        targetDoctorNames: ['刘医生'],
        targetDepartments: [],
        consultationPurpose: '慢性湿疹复诊',
        conditionSummary: '慢性湿疹病史5年，反复发作，近期加重，四肢皮疹明显，瘙痒剧烈。',
        status: ConsultationStatus.IN_PROGRESS,
        fee: 150,
        isPaid: true,
        scheduledAt: new Date(Date.now() - 1800000),
        startedAt: new Date(Date.now() - 1200000),
        endedAt: null,
        duration: 0,
        rejectionReason: null,
        chiefDoctorId: 'doctor-5',
        chiefDoctorName: '刘医生',
        createdAt: new Date('2024-01-18T14:00:00'),
        updatedAt: new Date(Date.now() - 1200000),
        attachments: [
          {
            id: 'attach-4',
            consultationId: 'consultation-4',
            fileName: '皮疹照片1.jpg',
            fileUrl: '/files/rash1.jpg',
            fileType: AttachmentType.IMAGE,
            fileSize: 2048000,
            uploaderId: 'patient-3',
            uploaderName: '王五',
            description: '左上肢皮疹照片',
            createdAt: new Date('2024-01-18T14:10:00'),
            updatedAt: new Date('2024-01-18T14:10:00'),
          },
          {
            id: 'attach-5',
            consultationId: 'consultation-4',
            fileName: '皮疹照片2.jpg',
            fileUrl: '/files/rash2.jpg',
            fileType: AttachmentType.IMAGE,
            fileSize: 1920000,
            uploaderId: 'patient-3',
            uploaderName: '王五',
            description: '右下肢皮疹照片',
            createdAt: new Date('2024-01-18T14:11:00'),
            updatedAt: new Date('2024-01-18T14:11:00'),
          },
        ],
      },
      {
        id: 'consultation-5',
        applicationNo: 'HZ20240110000005',
        patientId: 'patient-4',
        applicantId: 'patient-4',
        applicantName: '赵六',
        applicantRole: 'patient',
        patientName: '赵六',
        department: '骨科',
        consultationType: ConsultationType.SINGLE,
        urgencyLevel: UrgencyLevel.NORMAL,
        targetDoctorIds: ['doctor-6'],
        targetDoctorNames: ['孙医生'],
        targetDepartments: [],
        consultationPurpose: '骨折术后康复咨询',
        conditionSummary: '右胫骨骨折术后3个月，复查X线提示骨痂生长良好，咨询康复训练方案。',
        status: ConsultationStatus.CANCELLED,
        fee: 180,
        isPaid: false,
        scheduledAt: new Date('2024-01-12T15:00:00'),
        startedAt: null,
        endedAt: null,
        duration: 0,
        rejectionReason: null,
        chiefDoctorId: null,
        chiefDoctorName: null,
        createdAt: new Date('2024-01-10T10:00:00'),
        updatedAt: new Date('2024-01-11T08:00:00'),
        attachments: [],
      },
      {
        id: 'consultation-6',
        applicationNo: 'HZ20240112000006',
        patientId: 'patient-5',
        applicantId: 'patient-5',
        applicantName: '钱七',
        applicantRole: 'patient',
        patientName: '钱七',
        department: '内分泌科',
        consultationType: ConsultationType.SINGLE,
        urgencyLevel: UrgencyLevel.NORMAL,
        targetDoctorIds: ['doctor-7'],
        targetDoctorNames: ['周医生'],
        targetDepartments: [],
        consultationPurpose: '糖尿病血糖控制不佳',
        conditionSummary: '2型糖尿病病史8年，目前胰岛素治疗，近期血糖波动大，空腹血糖10mmol/L左右。',
        status: ConsultationStatus.REJECTED,
        fee: 220,
        isPaid: false,
        scheduledAt: new Date('2024-01-15T09:00:00'),
        startedAt: null,
        endedAt: null,
        duration: 0,
        rejectionReason: '医生当日有紧急手术安排，无法按时会诊，请预约其他时间或选择其他医生。',
        chiefDoctorId: null,
        chiefDoctorName: null,
        createdAt: new Date('2024-01-12T16:00:00'),
        updatedAt: new Date('2024-01-13T08:00:00'),
        attachments: [
          {
            id: 'attach-6',
            consultationId: 'consultation-6',
            fileName: '血糖监测报告.pdf',
            fileUrl: '/files/blood-sugar.pdf',
            fileType: AttachmentType.PDF,
            fileSize: 768000,
            uploaderId: 'patient-5',
            uploaderName: '钱七',
            description: '近一周血糖监测报告',
            createdAt: new Date('2024-01-12T16:20:00'),
            updatedAt: new Date('2024-01-12T16:20:00'),
          },
        ],
      },
    ];

    this.sequenceCounter = 10;

    this.mockAttachments = this.mockConsultations.flatMap(c => c.attachments || []);
  }

  private generateApplicationNo(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    this.sequenceCounter++;
    const sequence = String(this.sequenceCounter).padStart(6, '0');
    return `HZ${year}${month}${day}${sequence}`;
  }

  async createConsultation(
    userId: string,
    userName: string,
    userRole: string,
    createConsultationDto: CreateConsultationDto,
  ): Promise<Consultation> {
    const patientId = createConsultationDto.patientId || userId;
    const patientName = createConsultationDto.patientName || userName;

    const newConsultation: Consultation = {
      id: `consultation-${Date.now()}`,
      applicationNo: this.generateApplicationNo(),
      patientId,
      applicantId: userId,
      applicantName: userName,
      applicantRole: userRole,
      patientName,
      department: createConsultationDto.department,
      consultationType: createConsultationDto.consultationType,
      urgencyLevel: createConsultationDto.urgencyLevel,
      targetDoctorIds: createConsultationDto.targetDoctorIds || [],
      targetDoctorNames: createConsultationDto.targetDoctorNames || [],
      targetDepartments: createConsultationDto.targetDepartments || [],
      consultationPurpose: createConsultationDto.consultationPurpose || '',
      conditionSummary: createConsultationDto.conditionSummary || '',
      status: ConsultationStatus.PENDING,
      fee: this.calculateFee(createConsultationDto.consultationType, createConsultationDto.urgencyLevel),
      isPaid: false,
      scheduledAt: createConsultationDto.scheduledAt || null,
      startedAt: null,
      endedAt: null,
      duration: 0,
      rejectionReason: null,
      chiefDoctorId: null,
      chiefDoctorName: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      attachments: [],
    };

    this.mockConsultations.unshift(newConsultation);
    return newConsultation;
  }

  private calculateFee(type: ConsultationType, urgency: UrgencyLevel): number {
    let baseFee = 200;

    switch (type) {
      case ConsultationType.SINGLE:
        baseFee = 200;
        break;
      case ConsultationType.MULTI:
        baseFee = 350;
        break;
      case ConsultationType.EMERGENCY:
        baseFee = 500;
        break;
    }

    switch (urgency) {
      case UrgencyLevel.URGENT:
        baseFee *= 1.2;
        break;
      case UrgencyLevel.EMERGENCY:
        baseFee *= 1.5;
        break;
    }

    return Math.round(baseFee * 100) / 100;
  }

  async getConsultationList(
    userId: string,
    userRole: string,
    queryDto: QueryConsultationDto,
  ): Promise<{ list: Consultation[]; total: number; page: number; pageSize: number }> {
    const page = queryDto.page || 1;
    const pageSize = queryDto.pageSize || 10;

    let filtered = [...this.mockConsultations];

    if (userRole === 'patient') {
      filtered = filtered.filter(c => c.patientId === userId);
    } else if (userRole === 'doctor') {
      filtered = filtered.filter(c => c.targetDoctorIds?.includes(userId));
    }

    if (queryDto.status) {
      filtered = filtered.filter(c => c.status === queryDto.status);
    }

    if (queryDto.consultationType) {
      filtered = filtered.filter(c => c.consultationType === queryDto.consultationType);
    }

    if (queryDto.urgencyLevel) {
      filtered = filtered.filter(c => c.urgencyLevel === queryDto.urgencyLevel);
    }

    if (queryDto.department) {
      filtered = filtered.filter(c => c.department === queryDto.department);
    }

    if (queryDto.keyword) {
      const keyword = queryDto.keyword.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.applicationNo.toLowerCase().includes(keyword) ||
          c.patientName.toLowerCase().includes(keyword) ||
          c.consultationPurpose?.toLowerCase().includes(keyword),
      );
    }

    if (queryDto.startDate) {
      const start = new Date(queryDto.startDate);
      filtered = filtered.filter(c => c.createdAt >= start);
    }

    if (queryDto.endDate) {
      const end = new Date(queryDto.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(c => c.createdAt <= end);
    }

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return { list, total, page, pageSize };
  }

  async getConsultationById(
    consultationId: string,
    userId: string,
    userRole: string,
  ): Promise<Consultation> {
    const consultation = this.mockConsultations.find(c => c.id === consultationId);

    if (!consultation) {
      throw new NotFoundException('会诊记录不存在');
    }

    if (userRole === 'patient' && consultation.patientId !== userId) {
      throw new ForbiddenException('无权查看此会诊');
    }

    if (userRole === 'doctor' && !consultation.targetDoctorIds?.includes(userId)) {
      throw new ForbiddenException('无权查看此会诊');
    }

    const attachments = this.mockAttachments.filter(a => a.consultationId === consultationId);
    return { ...consultation, attachments };
  }

  async acceptConsultation(consultationId: string, doctorId: string, doctorName: string): Promise<Consultation> {
    const index = this.mockConsultations.findIndex(c => c.id === consultationId);

    if (index === -1) {
      throw new NotFoundException('会诊记录不存在');
    }

    const consultation = this.mockConsultations[index];

    if (consultation.status !== ConsultationStatus.PENDING) {
      throw new BadRequestException('会诊状态不允许接受');
    }

    if (!consultation.targetDoctorIds?.includes(doctorId)) {
      throw new ForbiddenException('无权操作此会诊');
    }

    consultation.status = ConsultationStatus.ACCEPTED;
    consultation.chiefDoctorId = doctorId;
    consultation.chiefDoctorName = doctorName;
    consultation.updatedAt = new Date();

    return consultation;
  }

  async rejectConsultation(
    consultationId: string,
    doctorId: string,
    rejectDto: RejectConsultationDto,
  ): Promise<Consultation> {
    const index = this.mockConsultations.findIndex(c => c.id === consultationId);

    if (index === -1) {
      throw new NotFoundException('会诊记录不存在');
    }

    const consultation = this.mockConsultations[index];

    if (consultation.status !== ConsultationStatus.PENDING) {
      throw new BadRequestException('会诊状态不允许拒绝');
    }

    if (!consultation.targetDoctorIds?.includes(doctorId)) {
      throw new ForbiddenException('无权操作此会诊');
    }

    consultation.status = ConsultationStatus.REJECTED;
    consultation.rejectionReason = rejectDto.rejectionReason;
    consultation.updatedAt = new Date();

    return consultation;
  }

  async startConsultation(consultationId: string, doctorId: string): Promise<Consultation> {
    const index = this.mockConsultations.findIndex(c => c.id === consultationId);

    if (index === -1) {
      throw new NotFoundException('会诊记录不存在');
    }

    const consultation = this.mockConsultations[index];

    if (consultation.status !== ConsultationStatus.ACCEPTED) {
      throw new BadRequestException('会诊状态不允许开始');
    }

    if (consultation.chiefDoctorId !== doctorId) {
      throw new ForbiddenException('无权操作此会诊');
    }

    consultation.status = ConsultationStatus.IN_PROGRESS;
    consultation.startedAt = new Date();
    consultation.updatedAt = new Date();

    return consultation;
  }

  async completeConsultation(
    consultationId: string,
    doctorId: string,
    updateConsultationDto: UpdateConsultationDto,
  ): Promise<Consultation> {
    const index = this.mockConsultations.findIndex(c => c.id === consultationId);

    if (index === -1) {
      throw new NotFoundException('会诊记录不存在');
    }

    const consultation = this.mockConsultations[index];

    if (
      consultation.status !== ConsultationStatus.IN_PROGRESS &&
      consultation.status !== ConsultationStatus.ACCEPTED
    ) {
      throw new BadRequestException('会诊状态不允许结束');
    }

    if (consultation.chiefDoctorId !== doctorId) {
      throw new ForbiddenException('无权操作此会诊');
    }

    consultation.status = ConsultationStatus.COMPLETED;
    consultation.endedAt = new Date();

    if (consultation.startedAt) {
      const duration = Math.floor(
        (consultation.endedAt.getTime() - consultation.startedAt.getTime()) / 60000,
      );
      consultation.duration = duration;
    }

    consultation.updatedAt = new Date();

    return consultation;
  }

  async cancelConsultation(consultationId: string, userId: string, userRole: string): Promise<Consultation> {
    const index = this.mockConsultations.findIndex(c => c.id === consultationId);

    if (index === -1) {
      throw new NotFoundException('会诊记录不存在');
    }

    const consultation = this.mockConsultations[index];

    if (consultation.status !== ConsultationStatus.PENDING) {
      throw new BadRequestException('会诊状态不允许取消');
    }

    if (userRole === 'patient' && consultation.patientId !== userId) {
      throw new ForbiddenException('无权操作此会诊');
    }

    if (userRole === 'doctor' && !consultation.targetDoctorIds?.includes(userId)) {
      throw new ForbiddenException('无权操作此会诊');
    }

    consultation.status = ConsultationStatus.CANCELLED;
    consultation.updatedAt = new Date();

    return consultation;
  }

  async getAttachments(consultationId: string, userId: string, userRole: string): Promise<ConsultationAttachment[]> {
    const consultation = this.mockConsultations.find(c => c.id === consultationId);

    if (!consultation) {
      throw new NotFoundException('会诊记录不存在');
    }

    if (userRole === 'patient' && consultation.patientId !== userId) {
      throw new ForbiddenException('无权查看此会诊附件');
    }

    if (userRole === 'doctor' && !consultation.targetDoctorIds?.includes(userId)) {
      throw new ForbiddenException('无权查看此会诊附件');
    }

    return this.mockAttachments.filter(a => a.consultationId === consultationId);
  }

  async addAttachment(
    consultationId: string,
    userId: string,
    userName: string,
    userRole: string,
    createAttachmentDto: CreateAttachmentDto,
  ): Promise<ConsultationAttachment> {
    const consultation = this.mockConsultations.find(c => c.id === consultationId);

    if (!consultation) {
      throw new NotFoundException('会诊记录不存在');
    }

    if (userRole === 'patient' && consultation.patientId !== userId) {
      throw new ForbiddenException('无权操作此会诊');
    }

    if (consultation.status === ConsultationStatus.COMPLETED || consultation.status === ConsultationStatus.CANCELLED) {
      throw new BadRequestException('会诊已结束，无法添加附件');
    }

    const newAttachment: ConsultationAttachment = {
      id: `attach-${Date.now()}`,
      consultationId,
      fileName: createAttachmentDto.fileName,
      fileUrl: createAttachmentDto.fileUrl,
      fileType: createAttachmentDto.fileType || AttachmentType.OTHER,
      fileSize: createAttachmentDto.fileSize || 0,
      uploaderId: userId,
      uploaderName: userName,
      description: createAttachmentDto.description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockAttachments.push(newAttachment);
    return newAttachment;
  }

  async deleteAttachment(
    consultationId: string,
    attachmentId: string,
    userId: string,
    userRole: string,
  ): Promise<void> {
    const consultation = this.mockConsultations.find(c => c.id === consultationId);

    if (!consultation) {
      throw new NotFoundException('会诊记录不存在');
    }

    const attachmentIndex = this.mockAttachments.findIndex(a => a.id === attachmentId);

    if (attachmentIndex === -1) {
      throw new NotFoundException('附件不存在');
    }

    const attachment = this.mockAttachments[attachmentIndex];

    if (attachment.consultationId !== consultationId) {
      throw new BadRequestException('附件不属于此会诊');
    }

    if (attachment.uploaderId !== userId) {
      throw new ForbiddenException('只能删除自己上传的附件');
    }

    if (consultation.status === ConsultationStatus.COMPLETED || consultation.status === ConsultationStatus.CANCELLED) {
      throw new BadRequestException('会诊已结束，无法删除附件');
    }

    this.mockAttachments.splice(attachmentIndex, 1);
  }

  async generateApplicationNoService(): Promise<{ applicationNo: string }> {
    return { applicationNo: this.generateApplicationNo() };
  }

  async getConsultationTimeline(
    consultationId: string,
    userId: string,
    userRole: string,
  ): Promise<Array<{ time: Date; action: string; operator: string; description?: string }>> {
    const consultation = await this.getConsultationById(consultationId, userId, userRole);

    const timeline: Array<{ time: Date; action: string; operator: string; description?: string }> = [];

    timeline.push({
      time: consultation.createdAt,
      action: '发起申请',
      operator: consultation.applicantName || '申请人',
      description: `会诊申请已提交，申请单号：${consultation.applicationNo}`,
    });

    if (consultation.status === ConsultationStatus.ACCEPTED || consultation.status === ConsultationStatus.IN_PROGRESS || consultation.status === ConsultationStatus.COMPLETED) {
      timeline.push({
        time: consultation.updatedAt,
        action: '接受会诊',
        operator: consultation.chiefDoctorName || '医生',
        description: '医生已接受会诊邀请',
      });
    }

    if (consultation.status === ConsultationStatus.REJECTED) {
      timeline.push({
        time: consultation.updatedAt,
        action: '拒绝会诊',
        operator: '医生',
        description: consultation.rejectionReason,
      });
    }

    if (consultation.startedAt) {
      timeline.push({
        time: consultation.startedAt,
        action: '开始会诊',
        operator: consultation.chiefDoctorName || '医生',
        description: '会诊正式开始',
      });
    }

    if (consultation.endedAt) {
      timeline.push({
        time: consultation.endedAt,
        action: '结束会诊',
        operator: consultation.chiefDoctorName || '医生',
        description: `会诊结束，持续 ${consultation.duration} 分钟`,
      });
    }

    if (consultation.status === ConsultationStatus.CANCELLED) {
      timeline.push({
        time: consultation.updatedAt,
        action: '取消会诊',
        operator: consultation.applicantName || '申请人',
        description: '会诊已取消',
      });
    }

    return timeline.sort((a, b) => a.time.getTime() - b.time.getTime());
  }
}
