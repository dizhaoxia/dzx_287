export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

export interface UserInfo {
  id: string
  username: string
  name: string
  avatar?: string
  role: 'admin' | 'doctor' | 'patient'
  phone?: string
  email?: string
  department?: string
}

export enum ConsultationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected'
}

export enum ConsultationType {
  SINGLE = 'single',
  MULTI = 'multi',
  EMERGENCY = 'emergency'
}

export enum UrgencyLevel {
  NORMAL = 'normal',
  URGENT = 'urgent',
  EMERGENCY = 'emergency'
}

export enum AttachmentType {
  DICOM = 'dicom',
  PDF = 'pdf',
  IMAGE = 'image',
  OTHER = 'other'
}

export interface ConsultationAttachment {
  id: string
  consultationId: string
  fileName: string
  fileUrl: string
  fileType: AttachmentType
  fileSize: number
  uploaderId: string
  uploaderName: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Consultation {
  id: string
  applicationNo: string
  patientId: string
  applicantId: string
  applicantName: string
  applicantRole: string
  patientName: string
  department: string
  consultationType: ConsultationType
  urgencyLevel: UrgencyLevel
  targetDoctorIds: string[]
  targetDoctorNames: string[]
  targetDepartments: string[]
  consultationPurpose: string
  conditionSummary: string
  status: ConsultationStatus
  fee: number
  isPaid: boolean
  scheduledAt?: string
  startedAt?: string
  endedAt?: string
  duration: number
  rejectionReason?: string
  chiefDoctorId?: string
  chiefDoctorName?: string
  createdAt: string
  updatedAt: string
  attachments?: ConsultationAttachment[]
}

export interface ConsultationListParams {
  page?: number
  pageSize?: number
  status?: ConsultationStatus
  consultationType?: ConsultationType
  urgencyLevel?: UrgencyLevel
  keyword?: string
  department?: string
  startDate?: string
  endDate?: string
}

export interface ConsultationListResponse {
  list: Consultation[]
  total: number
  page: number
  pageSize: number
}

export interface CreateConsultationParams {
  department: string
  consultationType: ConsultationType
  targetDoctorIds?: string[]
  targetDoctorNames?: string[]
  targetDepartments?: string[]
  consultationPurpose?: string
  conditionSummary?: string
  urgencyLevel: UrgencyLevel
  patientId?: string
  patientName?: string
  scheduledAt?: string
}

export interface RejectConsultationParams {
  rejectionReason: string
}

export interface ConsultationTimelineItem {
  time: string
  action: string
  operator: string
  description?: string
}

export interface Patient {
  id: string
  name: string
  gender: 'male' | 'female'
  age: number
  phone: string
  idCard: string
  address?: string
  medicalHistory?: string
  createdAt: string
}

export interface Doctor {
  id: string
  userId: string
  realName: string
  gender?: string
  age?: number
  phoneNumber?: string
  avatarUrl?: string
  department: string
  professionalTitle: string
  hospitalName?: string
  specialties?: string
  bio?: string
  licenseNumber?: string
  licenseVerified: boolean
  consultationFee: number
  rating: number
  consultationCount: number
  createdAt: string
  updatedAt: string
}

export interface DoctorListParams {
  page?: number
  pageSize?: number
  department?: string
  professionalTitle?: string
  keyword?: string
}

export interface DoctorListResponse {
  list: Doctor[]
  total: number
  page: number
  pageSize: number
}

export interface Department {
  id: string
  deptName: string
  deptCode: string
  description?: string
  parentId?: string
  sortOrder: number
  status: boolean
  createdAt: string
  updatedAt: string
}

export type ScheduleDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type TimeSlot = 'morning' | 'afternoon' | 'evening'

export interface ScheduleSlot {
  available: boolean
  slots: number
  startTime?: string
  endTime?: string
}

export interface DaySchedule {
  day: ScheduleDay
  date?: string
  morning: ScheduleSlot
  afternoon: ScheduleSlot
  evening: ScheduleSlot
  isLeave?: boolean
  leaveType?: string
  isTemporary?: boolean
}

export interface WeeklyScheduleResponse {
  doctorId: string
  weekStart: string
  weekEnd: string
  schedule: DaySchedule[]
}

export interface UpdateWeeklyScheduleDto {
  monday?: {
    morning?: ScheduleSlot
    afternoon?: ScheduleSlot
    evening?: ScheduleSlot
  }
  tuesday?: {
    morning?: ScheduleSlot
    afternoon?: ScheduleSlot
    evening?: ScheduleSlot
  }
  wednesday?: {
    morning?: ScheduleSlot
    afternoon?: ScheduleSlot
    evening?: ScheduleSlot
  }
  thursday?: {
    morning?: ScheduleSlot
    afternoon?: ScheduleSlot
    evening?: ScheduleSlot
  }
  friday?: {
    morning?: ScheduleSlot
    afternoon?: ScheduleSlot
    evening?: ScheduleSlot
  }
  saturday?: {
    morning?: ScheduleSlot
    afternoon?: ScheduleSlot
    evening?: ScheduleSlot
  }
  sunday?: {
    morning?: ScheduleSlot
    afternoon?: ScheduleSlot
    evening?: ScheduleSlot
  }
}

export interface TemporaryScheduleDto {
  date: string
  morning?: ScheduleSlot
  afternoon?: ScheduleSlot
  evening?: ScheduleSlot
}

export interface LeaveApplicationDto {
  startDate: string
  endDate: string
  leaveType: string
  reason?: string
}

export interface ScheduleConflictResult {
  hasConflict: boolean
  message?: string
  conflictingDoctors?: string[]
}

export interface SpecialtiesResponse {
  diseaseTags: string[]
  surgeryTypes: string[]
  treatmentAreas: string[]
}

export interface UpdateSpecialtiesDto {
  diseaseTags?: string[]
  surgeryTypes?: string[]
  treatmentAreas?: string[]
}

export type CertificationType = 'practice' | 'professional_title' | 'specialty'

export interface DoctorCertification {
  id: string
  doctorId: string
  certType: CertificationType
  certNumber: string
  certName: string
  certFileUrl?: string
  issueDate?: string
  expiryDate?: string
  issuingAuthority?: string
  status: string
  verifiedAt?: string
  verifiedBy?: string
  remark?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCertificationDto {
  certType: CertificationType
  certNumber: string
  certName: string
  certFileUrl?: string
  issueDate?: string
  expiryDate?: string
  issuingAuthority?: string
  remark?: string
}

export interface UpdateCertificationDto {
  certNumber?: string
  certName?: string
  certFileUrl?: string
  issueDate?: string
  expiryDate?: string
  issuingAuthority?: string
  remark?: string
  status?: string
}

export interface ExpiryReminderItem {
  doctorId: string
  doctorName: string
  department: string
  certId: string
  certType: CertificationType
  certName: string
  expiryDate: string
  daysRemaining: number
}

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  department: string
  diagnosis: string
  symptoms?: string
  treatment?: string
  medicines?: string[]
  chiefComplaint?: string
  presentIllness?: string
  pastHistory?: string
  personalHistory?: string
  familyHistory?: string
  treatmentPlan?: string
  visitDate?: string
  createdAt: string
  updatedAt?: string
}

export interface PatientDetail extends Patient {
  emergencyContact?: string
  emergencyPhone?: string
  bloodType?: 'A' | 'B' | 'AB' | 'O'
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  occupation?: string
  updatedAt?: string
}

export interface PatientListParams {
  page?: number
  pageSize?: number
  keyword?: string
  name?: string
  phone?: string
  gender?: string
}

export interface PatientListResponse {
  list: Patient[]
  total: number
  page: number
  pageSize: number
}

export interface MedicalRecordListParams {
  patientId?: string
  page?: number
  pageSize?: number
  keyword?: string
}

export interface MedicalRecordListResponse {
  list: MedicalRecord[]
  total: number
  page: number
  pageSize: number
}

export interface ExaminationReport {
  id: string
  patientId: string
  patientName: string
  reportName: string
  reportType: string
  fileUrl: string
  fileName: string
  fileSize?: number
  fileType: 'pdf' | 'image'
  uploaderId: string
  uploaderName: string
  examinationDate?: string
  department?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface ExaminationReportListParams {
  patientId?: string
  page?: number
  pageSize?: number
  reportType?: string
  keyword?: string
}

export interface ExaminationReportListResponse {
  list: ExaminationReport[]
  total: number
  page: number
  pageSize: number
}

export interface Allergy {
  id: string
  patientId: string
  patientName: string
  allergen: string
  allergyType: 'drug' | 'food' | 'other'
  severity: 'mild' | 'moderate' | 'severe'
  reaction: string
  onsetDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AllergyListParams {
  patientId?: string
  allergyType?: string
  keyword?: string
  page?: number
  pageSize?: number
}

export interface AllergyListResponse {
  list: Allergy[]
  total: number
  page: number
  pageSize: number
}

export enum NotificationType {
  CONSULTATION_REQUEST = 'consultation_request',
  CONSULTATION_ACCEPTED = 'consultation_accepted',
  CONSULTATION_REJECTED = 'consultation_rejected',
  CONSULTATION_COMPLETED = 'consultation_completed',
  CONSULTATION_CANCELLED = 'consultation_cancelled',
  MESSAGE_RECEIVED = 'message_received',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  SYSTEM_NOTIFICATION = 'system_notification'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  DELETED = 'deleted'
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  content?: string
  relatedId?: string
  relatedType?: string
  senderId?: string
  senderName?: string
  isRead: boolean
  readAt?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationListParams {
  page?: number
  pageSize?: number
  type?: NotificationType
  isRead?: boolean
}

export interface NotificationListResponse {
  list: Notification[]
  total: number
  page: number
  pageSize: number
  unreadCount: number
}

export interface UnreadCountByType {
  total: number
  [key: string]: number
}

export enum AnnouncementStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OFFLINE = 'offline'
}

export interface Announcement {
  id: string
  title: string
  content: string
  authorId?: string
  authorName?: string
  status: AnnouncementStatus
  isPinned: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface AnnouncementListParams {
  page?: number
  pageSize?: number
  status?: AnnouncementStatus
}

export interface AnnouncementListResponse {
  list: Announcement[]
  total: number
  page: number
  pageSize: number
}

export interface CreateAnnouncementParams {
  title: string
  content: string
  status?: AnnouncementStatus
  isPinned?: boolean
  sortOrder?: number
}

export interface UpdateAnnouncementParams {
  title?: string
  content?: string
  status?: AnnouncementStatus
  isPinned?: boolean
  sortOrder?: number
}
