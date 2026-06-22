<template>
  <div class="announcements-page">
    <el-card class="page-card" shadow="never">
      <div class="page-header">
        <div class="header-left">
          <h2 class="page-title">系统公告</h2>
          <p class="page-desc">了解系统最新动态和重要通知</p>
        </div>
        <div class="header-right" v-if="isAdmin">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            发布公告
          </el-button>
        </div>
      </div>

      <div class="announcement-list" v-loading="loading">
        <el-empty v-if="list.length === 0 && !loading" description="暂无公告" />

        <div
          v-for="item in list"
          :key="item.id"
          class="announcement-item"
          :class="{ pinned: item.isPinned }"
          @click="handleViewDetail(item)"
        >
          <div class="announcement-icon">
            <el-icon :size="24" :class="item.isPinned ? 'pinned-icon' : ''">
              <component :is="item.isPinned ? Star : Warning" />
            </el-icon>
          </div>
          <div class="announcement-content">
            <div class="announcement-title-row">
              <h3 class="announcement-title">
                <el-tag
                  v-if="item.isPinned"
                  type="danger"
                  size="small"
                  class="pinned-tag"
                >
                  置顶
                </el-tag>
                {{ item.title }}
              </h3>
              <span class="announcement-date">{{ formatDate(item.createdAt) }}</span>
            </div>
            <p class="announcement-summary">{{ item.content }}</p>
            <div class="announcement-meta">
              <span class="author">发布人：{{ item.authorName || '系统管理员' }}</span>
            </div>
          </div>
          <div class="announcement-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div class="pagination-wrapper" v-if="total > 0">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="total"
          layout="total, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="detailVisible"
      :title="currentAnnouncement?.title"
      width="700px"
      destroy-on-close
      class="announcement-detail-dialog"
    >
      <div v-if="currentAnnouncement" class="announcement-detail">
        <div class="detail-header">
          <div class="detail-tags">
            <el-tag v-if="currentAnnouncement.isPinned" type="danger" size="small">
              置顶公告
            </el-tag>
            <el-tag type="info" size="small">
              公告
            </el-tag>
          </div>
          <div class="detail-info">
            <span class="detail-author">
              <el-icon><User /></el-icon>
              {{ currentAnnouncement.authorName || '系统管理员' }}
            </span>
            <span class="detail-time">
              <el-icon><Clock /></el-icon>
              {{ formatDateTime(currentAnnouncement.createdAt) }}
            </span>
          </div>
        </div>

        <div class="detail-content">
          <p>{{ currentAnnouncement.content }}</p>
        </div>

        <div class="detail-footer" v-if="isAdmin">
          <el-button type="primary" plain @click="handleEdit(currentAnnouncement)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button type="danger" plain @click="handleDelete(currentAnnouncement)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
          <el-button
            :type="currentAnnouncement.isPinned ? 'warning' : 'success'"
            plain
            @click="handleTogglePinned(currentAnnouncement)"
          >
            <el-icon><component :is="currentAnnouncement.isPinned ? 'StarFilled' : 'Star'" /></el-icon>
            {{ currentAnnouncement.isPinned ? '取消置顶' : '置顶' }}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="formVisible"
      :title="formMode === 'create' ? '发布公告' : '编辑公告'"
      width="600px"
      destroy-on-close
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入公告标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="8"
            placeholder="请输入公告内容"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已下线" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch v-model="formData.isPinned" />
        </el-form-item>
        <el-form-item label="排序" v-if="formData.isPinned">
          <el-input-number v-model="formData.sortOrder" :min="0" :max="999" />
          <span class="form-tip">数值越大排序越靠前</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  Star,
  Warning,
  ArrowRight,
  Plus,
  Edit,
  Delete,
  User,
  Clock,
  StarFilled
} from '@element-plus/icons-vue'
import {
  getAnnouncements,
  getAnnouncementDetail,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementPinned
} from '@/api/announcement'
import { useUserStore } from '@/stores'
import type { Announcement, AnnouncementStatus, CreateAnnouncementParams } from '@/types'

const userStore = useUserStore()

const loading = ref(false)
const submitLoading = ref(false)
const list = ref<Announcement[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const detailVisible = ref(false)
const currentAnnouncement = ref<Announcement | null>(null)
const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()

const isAdmin = computed(() => userStore.userInfo?.role === 'admin')

const formData = reactive<CreateAnnouncementParams>({
  title: '',
  content: '',
  status: 'published' as AnnouncementStatus,
  isPinned: false,
  sortOrder: 0
})

const formRules: FormRules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { max: 100, message: '标题不能超过100个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
    { max: 2000, message: '内容不能超过2000个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function fetchList() {
  try {
    loading.value = true
    const res: any = await getAnnouncements({
      page: page.value,
      pageSize: pageSize.value
    })
    if (res.code === 0 || res.code === 200) {
      list.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取公告列表失败:', error)
    ElMessage.error('获取公告列表失败')
  } finally {
    loading.value = false
  }
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

async function handleViewDetail(item: Announcement) {
  try {
    const res: any = await getAnnouncementDetail(item.id)
    if (res.code === 0 || res.code === 200) {
      currentAnnouncement.value = res.data
      detailVisible.value = true
    }
  } catch (error) {
    console.error('获取公告详情失败:', error)
  }
}

function handleCreate() {
  formMode.value = 'create'
  formVisible.value = true
}

function handleEdit(item: Announcement) {
  formMode.value = 'edit'
  formData.title = item.title
  formData.content = item.content
  formData.status = item.status
  formData.isPinned = item.isPinned
  formData.sortOrder = item.sortOrder
  formVisible.value = true
  detailVisible.value = false
}

function resetForm() {
  formData.title = ''
  formData.content = ''
  formData.status = 'published' as AnnouncementStatus
  formData.isPinned = false
  formData.sortOrder = 0
  formRef.value?.resetFields()
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitLoading.value = true

    if (formMode.value === 'create') {
      const res: any = await createAnnouncement(formData)
      if (res.code === 0 || res.code === 200) {
        ElMessage.success('发布成功')
        formVisible.value = false
        fetchList()
      }
    } else {
      const res: any = await updateAnnouncement(currentAnnouncement.value!.id, formData)
      if (res.code === 0 || res.code === 200) {
        ElMessage.success('更新成功')
        formVisible.value = false
        fetchList()
      }
    }
  } catch (error: any) {
    if (error !== false) {
      console.error('提交失败:', error)
      ElMessage.error('提交失败')
    }
  } finally {
    submitLoading.value = false
  }
}

async function handleDelete(item: Announcement) {
  try {
    await ElMessageBox.confirm('确定要删除这条公告吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteAnnouncement(item.id)
    ElMessage.success('删除成功')
    detailVisible.value = false
    fetchList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

async function handleTogglePinned(item: Announcement) {
  try {
    const res: any = await toggleAnnouncementPinned(item.id)
    if (res.code === 0 || res.code === 200) {
      currentAnnouncement.value = res.data
      ElMessage.success(res.data.isPinned ? '置顶成功' : '取消置顶成功')
      fetchList()
    }
  } catch (error) {
    console.error('操作失败:', error)
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.announcements-page {
  .page-card {
    border-radius: 8px;
    min-height: 600px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 24px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 24px;

    .page-title {
      font-size: 22px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
    }

    .page-desc {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  .announcement-list {
    min-height: 400px;

    .announcement-item {
      display: flex;
      align-items: center;
      padding: 24px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 16px;
      border: 1px solid #ebeef5;
      background-color: #fff;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      &.pinned {
        background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
        border-color: #f56c6c;
      }

      .announcement-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: #ecf5ff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        flex-shrink: 0;
        color: #409eff;

        & .pinned-icon {
          color: #f56c6c;
        }
      }

      .announcement-content {
        flex: 1;
        min-width: 0;

        .announcement-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .announcement-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .pinned-tag {
              margin-right: 8px;
            }
          }

          .announcement-date {
            font-size: 13px;
            color: #909399;
            flex-shrink: 0;
            margin-left: 20px;
          }
        }

        .announcement-summary {
          font-size: 14px;
          color: #606266;
          line-height: 1.6;
          margin: 0 0 12px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .announcement-meta {
          .author {
            font-size: 13px;
            color: #909399;
          }
        }
      }

      .announcement-arrow {
        color: #c0c4cc;
        margin-left: 20px;
        flex-shrink: 0;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding-top: 24px;
    border-top: 1px solid #ebeef5;
  }
}

.announcement-detail-dialog {
  :deep(.el-dialog__body) {
    padding-top: 0;
  }
}

.announcement-detail {
  .detail-header {
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 24px;

    .detail-tags {
      margin-bottom: 12px;

      .el-tag + .el-tag {
        margin-left: 8px;
      }
    }

    .detail-info {
      display: flex;
      gap: 24px;
      font-size: 13px;
      color: #909399;

      .detail-author,
      .detail-time {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }

  .detail-content {
    font-size: 15px;
    line-height: 1.8;
    color: #303133;
    margin-bottom: 24px;
    min-height: 200px;

    p {
      margin: 0;
      text-indent: 2em;
    }
  }

  .detail-footer {
    display: flex;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px dashed #ebeef5;
    justify-content: flex-end;
  }
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 12px;
}
</style>
