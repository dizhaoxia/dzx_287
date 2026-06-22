import { get, post, put, del } from '@/utils/request'
import type {
  Announcement,
  AnnouncementListParams,
  AnnouncementListResponse,
  CreateAnnouncementParams,
  UpdateAnnouncementParams
} from '@/types'

export function getAnnouncements(params?: { page?: number; pageSize?: number }) {
  return get<AnnouncementListResponse>('/announcements', { params })
}

export function getAnnouncementDetail(id: string) {
  return get<Announcement>(`/announcements/${id}`)
}

export function getAnnouncementList(params: AnnouncementListParams) {
  return get<AnnouncementListResponse>('/admin/announcements', { params })
}

export function createAnnouncement(data: CreateAnnouncementParams) {
  return post<Announcement>('/admin/announcements', data)
}

export function updateAnnouncement(id: string, data: UpdateAnnouncementParams) {
  return put<Announcement>(`/admin/announcements/${id}`, data)
}

export function deleteAnnouncement(id: string) {
  return del(`/admin/announcements/${id}`)
}

export function toggleAnnouncementPinned(id: string) {
  return put<Announcement>(`/admin/announcements/${id}/pin`)
}
