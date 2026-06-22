import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AnnouncementStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OFFLINE = 'offline',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'author_id', nullable: true })
  authorId: string;

  @Column({ name: 'author_name', nullable: true })
  authorName: string;

  @Column({ type: 'enum', enum: AnnouncementStatus, default: AnnouncementStatus.DRAFT })
  status: AnnouncementStatus;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'published_at', nullable: true })
  publishedAt: Date;
}
