import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ConsultationAttachment } from './consultation-attachment.entity';

export enum ConsultationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export enum ConsultationType {
  SINGLE = 'single',
  MULTI = 'multi',
  EMERGENCY = 'emergency',
}

export enum UrgencyLevel {
  NORMAL = 'normal',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
}

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_no', unique: true })
  applicationNo: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'applicant_id' })
  applicantId: string;

  @Column({ name: 'applicant_name', nullable: true })
  applicantName: string;

  @Column({ name: 'applicant_role', nullable: true })
  applicantRole: string;

  @Column({ name: 'patient_name', nullable: true })
  patientName: string;

  @Column({ name: 'department' })
  department: string;

  @Column({ type: 'enum', enum: ConsultationType, name: 'consultation_type', default: ConsultationType.SINGLE })
  consultationType: ConsultationType;

  @Column({ type: 'enum', enum: UrgencyLevel, name: 'urgency_level', default: UrgencyLevel.NORMAL })
  urgencyLevel: UrgencyLevel;

  @Column({ name: 'target_doctors', type: 'simple-array', nullable: true })
  targetDoctorIds: string[];

  @Column({ name: 'target_doctor_names', type: 'simple-array', nullable: true })
  targetDoctorNames: string[];

  @Column({ name: 'target_departments', type: 'simple-array', nullable: true })
  targetDepartments: string[];

  @Column({ type: 'text', name: 'consultation_purpose', nullable: true })
  consultationPurpose: string;

  @Column({ type: 'text', name: 'condition_summary', nullable: true })
  conditionSummary: string;

  @Column({ type: 'enum', enum: ConsultationStatus, default: ConsultationStatus.PENDING })
  status: ConsultationStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fee: number;

  @Column({ name: 'is_paid', default: false })
  isPaid: boolean;

  @Column({ name: 'scheduled_at', nullable: true })
  scheduledAt: Date;

  @Column({ name: 'started_at', nullable: true })
  startedAt: Date;

  @Column({ name: 'ended_at', nullable: true })
  endedAt: Date;

  @Column({ name: 'duration', default: 0 })
  duration: number;

  @Column({ type: 'text', name: 'rejection_reason', nullable: true })
  rejectionReason: string;

  @Column({ name: 'chief_doctor_id', nullable: true })
  chiefDoctorId: string;

  @Column({ name: 'chief_doctor_name', nullable: true })
  chiefDoctorName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  attachments?: ConsultationAttachment[];
}
