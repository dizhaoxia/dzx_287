import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum NotificationType {
  CONSULTATION_REQUEST = 'consultation_request',
  CONSULTATION_ACCEPTED = 'consultation_accepted',
  CONSULTATION_REJECTED = 'consultation_rejected',
  CONSULTATION_COMPLETED = 'consultation_completed',
  CONSULTATION_CANCELLED = 'consultation_cancelled',
  MESSAGE_RECEIVED = 'message_received',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  SYSTEM_NOTIFICATION = 'system_notification',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  DELETED = 'deleted',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ name: 'title' })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ name: 'related_id', nullable: true })
  relatedId: string;

  @Column({ name: 'related_type', nullable: true })
  relatedType: string;

  @Column({ name: 'sender_id', nullable: true })
  senderId: string;

  @Column({ name: 'sender_name', nullable: true })
  senderName: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', nullable: true })
  readAt: Date;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
