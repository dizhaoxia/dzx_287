import { get, put, del } from '@/utils/request'
import type {
  Notification,
  NotificationListParams,
  NotificationListResponse,
  UnreadCountByType,
  NotificationType
} from '@/types'

export function getNotificationList(params: NotificationListParams) {
  return get<NotificationListResponse>('/notifications', { params })
}

export function getNotificationDetail(id: string) {
  return get<Notification>(`/notifications/${id}`)
}

export function getUnreadCount() {
  return get<{ count: number }>('/notifications/unread-count')
}

export function getUnreadCountByType() {
  return get<UnreadCountByType>('/notifications/unread-count-by-type')
}

export function markNotificationAsRead(id: string) {
  return put<Notification>(`/notifications/${id}/read`)
}

export function markAllNotificationsAsRead(type?: NotificationType) {
  return put<{ count: number }>('/notifications/read-all', { type })
}

export function deleteNotification(id: string) {
  return del(`/notifications/${id}`)
}
