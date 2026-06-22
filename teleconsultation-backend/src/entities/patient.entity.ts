import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('patients')
export class Patient {
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

  @Column({ name: 'id_card', nullable: true })
  idCard: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'emergency_contact_name', nullable: true })
  emergencyContactName: string;

  @Column({ name: 'emergency_contact_phone', nullable: true })
  emergencyContactPhone: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'blood_type', nullable: true })
  bloodType: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'text', name: 'medical_history', nullable: true })
  medicalHistory: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
