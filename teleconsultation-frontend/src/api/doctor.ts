import { get, post, put, del } from '@/utils/request'
import type {
  Doctor,
  DoctorListParams,
  DoctorListResponse,
  Department,
  WeeklyScheduleResponse,
  UpdateWeeklyScheduleDto,
  TemporaryScheduleDto,
  LeaveApplicationDto,
  ScheduleConflictResult,
  SpecialtiesResponse,
  UpdateSpecialtiesDto,
  DoctorCertification,
  CreateCertificationDto,
  UpdateCertificationDto,
  ExpiryReminderItem,
} from '@/types'

export function getDoctorList(params: DoctorListParams) {
  return get<DoctorListResponse>('/doctors', { params })
}

export function getDoctorDetail(id: string) {
  return get<Doctor>(`/doctors/${id}`)
}

export function createDoctor(data: Partial<Doctor>) {
  return post<Doctor>('/doctors', data)
}

export function updateDoctor(id: string, data: Partial<Doctor>) {
  return put<Doctor>(`/doctors/${id}`, data)
}

export function deleteDoctor(id: string) {
  return del(`/doctors/${id}`)
}

export function getDepartments() {
  return get<Department[]>('/doctors/departments')
}

export function getProfessionalTitles() {
  return get<string[]>('/doctors/professional-titles')
}

export function getDoctorSchedule(doctorId: string) {
  return get(`/doctors/${doctorId}/schedule`)
}

export function getWeeklySchedule(doctorId: string, weekOffset = 0) {
  return get<WeeklyScheduleResponse>(`/doctors/${doctorId}/weekly-schedule`, {
    params: { weekOffset }
  })
}

export function setWeeklySchedule(doctorId: string, data: UpdateWeeklyScheduleDto) {
  return put(`/doctors/${doctorId}/weekly-schedule`, data)
}

export function setTemporarySchedule(doctorId: string, data: TemporaryScheduleDto) {
  return post<ScheduleConflictResult>(`/doctors/${doctorId}/temporary-schedule`, data)
}

export function applyLeave(doctorId: string, data: LeaveApplicationDto) {
  return post(`/doctors/${doctorId}/leave`, data)
}

export function checkScheduleConflict(doctorId: string, date: string, timeSlot: string) {
  return post<ScheduleConflictResult>(`/doctors/${doctorId}/check-conflict`, { date, timeSlot })
}

export function getDoctorSpecialties(doctorId: string) {
  return get<SpecialtiesResponse>(`/doctors/${doctorId}/specialties`)
}

export function updateDoctorSpecialties(doctorId: string, data: UpdateSpecialtiesDto) {
  return put<SpecialtiesResponse>(`/doctors/${doctorId}/specialties`, data)
}

export function getDoctorCertifications(doctorId: string) {
  return get<DoctorCertification[]>(`/doctors/${doctorId}/certifications`)
}

export function createCertification(doctorId: string, data: CreateCertificationDto) {
  return post<DoctorCertification>(`/doctors/${doctorId}/certifications`, data)
}

export function updateCertification(certId: string, data: UpdateCertificationDto) {
  return put<DoctorCertification>(`/doctors/certifications/${certId}`, data)
}

export function deleteCertification(certId: string) {
  return del(`/doctors/certifications/${certId}`)
}

export function getExpiryReminders(days?: number, department?: string) {
  return get<ExpiryReminderItem[]>('/doctors/expiry-reminders', {
    params: { days, department }
  })
}

export function verifyLicense(doctorId: string, verified: boolean) {
  return post<Doctor>(`/doctors/${doctorId}/verify`, { verified })
}
