import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type CertificationType = 'practice' | 'professional_title' | 'specialty';

@Entity('doctor_certifications')
export class DoctorCertification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @Column({
    type: 'enum',
    enum: ['practice', 'professional_title', 'specialty'],
    name: 'cert_type',
  })
  certType: CertificationType;

  @Column({ name: 'cert_number' })
  certNumber: string;

  @Column({ name: 'cert_name' })
  certName: string;

  @Column({ name: 'cert_file_url', nullable: true })
  certFileUrl: string;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate: string;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: string;

  @Column({ name: 'issuing_authority', nullable: true })
  issuingAuthority: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ name: 'verified_by', nullable: true })
  verifiedBy: string;

  @Column({ type: 'text', name: 'remark', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
