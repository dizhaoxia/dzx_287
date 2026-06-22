<template>
  <div class="consultation-detail">
    <div class="detail-header">
      <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
      <h2 class="title">会诊详情</h2>
      <div class="header-actions">
        <template v-if="canAccept">
          <el-button type="success" :icon="Check" @click="handleAccept">接受会诊</el-button>
          <el-button type="danger" :icon="Close" @click="handleReject">拒绝会诊</el-button>
        </template>
        <el-button
          v-if="canStart"
          type="primary"
          :icon="VideoCamera"
          @click="handleStart"
        >
          开始会诊
        </el-button>
        <el-button
          v-if="canComplete"
          type="success"
          :icon="Finished"
          @click="handleComplete"
        >
          结束会诊
        </el-button>
        <el-button
          v-if="canCancel"
          type="warning"
          :icon="Warning"
          @click="handleCancel"
        >
          取消会诊
        </el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="info-card">
          <template #header>
            <div class="card-title">
              <el-icon><Document /></el-icon>
              <span>基本信息</span>
            </div>
          </template>

          <div class="info-row">
            <div class="info-item">
              <label>申请单号：</label>
              <span class="value application-no">{{ detail?.applicationNo }}</span>
            </div>
            <div class="info-item">
              <label>状态：</label>
              <el-tag :type="statusTagMap[detail?.status || '']" size="small">
                {{ statusTextMap[detail?.status || ''] }}
              </el-tag>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <label>会诊类型：</label>
              <el-tag :type="typeTagMap[detail?.consultationType || '']" size="small">
                {{ typeTextMap[detail?.consultationType || ''] }}
              </el-tag>
            </div>
            <div class="info-item">
              <label>紧急程度：</label>
              <el-tag :type="urgencyTagMap[detail?.urgencyLevel || '']" size="small">
                {{ urgencyTextMap[detail?.urgencyLevel || ''] }}
              </el-tag>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <label>申请科室：</label>
              <span class="value">{{ detail?.department }}</span>
            </div>
            <div class="info-item">
              <label>申请时间：</label>
              <span class="value">{{ formatDate(detail?.createdAt) }}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item full-width">
              <label>目标专家：</label>
              <span class="value">
                {{ detail?.targetDoctorNames?.join('、') || '-' }}
              </span>
            </div>
          </div>

          <div class="info-row" v-if="detail?.chiefDoctorName">
            <div class="info-item">
              <label>主诊医生：</label>
              <span class="value">{{ detail.chiefDoctorName }}</span>
            </div>
            <div class="info-item">
              <label>会诊费用：</label>
              <span class="value fee">¥{{ detail?.fee?.toFixed(2) }}</span>
            </div>
          </div>
        </el-card>

        <el-card class="info-card">
          <template #header>
            <div class="card-title">
              <el-icon><ChatDotRound /></el-icon>
              <span>会诊详情</span>
            </div>
          </template>

          <div class="detail-section">
            <h4 class="section-title">会诊目的</h4>
            <p class="section-content">{{ detail?.consultationPurpose || '-' }}</p>
          </div>

          <div class="detail-section">
            <h4 class="section-title">病情摘要</h4>
            <p class="section-content">{{ detail?.conditionSummary || '-' }}</p>
          </div>

          <div class="detail-section" v-if="detail?.rejectionReason">
            <h4 class="section-title">拒绝原因</h4>
            <p class="section-content rejection">{{ detail.rejectionReason }}</p>
          </div>
        </el-card>

        <el-card class="info-card">
          <template #header>
            <div class="card-title">
              <el-icon><Folder /></el-icon>
              <span>附件资料</span>
              <span class="attachment-count">({{ attachments.length }}个)</span>
            </div>
          </template>

          <el-empty v-if="attachments.length === 0" description="暂无附件" />

          <div v-else class="attachment-list">
            <div
              v-for="item in attachments"
              :key="item.id"
              class="attachment-item"
            >
              <div class="attachment-icon">
                <el-icon :size="24">
                  <component :is="getFileIcon(item.fileType)" />
                </el-icon>
              </div>
              <div class="attachment-info">
                <div class="attachment-name">{{ item.fileName }}</div>
                <div class="attachment-meta">
                  <span>{{ formatFileSize(item.fileSize) }}</span>
                  <span class="divider">|</span>
                  <span>{{ formatDate(item.createdAt) }}</span>
                  <span class="divider">|</span>
                  <span>{{ item.uploaderName }} 上传</span>
                </div>
              </div>
              <div class="attachment-actions">
                <el-button type="primary" link size="small">预览</el-button>
                <el-button type="primary" link size="small">下载</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="patient-card">
          <template #header>
            <div class="card-title">
              <el-icon><User /></el-icon>
              <span>患者信息</span>
            </div>
          </template>

          <div class="patient-info">
            <div class="patient-avatar">
              <el-avatar :size="64">
                {{ detail?.patientName?.charAt(0) || '患' }}
              </el-avatar>
            </div>
            <div class="patient-name">{{ detail?.patientName }}</div>
            <div class="patient-meta">
              <span>患者</span>
            </div>
          </div>

          <el-divider />

          <div class="patient-detail">
            <div class="detail-item">
              <label>申请人：</label>
              <span>{{ detail?.applicantName || '-' }}</span>
            </div>
            <div class="detail-item">
              <label>申请角色：</label>
              <span>{{ getRoleText(detail?.applicantRole) }}</span>
            </div>
          </div>
        </el-card>

        <el-card class="timeline-card">
          <template #header>
            <div class="card-title">
              <el-icon><Clock /></el-icon>
              <span>会诊记录</span>
            </div>
          </template>

          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in timeline"
              :key="index"
              :timestamp="formatDate(item.time)"
              :type="getTimelineType(item.action)"
              placement="top"
            >
              <div class="timeline-content">
                <div class="timeline-action">{{ item.action }}</div>
                <div class="timeline-operator">{{ item.operator }}</div>
                <div class="timeline-desc" v-if="item.description">
                  {{ item.description }}
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="rejectDialogVisible" title="拒绝会诊" width="500px">
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="拒绝原因" required>
          <el-input
            v-model="rejectForm.rejectionReason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="rejectLoading" @click="confirmReject">
          确认拒绝
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type TagProps } from 'element-plus'
import {
  ArrowLeft,
  Check,
  Close,
  VideoCamera,
  Finished,
  Warning,
  Document,
  ChatDotRound,
  Folder,
  User,
  Clock,
  Picture,
  Files,
  DataAnalysis,
  QuestionFilled
} from '@element-plus/icons-vue'
import {
  Consultation,
  ConsultationStatus,
  ConsultationType,
  UrgencyLevel,
  AttachmentType,
  ConsultationAttachment,
  ConsultationTimelineItem
} from '@/types'
import {
  getConsultationDetail,
  acceptConsultation,
  rejectConsultation,
  startConsultation,
  completeConsultation,
  cancelConsultation,
  getConsultationTimeline
} from '@/api/consultation'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const detail = ref<Consultation | null>(null)
const attachments = ref<ConsultationAttachment[]>([])
const timeline = ref<ConsultationTimelineItem[]>([])
const loading = ref(false)
const rejectDialogVisible = ref(false)
const rejectLoading = ref(false)

const rejectForm = reactive({
  rejectionReason: ''
})

const isPatient = computed(() => userStore.userInfo?.role === 'patient')
const isDoctor = computed(() => userStore.userInfo?.role === 'doctor')
const isAdmin = computed(() => userStore.userInfo?.role === 'admin')

const canAccept = computed(() => {
  return (isDoctor.value || isAdmin.value) && detail.value?.status === ConsultationStatus.PENDING
})

const canReject = computed(() => {
  return (isDoctor.value || isAdmin.value) && detail.value?.status === ConsultationStatus.PENDING
})

const canStart = computed(() => {
  return (isDoctor.value || isAdmin.value) && detail.value?.status === ConsultationStatus.ACCEPTED
})

const canComplete = computed(() => {
  return (isDoctor.value || isAdmin.value) && detail.value?.status === ConsultationStatus.IN_PROGRESS
})

const canCancel = computed(() => {
  return detail.value?.status === ConsultationStatus.PENDING
})

const statusTextMap: Record<string, string> = {
  [ConsultationStatus.PENDING]: '待确认',
  [ConsultationStatus.ACCEPTED]: '已接受',
  [ConsultationStatus.IN_PROGRESS]: '进行中',
  [ConsultationStatus.COMPLETED]: '已完成',
  [ConsultationStatus.CANCELLED]: '已取消',
  [ConsultationStatus.REJECTED]: '已拒绝'
}

const statusTagMap: Record<string, TagProps['type']> = {
  [ConsultationStatus.PENDING]: 'warning',
  [ConsultationStatus.ACCEPTED]: 'primary',
  [ConsultationStatus.IN_PROGRESS]: 'success',
  [ConsultationStatus.COMPLETED]: 'info',
  [ConsultationStatus.CANCELLED]: 'info',
  [ConsultationStatus.REJECTED]: 'danger'
}

const typeTextMap: Record<string, string> = {
  [ConsultationType.SINGLE]: '单科会诊',
  [ConsultationType.MULTI]: '多科会诊',
  [ConsultationType.EMERGENCY]: '紧急会诊'
}

const typeTagMap: Record<string, TagProps['type']> = {
  [ConsultationType.SINGLE]: 'primary',
  [ConsultationType.MULTI]: 'warning',
  [ConsultationType.EMERGENCY]: 'danger'
}

const urgencyTextMap: Record<string, string> = {
  [UrgencyLevel.NORMAL]: '普通',
  [UrgencyLevel.URGENT]: '加急',
  [UrgencyLevel.EMERGENCY]: '紧急'
}

const urgencyTagMap: Record<string, TagProps['type']> = {
  [UrgencyLevel.NORMAL]: 'info',
  [UrgencyLevel.URGENT]: 'warning',
  [UrgencyLevel.EMERGENCY]: 'danger'
}

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case AttachmentType.IMAGE:
      return Picture
    case AttachmentType.PDF:
      return Files
    case AttachmentType.DICOM:
      return DataAnalysis
    default:
      return QuestionFilled
  }
}

const getRoleText = (role?: string) => {
  const map: Record<string, string> = {
    patient: '患者',
    doctor: '医生',
    admin: '管理员'
  }
  return map[role || ''] || '-'
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (size: number): string => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const getTimelineType = (action: string): any => {
  const map: Record<string, any> = {
    '发起申请': 'primary',
    '接受会诊': 'success',
    '拒绝会诊': 'danger',
    '开始会诊': 'success',
    '结束会诊': 'info',
    '取消会诊': 'info'
  }
  return map[action] || 'primary'
}

const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    detail.value = await getConsultationDetail(id)
    attachments.value = detail.value.attachments || []

    const timelineResult = await getConsultationTimeline(id)
    timeline.value = timelineResult
  } catch (error: any) {
    ElMessage.error(error.message || '获取详情失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const handleAccept = async () => {
  try {
    await ElMessageBox.confirm('确定要接受此会诊邀请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })

    const id = route.params.id as string
    await acceptConsultation(id)
    ElMessage.success('接受成功')
    fetchDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

const handleReject = () => {
  rejectForm.rejectionReason = ''
  rejectDialogVisible.value = true
}

const confirmReject = async () => {
  if (!rejectForm.rejectionReason.trim()) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  const id = route.params.id as string
  rejectLoading.value = true
  try {
    await rejectConsultation(id, {
      rejectionReason: rejectForm.rejectionReason
    })
    ElMessage.success('已拒绝会诊')
    rejectDialogVisible.value = false
    fetchDetail()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    rejectLoading.value = false
  }
}

const handleStart = async () => {
  try {
    await ElMessageBox.confirm('确定要开始会诊吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'primary'
    })

    const id = route.params.id as string
    await startConsultation(id)
    ElMessage.success('会诊已开始')
    fetchDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

const handleComplete = async () => {
  try {
    await ElMessageBox.confirm('确定要结束本次会诊吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })

    const id = route.params.id as string
    await completeConsultation(id)
    ElMessage.success('会诊已结束')
    fetchDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消此会诊申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const id = route.params.id as string
    await cancelConsultation(id)
    ElMessage.success('取消成功')
    fetchDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped lang="scss">
.consultation-detail {
  .detail-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;

    .title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .header-actions {
      margin-left: auto;
      display: flex;
      gap: 12px;
    }
  }

  .info-card {
    margin-bottom: 20px;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;

    .attachment-count {
      font-size: 12px;
      color: #909399;
      font-weight: normal;
    }
  }

  .info-row {
    display: flex;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .info-item {
    flex: 1;
    display: flex;
    align-items: center;

    &.full-width {
      flex: none;
      width: 100%;
    }

    label {
      color: #909399;
      margin-right: 8px;
      white-space: nowrap;
    }

    .value {
      color: #303133;

      &.application-no {
        font-family: monospace;
        font-weight: 600;
      }

      &.fee {
        color: #f56c6c;
        font-weight: 600;
      }
    }
  }

  .detail-section {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .section-title {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  .section-content {
    margin: 0;
    color: #606266;
    line-height: 1.8;
    white-space: pre-wrap;

    &.rejection {
      color: #f56c6c;
    }
  }

  .attachment-list {
    .attachment-item {
      display: flex;
      align-items: center;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 6px;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .attachment-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ecf5ff;
      border-radius: 6px;
      color: #409eff;
      margin-right: 12px;
    }

    .attachment-info {
      flex: 1;
      overflow: hidden;
    }

    .attachment-name {
      font-size: 14px;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 4px;
    }

    .attachment-meta {
      font-size: 12px;
      color: #909399;

      .divider {
        margin: 0 8px;
      }
    }

    .attachment-actions {
      display: flex;
      gap: 8px;
    }
  }

  .patient-card {
    margin-bottom: 20px;

    .patient-info {
      text-align: center;
      padding: 10px 0;
    }

    .patient-avatar {
      margin-bottom: 12px;
    }

    .patient-name {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 6px;
    }

    .patient-meta {
      font-size: 12px;
      color: #909399;
    }

    .patient-detail {
      .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px dashed #ebeef5;

        &:last-child {
          border-bottom: none;
        }

        label {
          color: #909399;
        }

        span {
          color: #303133;
        }
      }
    }
  }

  .timeline-card {
    .timeline-content {
      .timeline-action {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }

      .timeline-operator {
        font-size: 12px;
        color: #909399;
        margin-bottom: 6px;
      }

      .timeline-desc {
        font-size: 13px;
        color: #606266;
        line-height: 1.6;
      }
    }
  }
}
</style>
