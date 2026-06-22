import { get, post, put, del } from '@/utils/request'
import type {
  ApiResponse,
  Patient,
  PatientDetail,
  PatientListParams,
  PatientListResponse,
  MedicalRecord,
  MedicalRecordListParams,
  MedicalRecordListResponse,
  ExaminationReport,
  ExaminationReportListParams,
  ExaminationReportListResponse,
  Allergy,
  AllergyListParams,
  AllergyListResponse
} from '@/types'

export function getPatientList(params: PatientListParams) {
  return get<ApiResponse<PatientListResponse>>('/patients', { params })
}

export function getPatientDetail(id: string) {
  return get<ApiResponse<PatientDetail>>(`/patients/${id}`)
}

export function createPatient(data: Partial<PatientDetail>) {
  return post<ApiResponse<PatientDetail>>('/patients', data)
}

export function updatePatient(id: string, data: Partial<PatientDetail>) {
  return put<ApiResponse<PatientDetail>>(`/patients/${id}`, data)
}

export function deletePatient(id: string) {
  return del<ApiResponse<void>>(`/patients/${id}`)
}

export function getMedicalRecordList(params: MedicalRecordListParams) {
  return get<ApiResponse<MedicalRecordListResponse>>('/medical-records', { params })
}

export function getMedicalRecordDetail(id: string) {
  return get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`)
}

export function createMedicalRecord(data: Partial<MedicalRecord>) {
  return post<ApiResponse<MedicalRecord>>('/medical-records', data)
}

export function updateMedicalRecord(id: string, data: Partial<MedicalRecord>) {
  return put<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, data)
}

export function deleteMedicalRecord(id: string) {
  return del<ApiResponse<void>>(`/medical-records/${id}`)
}

export function getExaminationReportList(params: ExaminationReportListParams) {
  return get<ApiResponse<ExaminationReportListResponse>>('/examination-reports', { params })
}

export function getExaminationReportDetail(id: string) {
  return get<ApiResponse<ExaminationReport>>(`/examination-reports/${id}`)
}

export function uploadExaminationReport(data: FormData) {
  return post<ApiResponse<ExaminationReport>>('/examination-reports/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function deleteExaminationReport(id: string) {
  return del<ApiResponse<void>>(`/examination-reports/${id}`)
}

export function getAllergyList(params: AllergyListParams) {
  return get<ApiResponse<AllergyListResponse>>('/allergies', { params })
}

export function getAllergyDetail(id: string) {
  return get<ApiResponse<Allergy>>(`/allergies/${id}`)
}

export function createAllergy(data: Partial<Allergy>) {
  return post<ApiResponse<Allergy>>('/allergies', data)
}

export function updateAllergy(id: string, data: Partial<Allergy>) {
  return put<ApiResponse<Allergy>>(`/allergies/${id}`, data)
}

export function deleteAllergy(id: string) {
  return del<ApiResponse<void>>(`/allergies/${id}`)
}
