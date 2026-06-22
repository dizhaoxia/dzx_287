<template>
  <el-container class="layout-container">
    <el-aside width="240px" class="sidebar">
      <div class="logo">
        <el-icon :size="32"><Monitor /></el-icon>
        <span class="title">远程会诊系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409eff"
        class="menu"
      >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="page-title">{{ currentPageTitle }}</span>
        </div>
        <div class="header-right">
          <el-popover
            placement="bottom-end"
            :width="360"
            trigger="click"
            popper-class="notification-popover"
            @show="handlePopoverShow"
          >
            <template #reference>
              <div class="notification-trigger">
                <el-badge :value="messageStore.unreadCount" :max="99" :hidden="messageStore.unreadCount === 0" class="notification-badge">
                  <el-icon :size="22" class="notification-icon"><Bell /></el-icon>
                </el-badge>
              </div>
            </template>

            <div class="notification-dropdown">
              <div class="dropdown-header">
                <span class="dropdown-title">消息通知</span>
                <span class="dropdown-count">未读 {{ messageStore.unreadCount }} 条</span>
                <el-button type="primary" link size="small" @click="handleMarkAllRead">
                  全部已读
                </el-button>
              </div>

              <div class="dropdown-content" v-loading="notificationLoading">
                <el-empty v-if="recentNotifications.length === 0 && !notificationLoading" description="暂无消息" :image-size="60" />

                <div
                  v-for="item in recentNotifications"
                  :key="item.id"
                  class="notification-item"
                  :class="{ unread: !item.isRead }"
                  @click="handleNotificationClick(item)"
                >
                  <div class="notification-avatar">
                    <el-avatar :size="36" :icon="getMessageIcon(item.type)" />
                  </div>
                  <div class="notification-info">
                    <div class="notification-title">
                      {{ item.title }}
                      <el-tag v-if="!item.isRead" type="danger" size="small" round class="unread-tag">新</el-tag>
                    </div>
                    <div class="notification-desc">{{ item.content }}</div>
                    <div class="notification-time">{{ formatTime(item.createdAt) }}</div>
                  </div>
                </div>
              </div>

              <div class="dropdown-footer">
                <el-button type="primary" text @click="goToMessageCenter">
                  查看全部消息
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </el-popover>

          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">{{ userStore.userInfo?.name || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="messages">
                  <el-icon><Bell /></el-icon>消息中心
                </el-dropdown-item>
                <el-dropdown-item command="announcements">
                  <el-icon><Warning /></el-icon>系统公告
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Bell,
  Monitor,
  ArrowDown,
  User,
  SwitchButton,
  Warning,
  ArrowRight,
  ChatDotRound,
  HomeFilled,
  Avatar,
  Document,
  DataAnalysis,
  Calendar
} from '@element-plus/icons-vue'
import { useUserStore, useMessageStore } from '@/stores'
import { getNotificationList, markNotificationAsRead, markAllNotificationsAsRead } from '@/api/notification'
import type { Notification, NotificationType } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const messageStore = useMessageStore()

const notificationLoading = ref(false)
const recentNotifications = ref<Notification[]>([])
let timer: number | null = null

const menuItems = [
  { path: '/dashboard', title: '首页', icon: HomeFilled },
  { path: '/consultation', title: '会诊管理', icon: ChatDotRound },
  { path: '/patients', title: '患者管理', icon: User },
  { path: '/medical-records', title: '病历管理', icon: Document },
  { path: '/examination-reports', title: '检查报告', icon: DataAnalysis },
  { path: '/allergies', title: '过敏史管理', icon: Warning },
  { path: '/doctors', title: '医生管理', icon: Avatar },
  { path: '/messages', title: '消息中心', icon: Bell },
  { path: '/announcements', title: '系统公告', icon: Calendar }
]

const activeMenu = computed(() => route.path)
const currentPageTitle = computed(() => {
  const item = menuItems.find(m => m.path === route.path)
  return item?.title || '远程会诊系统'
})

function getMessageIcon(type: NotificationType) {
  if (type.startsWith('consultation') || type === 'message_received') {
    return ChatDotRound
  }
  if (type === 'system_announcement') {
    return Warning
  }
  return Bell
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
    month: '2-digit',
    day: '2-digit'
  })
}

async function fetchRecentNotifications() {
  try {
    notificationLoading.value = true
    const res: any = await getNotificationList({
      page: 1,
      pageSize: 5
    })
    if (res.code === 0 || res.code === 200) {
      recentNotifications.value = res.data.list || []
    }
  } catch (error) {
    console.error('获取消息列表失败:', error)
  } finally {
    notificationLoading.value = false
  }
}

function handlePopoverShow() {
  fetchRecentNotifications()
}

async function handleNotificationClick(item: Notification) {
  if (!item.isRead) {
    try {
      await markNotificationAsRead(item.id)
      item.isRead = true
      messageStore.decrementUnread()
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }

  if (item.relatedId && item.relatedType === 'consultation') {
    router.push(`/consultation/${item.relatedId}`)
  } else if (item.type === 'system_announcement') {
    router.push('/announcements')
  } else {
    router.push('/messages')
  }
}

async function handleMarkAllRead() {
  try {
    await ElMessageBox.confirm('确定要将全部消息标记为已读吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })

    const res: any = await markAllNotificationsAsRead()
    if (res.code === 0 || res.code === 200) {
      recentNotifications.value.forEach(item => {
        item.isRead = true
      })
      messageStore.resetUnread()
      ElMessage.success('已全部标记为已读')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('全部标记已读失败:', error)
    }
  }
}

function goToMessageCenter() {
  router.push('/messages')
}

function handleCommand(command: string) {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    }).catch(() => {})
  } else if (command === 'profile') {
    ElMessage.info('个人中心功能开发中')
  } else if (command === 'messages') {
    router.push('/messages')
  } else if (command === 'announcements') {
    router.push('/announcements')
  }
}

function startPolling() {
  timer = window.setInterval(() => {
    messageStore.fetchUnreadCount()
  }, 30000)
}

function stopPolling() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  messageStore.fetchUnreadCount()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  width: 100%;
}

.sidebar {
  background-color: #001529;
  display: flex;
  flex-direction: column;

  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #fff;
    border-bottom: 1px solid #1f3a57;

    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .menu {
    flex: 1;
    border-right: none;
  }
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  .header-left {
    .page-title {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;

    .notification-trigger {
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f7fa;
      }
    }

    .notification-icon {
      color: #606266;

      &:hover {
        color: #409eff;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      .username {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss">
.notification-popover {
  padding: 0 !important;
  border-radius: 8px !important;
  overflow: hidden;

  .notification-dropdown {
    .dropdown-header {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      border-bottom: 1px solid #ebeef5;
      background-color: #fafafa;

      .dropdown-title {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
        flex: 1;
      }

      .dropdown-count {
        font-size: 12px;
        color: #909399;
        margin-right: 12px;
      }
    }

    .dropdown-content {
      max-height: 360px;
      overflow-y: auto;

      .notification-item {
        display: flex;
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: #f5f7fa;
        }

        &.unread {
          background-color: #ecf5ff;

          &:hover {
            background-color: #d9ecff;
          }
        }

        .notification-avatar {
          margin-right: 12px;
          flex-shrink: 0;
        }

        .notification-info {
          flex: 1;
          min-width: 0;

          .notification-title {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;

            .unread-tag {
              height: 16px;
              line-height: 14px;
              padding: 0 6px;
              font-size: 10px;
            }
          }

          .notification-desc {
            font-size: 13px;
            color: #606266;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .notification-time {
            font-size: 12px;
            color: #c0c4cc;
          }
        }
      }
    }

    .dropdown-footer {
      padding: 10px 16px;
      border-top: 1px solid #ebeef5;
      text-align: center;
      background-color: #fafafa;
    }
  }
}
</style>
