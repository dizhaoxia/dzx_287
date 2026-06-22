import { get, post, put, del } from '@/utils/request'
import type {
  Consultation,
  ConsultationListParams,
  ConsultationListResponse,
  CreateConsultationParams,
  RejectConsultationParams,
  ConsultationAttachment,
  ConsultationTimelineItem
} from '@/types'

export function getConsultationList(params: ConsultationListParams) {
  return get<ConsultationListResponse>('/consultations', { params })
}

export function getConsultationDetail(id: string) {
  return get<Consultation>(`/consultations/${id}`)
}

export function createConsultation(data: CreateConsultationParams) {
  return post<Consultation>('/consultations', data)
}

export function acceptConsultation(id: string) {
  return put<Consultation>(`/consultations/${id}/accept`)
}

export function rejectConsultation(id: string, data: RejectConsultationParams) {
  return put<Consultation>(`/consultations/${id}/reject`, data)
}

export function startConsultation(id: string) {
  return put<Consultation>(`/consultations/${id}/start`)
}

export function completeConsultation(id: string, data?: any) {
  return put<Consultation>(`/consultations/${id}/complete`, data)
}

export function cancelConsultation(id: string) {
  return put<Consultation>(`/consultations/${id}/cancel`)
}

export function generateApplicationNo() {
  return get<{ applicationNo: string }>('/consultations/application-no/generate')
}

export function getConsultationAttachments(id: string) {
  return get<ConsultationAttachment[]>(`/consultations/${id}/attachments`)
}

export function addConsultationAttachment(id: string, data: any) {
  return post<ConsultationAttachment>(`/consultations/${id}/attachments`, data)
}

export function deleteConsultationAttachment(id: string, attachmentId: string) {
  return del(`/consultations/${id}/attachments/${attachmentId}`)
}

export function getConsultationTimeline(id: string) {
  return get<ConsultationTimelineItem[]>(`/consultations/${id}/timeline`)
}
