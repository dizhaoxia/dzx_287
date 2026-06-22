import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type ScheduleDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface ScheduleSlot {
  available: boolean;
  slots: number;
  startTime?: string;
  endTime?: string;
}

@Entity('doctor_schedules')
export class DoctorSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @Column({
    type: 'enum',
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  })
  day: ScheduleDay;

  @Column({ type: 'json', name: 'morning', nullable: true })
  morning: ScheduleSlot;

  @Column({ type: 'json', name: 'afternoon', nullable: true })
  afternoon: ScheduleSlot;

  @Column({ type: 'json', name: 'evening', nullable: true })
  evening: ScheduleSlot;

  @Column({ name: 'is_temporary', default: false })
  isTemporary: boolean;

  @Column({ name: 'specific_date', type: 'date', nullable: true })
  specificDate: string;

  @Column({ name: 'leave_type', nullable: true })
  leaveType: string;

  @Column({ name: 'leave_reason', type: 'text', nullable: true })
  leaveReason: string;

  @Column({ name: 'leave_status', default: 'pending' })
  leaveStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
