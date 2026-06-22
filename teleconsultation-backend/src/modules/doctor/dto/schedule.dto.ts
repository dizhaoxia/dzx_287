import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString, IsObject, IsEnum } from 'class-validator';
import type { ScheduleDay } from '../../../entities/doctor-schedule.entity';

export interface ScheduleSlotDto {
  available: boolean;
  slots: number;
  startTime?: string;
  endTime?: string;
}

export class UpdateWeeklyScheduleDto {
  @IsOptional()
  @IsObject()
  monday?: {
    morning?: ScheduleSlotDto;
    afternoon?: ScheduleSlotDto;
    evening?: ScheduleSlotDto;
  };

  @IsOptional()
  @IsObject()
  tuesday?: {
    morning?: ScheduleSlotDto;
    afternoon?: ScheduleSlotDto;
    evening?: ScheduleSlotDto;
  };

  @IsOptional()
  @IsObject()
  wednesday?: {
    morning?: ScheduleSlotDto;
    afternoon?: ScheduleSlotDto;
    evening?: ScheduleSlotDto;
  };

  @IsOptional()
  @IsObject()
  thursday?: {
    morning?: ScheduleSlotDto;
    afternoon?: ScheduleSlotDto;
    evening?: ScheduleSlotDto;
  };

  @IsOptional()
  @IsObject()
  friday?: {
    morning?: ScheduleSlotDto;
    afternoon?: ScheduleSlotDto;
    evening?: ScheduleSlotDto;
  };

  @IsOptional()
  @IsObject()
  saturday?: {
    morning?: ScheduleSlotDto;
    afternoon?: ScheduleSlotDto;
    evening?: ScheduleSlotDto;
  };

  @IsOptional()
  @IsObject()
  sunday?: {
    morning?: ScheduleSlotDto;
    afternoon?: ScheduleSlotDto;
    evening?: ScheduleSlotDto;
  };
}

export class TemporaryScheduleDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsObject()
  morning?: ScheduleSlotDto;

  @IsOptional()
  @IsObject()
  afternoon?: ScheduleSlotDto;

  @IsOptional()
  @IsObject()
  evening?: ScheduleSlotDto;
}

export class LeaveApplicationDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  leaveType: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class ScheduleConflictCheckDto {
  @IsDateString()
  date: string;

  @IsEnum(['morning', 'afternoon', 'evening'])
  timeSlot: 'morning' | 'afternoon' | 'evening';
}

export interface DaySchedule {
  day: ScheduleDay;
  date?: string;
  morning: ScheduleSlotDto;
  afternoon: ScheduleSlotDto;
  evening: ScheduleSlotDto;
  isLeave?: boolean;
  leaveType?: string;
  isTemporary?: boolean;
}

export interface WeeklyScheduleResponse {
  doctorId: string;
  weekStart: string;
  weekEnd: string;
  schedule: DaySchedule[];
}

export interface ScheduleConflictResult {
  hasConflict: boolean;
  message?: string;
  conflictingDoctors?: string[];
}
