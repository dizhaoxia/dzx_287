import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('examination_reports')
export class ExaminationReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({ name: 'report_name', nullable: true })
  reportName: string;

  @Column({ name: 'report_type', nullable: true })
  reportType: string;

  @Column({ name: 'examination_date', nullable: true })
  examinationDate: Date;

  @Column({ name: 'hospital_name', nullable: true })
  hospitalName: string;

  @Column({ name: 'department', nullable: true })
  department: string;

  @Column({ name: 'doctor_name', nullable: true })
  doctorName: string;

  @Column({ type: 'text', name: 'examination_items', nullable: true })
  examinationItems: string;

  @Column({ type: 'text', name: 'examination_results', nullable: true })
  examinationResults: string;

  @Column({ type: 'text', name: 'conclusion', nullable: true })
  conclusion: string;

  @Column({ type: 'text', name: 'suggestions', nullable: true })
  suggestions: string;

  @Column({ name: 'report_file_url', nullable: true })
  reportFileUrl: string;

  @Column({ name: 'report_images', type: 'text', nullable: true })
  reportImages: string;

  @Column({ name: 'file_url', nullable: true })
  fileUrl: string;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedBy: string;

  @Column({ name: 'uploaded_by_name', nullable: true })
  uploadedByName: string;

  @Column({ name: 'upload_time', nullable: true })
  uploadTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
