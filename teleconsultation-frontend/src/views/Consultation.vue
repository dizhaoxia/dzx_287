<template>
  <div class="consultation-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>会诊管理</span>
            <el-button type="primary" :icon="Plus" @click="handleApply">发起会诊</el-button>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="consultation-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="我的申请" name="my" v-if="isPatient || isAdmin" />
        <el-tab-pane label="收到的邀请" name="received" v-if="isDoctor || isAdmin" />
        <el-tab-pane label="全部会诊" name="all" v-if="isAdmin" />
      </el-tabs>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="申请单号/患者姓名"
              clearable
              style="width: 220px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 140px">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="紧急程度">
            <el-select v-model="searchForm.urgencyLevel" placeholder="全部" clearable style="width: 120px">
              <el-option label="普通" :value="UrgencyLevel.NORMAL" />
              <el-option label="加急" :value="UrgencyLevel.URGENT" />
              <el-option label="紧急" :value="UrgencyLevel.EMERGENCY" />
            </el-select>
          </el-form-item>
          <el-form-item label="会诊类型">
            <el-select v-model="searchForm.consultationType" placeholder="全部" clearable style="width: 120px">
              <el-option label="单科会诊" :value="ConsultationType.SINGLE" />
              <el-option label="多科会诊" :value="ConsultationType.MULTI" />
              <el-option label="紧急会诊" :value="ConsultationType.EMERGENCY" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 280px"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="applicationNo" label="申请单号" width="180" show-overflow-tooltip />
        <el-table-column prop="patientName" label="患者姓名" width="100" />
        <el-table-column label="会诊类型" width="110">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.consultationType]" size="small">
              {{ typeTextMap[row.consultationType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="申请科室" width="110" />
        <el-table-column label="目标专家" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.targetDoctorNames?.join('、') || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="紧急程度" width="100">
          <template #default="{ row }">
            <el-tag :type="urgencyTagMap[row.urgencyLevel]" size="small">
              {{ urgencyTextMap[row.urgencyLevel] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagMap[row.status]" size="small">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="170" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row as Consultation)">查看</el-button>
            <el-button
              type="success"
              link
              size="small"
              v-if="canAccept(row as Consultation)"
              @click="handleAccept(row as Consultation)"
            >
              接受
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              v-if="canReject(row as Consultation)"
              @click="handleReject(row as Consultation)"
            >
              拒绝
            </el-button>
            <el-button
              type="warning"
              link
              size="small"
              v-if="canCancel(row as Consultation)"
              @click="handleCancel(row as Consultation)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

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
        <el-button type="primary" :loading="rejectLoading" @click="confirmReject">确认拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type TagProps } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import {
  Consultation,
  ConsultationStatus,
  ConsultationType,
  UrgencyLevel,
  ConsultationListParams
} from '@/types'
import {
  getConsultationList,
  acceptConsultation,
  rejectConsultation,
  cancelConsultation
} from '@/api/consultation'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const activeTab = ref('my')
const tableData = ref<Consultation[]>([])
const dateRange = ref<string[]>([])
const rejectDialogVisible = ref(false)
const rejectLoading = ref(false)
const currentRejectRow = ref<Consultation | null>(null)

const rejectForm = reactive({
  rejectionReason: ''
})

const searchForm = reactive<ConsultationListParams>({
  keyword: '',
  status: undefined,
  urgencyLevel: undefined,
  consultationType: undefined,
  department: '',
  startDate: undefined,
  endDate: undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const isPatient = computed(() => userStore.userInfo?.role === 'patient')
const isDoctor = computed(() => userStore.userInfo?.role === 'doctor')
const isAdmin = computed(() => userStore.userInfo?.role === 'admin')

const statusOptions = [
  { label: '待确认', value: ConsultationStatus.PENDING },
  { label: '已接受', value: ConsultationStatus.ACCEPTED },
  { label: '进行中', value: ConsultationStatus.IN_PROGRESS },
  { label: '已完成', value: ConsultationStatus.COMPLETED },
  { label: '已取消', value: ConsultationStatus.CANCELLED },
  { label: '已拒绝', value: ConsultationStatus.REJECTED }
]

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

const canAccept = (row: Consultation) => {
  return (isDoctor.value || isAdmin.value) && row.status === ConsultationStatus.PENDING
}

const canReject = (row: Consultation) => {
  return (isDoctor.value || isAdmin.value) && row.status === ConsultationStatus.PENDING
}

const canCancel = (row: Consultation) => {
  return row.status === ConsultationStatus.PENDING
}

const fetchList = async () => {
  loading.value = true
  try {
    const params: ConsultationListParams = {
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
      startDate: dateRange.value?.[0],
      endDate: dateRange.value?.[1]
    }

    const result = await getConsultationList(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error: any) {
    ElMessage.error(error.message || '获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  pagination.page = 1
  fetchList()
}

const handleSearch = () => {
  pagination.page = 1
  fetchList()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  searchForm.urgencyLevel = undefined
  searchForm.consultationType = undefined
  searchForm.department = ''
  dateRange.value = []
  pagination.page = 1
  fetchList()
}

const handleApply = () => {
  router.push('/consultation/apply')
}

const handleView = (row: Consultation) => {
  router.push(`/consultation/${row.id}`)
}

const handleAccept = async (row: Consultation) => {
  try {
    await ElMessageBox.confirm('确定要接受此会诊邀请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })

    await acceptConsultation(row.id)
    ElMessage.success('接受成功')
    fetchList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

const handleReject = (row: Consultation) => {
  currentRejectRow.value = row
  rejectForm.rejectionReason = ''
  rejectDialogVisible.value = true
}

const confirmReject = async () => {
  if (!rejectForm.rejectionReason.trim()) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  if (!currentRejectRow.value) return

  rejectLoading.value = true
  try {
    await rejectConsultation(currentRejectRow.value.id, {
      rejectionReason: rejectForm.rejectionReason
    })
    ElMessage.success('已拒绝会诊')
    rejectDialogVisible.value = false
    fetchList()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    rejectLoading.value = false
  }
}

const handleCancel = async (row: Consultation) => {
  try {
    await ElMessageBox.confirm('确定要取消此会诊申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelConsultation(row.id)
    ElMessage.success('取消成功')
    fetchList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.consultation-page {
  .card-header {
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  .consultation-tabs {
    margin-bottom: 20px;
  }

  .search-bar {
    margin-bottom: 20px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
