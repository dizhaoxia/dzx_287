import { Injectable, NotFoundException } from '@nestjs/common';
import { Patient } from '../../entities/patient.entity';
import { MedicalRecord } from '../../entities/medical-record.entity';
import { ExaminationReport } from '../../entities/examination-report.entity';
import { Allergy, AllergenType, AllergySeverity } from '../../entities/allergy.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { CreateExaminationReportDto } from './dto/create-examination-report.dto';
import { UpdateExaminationReportDto } from './dto/update-examination-report.dto';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';

@Injectable()
export class PatientService {
  private mockPatients: Patient[] = [
    {
      id: 'patient-1',
      userId: 'mock-patient-1',
      realName: '张三',
      gender: '男',
      age: 35,
      idCard: '110101199001011234',
      phoneNumber: '13800138001',
      address: '北京市朝阳区',
      emergencyContactName: '张妻',
      emergencyContactPhone: '13800138002',
      avatarUrl: '',
      bloodType: 'A型',
      allergies: '青霉素过敏',
      medicalHistory: '高血压病史3年',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 'patient-2',
      userId: 'mock-patient-2',
      realName: '李四',
      gender: '女',
      age: 28,
      idCard: '110101199605055678',
      phoneNumber: '13800138003',
      address: '北京市海淀区',
      emergencyContactName: '李母',
      emergencyContactPhone: '13800138004',
      avatarUrl: '',
      bloodType: 'B型',
      allergies: '海鲜过敏',
      medicalHistory: '无',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-10'),
    },
    {
      id: 'patient-3',
      userId: 'mock-patient-3',
      realName: '王五',
      gender: '男',
      age: 45,
      idCard: '110101197903039012',
      phoneNumber: '13800138005',
      address: '北京市西城区',
      emergencyContactName: '王儿',
      emergencyContactPhone: '13800138006',
      avatarUrl: '',
      bloodType: 'O型',
      allergies: '花粉过敏',
      medicalHistory: '糖尿病史5年',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-20'),
    },
  ];

  private mockMedicalRecords: MedicalRecord[] = [
    {
      id: 'record-1',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      doctorName: '李医生',
      hospitalName: '北京协和医院',
      department: '内科',
      recordType: '门诊病历',
      visitDate: new Date('2024-01-15'),
      chiefComplaint: '头痛、头晕1周',
      presentIllness: '患者1周前无明显诱因出现头痛，以双侧颞部为主，呈持续性胀痛，伴头晕',
      pastHistory: '高血压病史3年，规律服药',
      personalHistory: '吸烟10年，每日10支',
      familyHistory: '父亲有高血压病史',
      physicalExamination: 'BP 145/95mmHg，心率78次/分，心肺未见异常',
      diagnosis: '高血压病2级',
      treatmentPlan: '继续降压治疗，监测血压',
      prescription: '氨氯地平 5mg qd',
      notes: '定期复查',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'record-2',
      patientId: 'patient-1',
      doctorId: 'doctor-2',
      doctorName: '王医生',
      hospitalName: '北京协和医院',
      department: '内分泌科',
      recordType: '复诊病历',
      visitDate: new Date('2024-02-20'),
      chiefComplaint: '血糖控制不佳1月',
      presentIllness: '患者1月来自觉血糖控制不佳，空腹血糖约8-9mmol/L',
      pastHistory: '糖尿病史5年',
      personalHistory: '饮食控制尚可，运动较少',
      familyHistory: '母亲有糖尿病史',
      physicalExamination: '身高175cm，体重80kg，BMI 26.1',
      diagnosis: '2型糖尿病',
      treatmentPlan: '调整降糖方案，增加运动',
      prescription: '二甲双胍 0.5g tid',
      notes: '监测血糖，2周后复诊',
      createdAt: new Date('2024-02-20'),
    },
  ];

  private mockExaminationReports: ExaminationReport[] = [
    {
      id: 'report-1',
      patientId: 'patient-1',
      reportName: '血常规检查',
      reportType: '血液检查',
      examinationDate: new Date('2024-01-15'),
      hospitalName: '北京协和医院',
      department: '检验科',
      doctorName: '王医生',
      examinationItems: '白细胞、红细胞、血小板',
      examinationResults: 'WBC 6.5×10^9/L，RBC 4.8×10^12/L，PLT 220×10^9/L',
      conclusion: '血常规基本正常',
      suggestions: '定期复查',
      reportFileUrl: '',
      reportImages: '',
      fileUrl: '/uploads/reports/report-1.pdf',
      uploadedBy: 'doctor-1',
      uploadedByName: '李医生',
      uploadTime: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 'report-2',
      patientId: 'patient-1',
      reportName: '心电图检查',
      reportType: '影像检查',
      examinationDate: new Date('2024-01-16'),
      hospitalName: '北京协和医院',
      department: '心内科',
      doctorName: '张医生',
      examinationItems: '12导联心电图',
      examinationResults: '窦性心律，心率75次/分，各导联未见明显ST-T改变',
      conclusion: '大致正常心电图',
      suggestions: '定期复查',
      reportFileUrl: '',
      reportImages: '',
      fileUrl: '/uploads/reports/report-2.pdf',
      uploadedBy: 'doctor-1',
      uploadedByName: '李医生',
      uploadTime: new Date('2024-01-16'),
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
    },
  ];

  private mockAllergies: Allergy[] = [
    {
      id: 'allergy-1',
      patientId: 'patient-1',
      allergenType: AllergenType.DRUG,
      allergenName: '青霉素',
      severity: AllergySeverity.SEVERE,
      reactionDescription: '皮疹、呼吸困难',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'allergy-2',
      patientId: 'patient-1',
      allergenType: AllergenType.FOOD,
      allergenName: '海鲜',
      severity: AllergySeverity.MODERATE,
      reactionDescription: '皮肤瘙痒、红疹',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  constructor() {}

  async getPatientByUserId(userId: string): Promise<Patient> {
    const patient = this.mockPatients.find(p => p.userId === userId);
    if (!patient) {
      throw new NotFoundException('患者档案不存在');
    }
    return patient;
  }

  async getPatientById(id: string): Promise<Patient> {
    const patient = this.mockPatients.find(p => p.id === id);
    if (!patient) {
      throw new NotFoundException('患者不存在');
    }
    return patient;
  }

  async getPatientList(
    queryPatientDto: QueryPatientDto,
  ): Promise<{ list: Patient[]; total: number; page: number; pageSize: number }> {
    const { page = 1, pageSize = 10, keyword, gender } = queryPatientDto;
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;

    let filtered = [...this.mockPatients];

    if (keyword) {
      filtered = filtered.filter(
        p =>
          p.realName?.includes(keyword) ||
          p.phoneNumber?.includes(keyword) ||
          p.idCard?.includes(keyword) ||
          p.address?.includes(keyword),
      );
    }

    if (gender) {
      filtered = filtered.filter(p => p.gender === gender);
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSizeNum;
    const list = filtered.slice(start, start + pageSizeNum);

    return { list, total, page: pageNum, pageSize: pageSizeNum };
  }

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      userId: createPatientDto.userId || `user-${Date.now()}`,
      ...createPatientDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Patient;
    this.mockPatients.push(newPatient);
    return newPatient;
  }

  async updatePatient(userId: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const index = this.mockPatients.findIndex(p => p.userId === userId);
    if (index === -1) {
      const newPatient: Patient = {
        id: `patient-${Date.now()}`,
        userId,
        ...updatePatientDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Patient;
      this.mockPatients.push(newPatient);
      return newPatient;
    }

    this.mockPatients[index] = {
      ...this.mockPatients[index],
      ...updatePatientDto,
      updatedAt: new Date(),
    };
    return this.mockPatients[index];
  }

  async updatePatientById(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const index = this.mockPatients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException('患者不存在');
    }

    this.mockPatients[index] = {
      ...this.mockPatients[index],
      ...updatePatientDto,
      updatedAt: new Date(),
    };
    return this.mockPatients[index];
  }

  async deletePatient(id: string): Promise<void> {
    const index = this.mockPatients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException('患者不存在');
    }
    this.mockPatients.splice(index, 1);

    this.mockMedicalRecords = this.mockMedicalRecords.filter(r => r.patientId !== id);
    this.mockExaminationReports = this.mockExaminationReports.filter(r => r.patientId !== id);
    this.mockAllergies = this.mockAllergies.filter(a => a.patientId !== id);
  }

  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    return this.mockMedicalRecords
      .filter(r => r.patientId === patientId)
      .sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
  }

  async getMedicalRecordById(patientId: string, recordId: string): Promise<MedicalRecord> {
    const record = this.mockMedicalRecords.find(
      r => r.id === recordId && r.patientId === patientId,
    );
    if (!record) {
      throw new NotFoundException('病历不存在');
    }
    return record;
  }

  async createMedicalRecord(
    patientId: string,
    createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const newRecord: MedicalRecord = {
      id: `record-${Date.now()}`,
      patientId,
      ...createMedicalRecordDto,
      createdAt: new Date(),
    } as MedicalRecord;
    this.mockMedicalRecords.push(newRecord);
    return newRecord;
  }

  async updateMedicalRecord(
    patientId: string,
    recordId: string,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const index = this.mockMedicalRecords.findIndex(
      r => r.id === recordId && r.patientId === patientId,
    );
    if (index === -1) {
      throw new NotFoundException('病历不存在');
    }

    this.mockMedicalRecords[index] = {
      ...this.mockMedicalRecords[index],
      ...updateMedicalRecordDto,
    };
    return this.mockMedicalRecords[index];
  }

  async deleteMedicalRecord(patientId: string, recordId: string): Promise<void> {
    const index = this.mockMedicalRecords.findIndex(
      r => r.id === recordId && r.patientId === patientId,
    );
    if (index === -1) {
      throw new NotFoundException('病历不存在');
    }
    this.mockMedicalRecords.splice(index, 1);
  }

  async getExaminationReports(patientId: string): Promise<ExaminationReport[]> {
    return this.mockExaminationReports
      .filter(r => r.patientId === patientId)
      .sort((a, b) => b.examinationDate.getTime() - a.examinationDate.getTime());
  }

  async getExaminationReportById(
    patientId: string,
    reportId: string,
  ): Promise<ExaminationReport> {
    const report = this.mockExaminationReports.find(
      r => r.id === reportId && r.patientId === patientId,
    );
    if (!report) {
      throw new NotFoundException('检查报告不存在');
    }
    return report;
  }

  async createExaminationReport(
    patientId: string,
    createExaminationReportDto: CreateExaminationReportDto,
  ): Promise<ExaminationReport> {
    const newReport: ExaminationReport = {
      id: `report-${Date.now()}`,
      patientId,
      ...createExaminationReportDto,
      uploadTime: createExaminationReportDto.uploadTime || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ExaminationReport;
    this.mockExaminationReports.push(newReport);
    return newReport;
  }

  async updateExaminationReport(
    patientId: string,
    reportId: string,
    updateExaminationReportDto: UpdateExaminationReportDto,
  ): Promise<ExaminationReport> {
    const index = this.mockExaminationReports.findIndex(
      r => r.id === reportId && r.patientId === patientId,
    );
    if (index === -1) {
      throw new NotFoundException('检查报告不存在');
    }

    this.mockExaminationReports[index] = {
      ...this.mockExaminationReports[index],
      ...updateExaminationReportDto,
      updatedAt: new Date(),
    };
    return this.mockExaminationReports[index];
  }

  async deleteExaminationReport(patientId: string, reportId: string): Promise<void> {
    const index = this.mockExaminationReports.findIndex(
      r => r.id === reportId && r.patientId === patientId,
    );
    if (index === -1) {
      throw new NotFoundException('检查报告不存在');
    }
    this.mockExaminationReports.splice(index, 1);
  }

  async uploadExaminationReport(
    patientId: string,
    fileUrl: string,
    fileName: string,
    uploadedBy: string,
    uploadedByName: string,
  ): Promise<ExaminationReport> {
    const newReport: ExaminationReport = {
      id: `report-${Date.now()}`,
      patientId,
      reportName: fileName,
      fileUrl,
      uploadedBy,
      uploadedByName,
      uploadTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ExaminationReport;
    this.mockExaminationReports.push(newReport);
    return newReport;
  }

  async getAllergyList(patientId: string): Promise<Allergy[]> {
    return this.mockAllergies.filter(a => a.patientId === patientId);
  }

  async getAllergyById(patientId: string, allergyId: string): Promise<Allergy> {
    const allergy = this.mockAllergies.find(
      a => a.id === allergyId && a.patientId === patientId,
    );
    if (!allergy) {
      throw new NotFoundException('过敏记录不存在');
    }
    return allergy;
  }

  async createAllergy(
    patientId: string,
    createAllergyDto: CreateAllergyDto,
  ): Promise<Allergy> {
    const newAllergy: Allergy = {
      id: `allergy-${Date.now()}`,
      patientId,
      ...createAllergyDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Allergy;
    this.mockAllergies.push(newAllergy);
    return newAllergy;
  }

  async updateAllergy(
    patientId: string,
    allergyId: string,
    updateAllergyDto: UpdateAllergyDto,
  ): Promise<Allergy> {
    const index = this.mockAllergies.findIndex(
      a => a.id === allergyId && a.patientId === patientId,
    );
    if (index === -1) {
      throw new NotFoundException('过敏记录不存在');
    }

    this.mockAllergies[index] = {
      ...this.mockAllergies[index],
      ...updateAllergyDto,
      updatedAt: new Date(),
    };
    return this.mockAllergies[index];
  }

  async deleteAllergy(patientId: string, allergyId: string): Promise<void> {
    const index = this.mockAllergies.findIndex(
      a => a.id === allergyId && a.patientId === patientId,
    );
    if (index === -1) {
      throw new NotFoundException('过敏记录不存在');
    }
    this.mockAllergies.splice(index, 1);
  }

  async getAllergies(patientId: string): Promise<string[]> {
    const allergies = this.mockAllergies.filter(a => a.patientId === patientId);
    return allergies.map(a => a.allergenName);
  }

  async updateAllergies(patientId: string, allergies: string[]): Promise<string[]> {
    return allergies;
  }

  async getAllMedicalRecords(
    page: number = 1,
    pageSize: number = 10,
    keyword?: string,
  ): Promise<{ list: MedicalRecord[]; total: number; page: number; pageSize: number }> {
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;

    let filtered = [...this.mockMedicalRecords];

    if (keyword) {
      filtered = filtered.filter(
        r =>
          r.chiefComplaint?.includes(keyword) ||
          r.diagnosis?.includes(keyword) ||
          r.department?.includes(keyword) ||
          r.doctorName?.includes(keyword),
      );
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSizeNum;
    const list = filtered.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime()).slice(start, start + pageSizeNum);

    return { list, total, page: pageNum, pageSize: pageSizeNum };
  }

  async getAllExaminationReports(
    page: number = 1,
    pageSize: number = 10,
    keyword?: string,
  ): Promise<{ list: ExaminationReport[]; total: number; page: number; pageSize: number }> {
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;

    let filtered = [...this.mockExaminationReports];

    if (keyword) {
      filtered = filtered.filter(
        r =>
          r.reportName?.includes(keyword) ||
          r.reportType?.includes(keyword) ||
          r.department?.includes(keyword) ||
          r.conclusion?.includes(keyword),
      );
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSizeNum;
    const list = filtered.sort((a, b) => b.examinationDate.getTime() - a.examinationDate.getTime()).slice(start, start + pageSizeNum);

    return { list, total, page: pageNum, pageSize: pageSizeNum };
  }

  async getAllAllergies(
    page: number = 1,
    pageSize: number = 10,
    keyword?: string,
  ): Promise<{ list: Allergy[]; total: number; page: number; pageSize: number }> {
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;

    let filtered = [...this.mockAllergies];

    if (keyword) {
      filtered = filtered.filter(
        a =>
          a.allergenName?.includes(keyword) ||
          a.allergenType?.includes(keyword) ||
          a.reactionDescription?.includes(keyword),
      );
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSizeNum;
    const list = filtered.slice(start, start + pageSizeNum);

    return { list, total, page: pageNum, pageSize: pageSizeNum };
  }
}
