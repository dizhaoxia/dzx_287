import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'real_name', nullable: true })
  realName: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  age: number;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  department: string;

  @Column({ name: 'professional_title', nullable: true })
  professionalTitle: string;

  @Column({ name: 'hospital_name', nullable: true })
  hospitalName: string;

  @Column({ type: 'text', name: 'specialties', nullable: true })
  specialties: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'license_number', nullable: true })
  licenseNumber: string;

  @Column({ name: 'license_verified', default: false })
  licenseVerified: boolean;

  @Column({ name: 'consultation_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  consultationFee: number;

  @Column({ name: 'rating', type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ name: 'consultation_count', default: 0 })
  consultationCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
