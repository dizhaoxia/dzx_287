import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'doctor_id', nullable: true })
  doctorId: string;

  @Column({ name: 'doctor_name', nullable: true })
  doctorName: string;

  @Column({ name: 'hospital_name', nullable: true })
  hospitalName: string;

  @Column({ name: 'department', nullable: true })
  department: string;

  @Column({ name: 'record_type', nullable: true })
  recordType: string;

  @Column({ name: 'visit_date', nullable: true })
  visitDate: Date;

  @Column({ type: 'text', name: 'chief_complaint', nullable: true })
  chiefComplaint: string;

  @Column({ type: 'text', name: 'present_illness', nullable: true })
  presentIllness: string;

  @Column({ type: 'text', name: 'past_history', nullable: true })
  pastHistory: string;

  @Column({ type: 'text', name: 'personal_history', nullable: true })
  personalHistory: string;

  @Column({ type: 'text', name: 'family_history', nullable: true })
  familyHistory: string;

  @Column({ type: 'text', name: 'physical_examination', nullable: true })
  physicalExamination: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', name: 'treatment_plan', nullable: true })
  treatmentPlan: string;

  @Column({ type: 'text', name: 'prescription', nullable: true })
  prescription: string;

  @Column({ type: 'text', name: 'notes', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
