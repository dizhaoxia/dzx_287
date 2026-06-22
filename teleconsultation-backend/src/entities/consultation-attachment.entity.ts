import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AttachmentType {
  DICOM = 'dicom',
  PDF = 'pdf',
  IMAGE = 'image',
  OTHER = 'other',
}

@Entity('consultation_attachments')
export class ConsultationAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'consultation_id' })
  consultationId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_url' })
  fileUrl: string;

  @Column({ type: 'enum', enum: AttachmentType, name: 'file_type', default: AttachmentType.OTHER })
  fileType: AttachmentType;

  @Column({ name: 'file_size', default: 0 })
  fileSize: number;

  @Column({ name: 'uploader_id' })
  uploaderId: string;

  @Column({ name: 'uploader_name', nullable: true })
  uploaderName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
