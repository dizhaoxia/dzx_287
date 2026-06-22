<template>
  <div class="message-center">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="category-card" shadow="never">
          <div class="category-header">
            <span class="category-title">消息分类</span>
          </div>
          <el-menu
            :default-active="activeCategory"
            class="category-menu"
            @select="handleCategoryChange"
          >
            <el-menu-item v-for="item in categories" :key="item.key" :index="item.key">
              <el-icon class="menu-icon"><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
              <el-badge
                v-if="getUnreadCount(item.key) > 0"
                :value="getUnreadCount(item.key)"
                class="menu-badge"
                :max="99"
              />
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <el-col :span="19">
        <el-card class="message-card" shadow="never">
          <div class="message-header">
            <div class="header-left">
              <h3 class="list-title">{{ currentCategoryLabel }}</h3>
              <span class="message-count">共 {{ total }} 条消息</span>
            </div>
            <div class="header-right">
              <el-button type="primary" link @click="handleMarkAllRead">
                <el-icon><Check /></el-icon>
                全部标记为已读
              </el-button>
            </div>
          </div>

          <div class="message-list" v-loading="loading">
            <el-empty v-if="list.length === 0 && !loading" description="暂无消息" />

            <div
              v-for="item in list"
              :key="item.id"
              class="message-item"
              :class="{ unread: !item.isRead }"
              @click="handleViewDetail(item)"
            >
              <div class="message-avatar">
                <el-avatar :size="40" :icon="getMessageIcon(item.type)" />
              </div>
              <div class="message-content">
                <div class="message-title-row">
                  <span class="message-title" :class="{ 'font-bold': !item.isRead }">
                    {{ item.title }}
                  </span>
                  <span class="message-time">{{ formatTime(item.createdAt) }}</span>
                </div>
                <div class="message-desc">{{ item.content }}</div>
              </div>
              <div class="message-actions">
                <el-button
                  v-if="!item.isRead"
                  type="primary"
                  text
                  size="small"
                  @click.stop="handleMarkRead(item)"
                >
                  标为已读
                </el-button>
                <el-button
                  type="danger"
                  text
                  size="small"
                  @click.stop="handleDelete(item)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>

          <div class="pagination-wrapper" v-if="total > 0">
            <el-pagination
              v-model:current-page="page"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="detailVisible"
      :title="currentNotification?.title"
      width="600px"
      destroy-on-close
    >
      <div v-if="currentNotification" class="notification-detail">
        <div class="detail-header">
          <div class="detail-meta">
            <span class="detail-type">
              {{ getTypeLabel(currentNotification.type) }}
            </span>
            <span class="detail-time">
              {{ formatTime(currentNotification.createdAt) }}
            </span>
          </div>
          <el-tag
            v-if="currentNotification.isRead"
            type="info"
            size="small"
          >
            已读
          </el-tag>
          <el-tag v-else type="warning" size="small">未读</el-tag>
        </div>

        <div class="detail-content">
          <p>{{ currentNotification.content }}</p>
        </div>

        <div v-if="currentNotification.senderName" class="detail-sender">
          <span>发送人：{{ currentNotification.senderName }}</span>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          v-if="currentNotification?.relatedId && currentNotification?.relatedType === 'consultation'"
          type="primary"
          @click="handleGoToConsultation"
        >
          查看会诊详情
        </el-button>
        <el-button
          v-if="currentNotification && !currentNotification.isRead"
          type="primary"
          @click="handleMarkReadFromDetail"
        >
          标记已读
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Bell,
  ChatDotRound,
  Warning,
  DataLine,
  Check,
  Delete
} from '@element-plus/icons-vue'
import {
  getNotificationList,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '@/api/notification'
import { useMessageStore } from '@/stores'
import type { Notification, NotificationType } from '@/types'

const router = useRouter()
const messageStore = useMessageStore()

const loading = ref(false)
const list = ref<Notification[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const activeCategory = ref('all')
const detailVisible = ref(false)
const currentNotification = ref<Notification | null>(null)

const categories = [
  { key: 'all', label: '全部消息', icon: Bell },
  { key: 'consultation', label: '会诊通知', icon: ChatDotRound },
  { key: 'system_announcement', label: '系统公告', icon: Warning },
  { key: 'system', label: '系统消息', icon: DataLine }
]

const currentCategoryLabel = computed(() => {
  const item = categories.find(c => c.key === activeCategory.value)
  return item?.label || '全部消息'
})

function getUnreadCount(key: string): number {
  if (key === 'all') {
    return messageStore.unreadCount
  }
  if (key === 'consultation') {
    return (
      (messageStore.unreadCountByType['consultation_request'] || 0) +
      (messageStore.unreadCountByType['consultation_accepted'] || 0) +
      (messageStore.unreadCountByType['consultation_rejected'] || 0) +
      (messageStore.unreadCountByType['consultation_completed'] || 0) +
      (messageStore.unreadCountByType['consultation_cancelled'] || 0) +
      (messageStore.unreadCountByType['message_received'] || 0)
    )
  }
  if (key === 'system_announcement') {
    return messageStore.unreadCountByType['system_announcement'] || 0
  }
  if (key === 'system') {
    return messageStore.unreadCountByType['system_notification'] || 0
  }
  return 0
}

function getMessageIcon(type: NotificationType) {
  if (type.startsWith('consultation') || type === 'message_received') {
    return ChatDotRound
  }
  if (type === 'system_announcement') {
    return Warning
  }
  return Bell
}

function getTypeLabel(type: NotificationType): string {
  const labels: Record<string, string> = {
    consultation_request: '会诊申请',
    consultation_accepted: '会诊接受',
    consultation_rejected: '会诊拒绝',
    consultation_completed: '会诊完成',
    consultation_cancelled: '会诊取消',
    message_received: '新消息',
    system_announcement: '系统公告',
    system_notification: '系统通知'
  }
  return labels[type] || '通知'
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function getTypeFilter(): NotificationType | undefined {
  if (activeCategory.value === 'all') return undefined
  if (activeCategory.value === 'consultation') return undefined
  if (activeCategory.value === 'system_announcement') return 'system_announcement' as NotificationType
  if (activeCategory.value === 'system') return 'system_notification' as NotificationType
  return undefined
}

async function fetchList() {
  try {
    loading.value = true
    const params: any = {
      page: page.value,
      pageSize: pageSize.value
    }

    if (activeCategory.value === 'consultation') {
      // 会诊通知包括多种类型，这里简化处理，前端过滤
    } else if (getTypeFilter()) {
      params.type = getTypeFilter()
    }

    const res: any = await getNotificationList(params)
    if (res.code === 0 || res.code === 200) {
      let data = res.data.list || []
      
      if (activeCategory.value === 'consultation') {
        data = data.filter((item: Notification) => 
          item.type.startsWith('consultation') || item.type === 'message_received'
        )
      } else if (activeCategory.value === 'system') {
        data = data.filter((item: Notification) => 
          item.type === 'system_notification'
        )
      }
      
      list.value = data
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取消息列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleCategoryChange(key: string) {
  activeCategory.value = key
  page.value = 1
  fetchList()
}

function handlePageChange(p: number) {
  page.value = p
  fetchList()
}

function handleSizeChange(size: number) {
  pageSize.value = size
  page.value = 1
  fetchList()
}

async function handleViewDetail(item: Notification) {
  currentNotification.value = item
  detailVisible.value = true
  
  if (!item.isRead) {
    try {
      await markNotificationAsRead(item.id)
      item.isRead = true
      messageStore.decrementUnread()
      messageStore.fetchUnreadCountByType()
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }
}

async function handleMarkRead(item: Notification) {
  try {
    await markNotificationAsRead(item.id)
    item.isRead = true
    messageStore.decrementUnread()
    messageStore.fetchUnreadCountByType()
    ElMessage.success('已标记为已读')
  } catch (error) {
    console.error('标记已读失败:', error)
  }
}

async function handleMarkAllRead() {
  try {
    await ElMessageBox.confirm('确定要将全部消息标记为已读吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    let type: NotificationType | undefined
    if (activeCategory.value === 'system_announcement') {
      type = 'system_announcement' as NotificationType
    } else if (activeCategory.value === 'system') {
      type = 'system_notification' as NotificationType
    }
    
    const res: any = await markAllNotificationsAsRead(type)
    if (res.code === 0 || res.code === 200) {
      list.value.forEach(item => {
        item.isRead = true
      })
      messageStore.resetUnread()
      messageStore.fetchUnreadCountByType()
      ElMessage.success(`已将 ${res.data.count} 条消息标记为已读`)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('全部标记已读失败:', error)
    }
  }
}

async function handleDelete(item: Notification) {
  try {
    await ElMessageBox.confirm('确定要删除这条消息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteNotification(item.id)
    const index = list.value.findIndex(i => i.id === item.id)
    if (index > -1) {
      list.value.splice(index, 1)
      total.value--
    }
    
    if (!item.isRead) {
      messageStore.decrementUnread()
      messageStore.fetchUnreadCountByType()
    }
    
    ElMessage.success('删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

function handleGoToConsultation() {
  if (currentNotification.value?.relatedId) {
    router.push(`/consultation/${currentNotification.value.relatedId}`)
    detailVisible.value = false
  }
}

async function handleMarkReadFromDetail() {
  if (currentNotification.value) {
    await handleMarkRead(currentNotification.value)
  }
}

onMounted(() => {
  fetchList()
  messageStore.fetchUnreadCountByType()
})
</script>

<style scoped lang="scss">
.message-center {
  .category-card {
    border-radius: 8px;

    .category-header {
      padding: 16px 0;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 12px;

      .category-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .category-menu {
      border-right: none;

      .menu-icon {
        margin-right: 10px;
      }

      .menu-badge {
        margin-left: auto;
      }
    }
  }

  .message-card {
    border-radius: 8px;
    min-height: 600px;

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 16px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .list-title {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          margin: 0;
        }

        .message-count {
          font-size: 14px;
          color: #909399;
        }
      }
    }

    .message-list {
      min-height: 400px;

      .message-item {
        display: flex;
        align-items: flex-start;
        padding: 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-bottom: 8px;
        border: 1px solid #f0f0f0;

        &:hover {
          background-color: #f5f7fa;
        }

        &.unread {
          background-color: #ecf5ff;
          border-color: #d9ecff;

          &:hover {
            background-color: #d9ecff;
          }
        }

        .message-avatar {
          margin-right: 16px;
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
          min-width: 0;

          .message-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .message-title {
              font-size: 15px;
              color: #303133;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              &.font-bold {
                font-weight: 600;
              }
            }

            .message-time {
              font-size: 12px;
              color: #909399;
              flex-shrink: 0;
              margin-left: 16px;
            }
          }

          .message-desc {
            font-size: 14px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.5;
          }
        }

        .message-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-left: 16px;
          flex-shrink: 0;
        }
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;
    }
  }
}

.notification-detail {
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 20px;

    .detail-meta {
      display: flex;
      align-items: center;
      gap: 12px;

      .detail-type {
        display: inline-block;
        padding: 4px 12px;
        background-color: #ecf5ff;
        color: #409eff;
        border-radius: 4px;
        font-size: 13px;
      }

      .detail-time {
        font-size: 13px;
        color: #909399;
      }
    }
  }

  .detail-content {
    font-size: 15px;
    line-height: 1.8;
    color: #303133;
    margin-bottom: 20px;

    p {
      margin: 0;
    }
  }

  .detail-sender {
    font-size: 13px;
    color: #909399;
    padding-top: 16px;
    border-top: 1px dashed #ebeef5;
  }
}
</style>
