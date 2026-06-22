import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUnreadCount, getUnreadCountByType } from '@/api/notification'
import type { UnreadCountByType } from '@/types'

export const useMessageStore = defineStore('message', () => {
  const unreadCount = ref<number>(0)
  const unreadCountByType = ref<UnreadCountByType>({ total: 0 })
  const loading = ref<boolean>(false)

  const totalUnread = computed(() => unreadCount.value)

  async function fetchUnreadCount() {
    try {
      loading.value = true
      const res: any = await getUnreadCount()
      if (res.code === 0 || res.code === 200) {
        unreadCount.value = res.data.count
      }
    } catch (error) {
      console.error('获取未读消息数量失败:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadCountByType() {
    try {
      loading.value = true
      const res: any = await getUnreadCountByType()
      if (res.code === 0 || res.code === 200) {
        unreadCountByType.value = res.data
        unreadCount.value = res.data.total || 0
      }
    } catch (error) {
      console.error('获取分类未读消息数量失败:', error)
    } finally {
      loading.value = false
    }
  }

  function incrementUnread() {
    unreadCount.value++
  }

  function decrementUnread() {
    if (unreadCount.value > 0) {
      unreadCount.value--
    }
  }

  function resetUnread() {
    unreadCount.value = 0
  }

  return {
    unreadCount,
    unreadCountByType,
    loading,
    totalUnread,
    fetchUnreadCount,
    fetchUnreadCountByType,
    incrementUnread,
    decrementUnread,
    resetUnread
  }
})
