<template>
  <div class="schedule-page">
    <el-button :icon="ArrowLeft" @click="goBack" style="margin-bottom: 16px">
      返回
    </el-button>

    <el-card>
      <template #header>
        <div class="card-header">
          <div class="doctor-info">
            <el-avatar :size="40" :src="doctorInfo.avatarUrl" style="margin-right: 12px">
              {{ doctorInfo.realName?.charAt(0) }}
            </el-avatar>
            <div>
              <div style="font-weight: 600; font-size: 16px">{{ doctorInfo.realName }} - 排班管理</div>
              <div style="font-size: 12px; color: #909399">
                {{ doctorInfo.department }} · {{ doctorInfo.professionalTitle }}
              </div>
            </div>
          </div>
          <div class="header-actions">
            <el-button :icon="ArrowLeft" @click="prevWeek">上一周</el-button>
            <span class="week-range">{{ weekStart }} ~ {{ weekEnd }}</span>
            <el-button :icon="ArrowRight" @click="nextWeek">下一周</el-button>
            <el-button type="primary" :icon="Edit" @click="editScheduleVisible = true" style="margin-left: 12px">
              设置周排班
            </el-button>
            <el-button type="success" :icon="Plus" @click="tempScheduleVisible = true">
              临时调班
            </el-button>
            <el-button type="warning" :icon="Calendar" @click="leaveVisible = true">
              请假申请
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="scheduleData" stripe v-loading="loading" border>
        <el-table-column label="日期" width="140" align="center">
          <template #default="{ row }">
            <div class="date-cell">
              <div class="day-name">{{ dayNameMap[row.day] }}</div>
              <div class="date-text">{{ row.date }}</div>
              <el-tag v-if="row.isLeave" type="danger" size="small" effect="dark" style="margin-top: 4px">
                {{ row.leaveType || '请假' }}
              </el-tag>
              <el-tag v-if="row.isTemporary" type="warning" size="small" style="margin-top: 4px">
                临时
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上午 (08:00-12:00)" align="center">
          <template #default="{ row }">
            <div :class="['slot-cell', { 'slot-available': row.morning?.available, 'slot-unavailable': !row.morning?.available || row.isLeave }]">
              <el-icon v-if="row.morning?.available && !row.isLeave" class="slot-icon" color="#67c23a">
                <Select />
              </el-icon>
              <el-icon v-else class="slot-icon" color="#f56c6c">
                <Close />
              </el-icon>
              <div class="slot-text">
                {{ row.morning?.available && !row.isLeave ? '可预约' : '不可预约' }}
              </div>
              <div v-if="row.morning?.available && !row.isLeave" class="slot-count">
                {{ row.morning.slots }} 个号源
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下午 (14:00-17:30)" align="center">
          <template #default="{ row }">
            <div :class="['slot-cell', { 'slot-available': row.afternoon?.available, 'slot-unavailable': !row.afternoon?.available || row.isLeave }]">
              <el-icon v-if="row.afternoon?.available && !row.isLeave" class="slot-icon" color="#67c23a">
                <Select />
              </el-icon>
              <el-icon v-else class="slot-icon" color="#f56c6c">
                <Close />
              </el-icon>
              <div class="slot-text">
                {{ row.afternoon?.available && !row.isLeave ? '可预约' : '不可预约' }}
              </div>
              <div v-if="row.afternoon?.available && !row.isLeave" class="slot-count">
                {{ row.afternoon.slots }} 个号源
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="晚上 (19:00-21:00)" align="center">
          <template #default="{ row }">
            <div :class="['slot-cell', { 'slot-available': row.evening?.available, 'slot-unavailable': !row.evening?.available || row.isLeave }]">
              <el-icon v-if="row.evening?.available && !row.isLeave" class="slot-icon" color="#67c23a">
                <Select />
              </el-icon>
              <el-icon v-else class="slot-icon" color="#f56c6c">
                <Close />
              </el-icon>
              <div class="slot-text">
                {{ row.evening?.available && !row.isLeave ? '可预约' : '不可预约' }}
              </div>
              <div v-if="row.evening?.available && !row.isLeave" class="slot-count">
                {{ row.evening.slots }} 个号源
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="editDaySchedule(row as DaySchedule)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-alert
        v-if="conflictMessage"
        :title="conflictMessage"
        type="warning"
        show-icon
        style="margin-top: 16px"
      />
    </el-card>

    <el-dialog
      v-model="editScheduleVisible"
      title="设置周排班"
      width="700px"
    >
      <el-form label-width="80px">
        <div v-for="(day, dayKey) in weekDayList" :key="dayKey" class="day-schedule-form">
          <div class="day-title">{{ day.label }}</div>
          <el-form-item label="上午">
            <el-checkbox v-model="editForm[day.key].morning.available">
              启用上午排班
            </el-checkbox>
            <el-input-number
              v-if="editForm[day.key].morning.available"
              v-model="editForm[day.key].morning.slots"
              :min="1"
              :max="20"
              size="small"
              style="margin-left: 12px"
            />
            <span v-if="editForm[day.key].morning.available" style="margin-left: 4px">个号源</span>
          </el-form-item>
          <el-form-item label="下午">
            <el-checkbox v-model="editForm[day.key].afternoon.available">
              启用下午排班
            </el-checkbox>
            <el-input-number
              v-if="editForm[day.key].afternoon.available"
              v-model="editForm[day.key].afternoon.slots"
              :min="1"
              :max="20"
              size="small"
              style="margin-left: 12px"
            />
            <span v-if="editForm[day.key].afternoon.available" style="margin-left: 4px">个号源</span>
          </el-form-item>
          <el-form-item label="晚上">
            <el-checkbox v-model="editForm[day.key].evening.available">
              启用晚上排班
            </el-checkbox>
            <el-input-number
              v-if="editForm[day.key].evening.available"
              v-model="editForm[day.key].evening.slots"
              :min="1"
              :max="20"
              size="small"
              style="margin-left: 12px"
            />
            <span v-if="editForm[day.key].evening.available" style="margin-left: 4px">个号源</span>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="editScheduleVisible = false">取消</el-button>
        <el-button type="primary" @click="submitWeekSchedule" :loading="submittingSchedule">
          保存
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="tempScheduleVisible"
      title="临时调班"
      width="500px"
    >
      <el-form :model="tempForm" label-width="100px">
        <el-form-item label="调班日期">
          <el-date-picker
            v-model="tempForm.date"
            type="date"
            placeholder="选择调班日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="上午">
          <el-checkbox v-model="tempForm.morning.available">
            调整上午排班
          </el-checkbox>
          <el-input-number
            v-if="tempForm.morning.available"
            v-model="tempForm.morning.slots"
            :min="1"
            :max="20"
            size="small"
            style="margin-left: 12px"
          />
          <span v-if="tempForm.morning.available" style="margin-left: 4px">个号源</span>
        </el-form-item>
        <el-form-item label="下午">
          <el-checkbox v-model="tempForm.afternoon.available">
            调整下午排班
          </el-checkbox>
          <el-input-number
            v-if="tempForm.afternoon.available"
            v-model="tempForm.afternoon.slots"
            :min="1"
            :max="20"
            size="small"
            style="margin-left: 12px"
          />
          <span v-if="tempForm.afternoon.available" style="margin-left: 4px">个号源</span>
        </el-form-item>
        <el-form-item label="晚上">
          <el-checkbox v-model="tempForm.evening.available">
            调整晚上排班
          </el-checkbox>
          <el-input-number
            v-if="tempForm.evening.available"
            v-model="tempForm.evening.slots"
            :min="1"
            :max="20"
            size="small"
            style="margin-left: 12px"
          />
          <span v-if="tempForm.evening.available" style="margin-left: 4px">个号源</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="tempScheduleVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTempSchedule" :loading="submittingTemp">
          确认调班
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="leaveVisible"
      title="请假申请"
      width="500px"
    >
      <el-form :model="leaveForm" :rules="leaveRules" ref="leaveFormRef" label-width="100px">
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="leaveForm.startDate"
            type="date"
            placeholder="选择开始日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="leaveForm.endDate"
            type="date"
            placeholder="选择结束日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="请假类型" prop="leaveType">
          <el-select v-model="leaveForm.leaveType" placeholder="请选择请假类型" style="width: 100%">
            <el-option label="事假" value="事假" />
            <el-option label="病假" value="病假" />
            <el-option label="年假" value="年假" />
            <el-option label="调休" value="调休" />
          </el-select>
        </el-form-item>
        <el-form-item label="请假原因" prop="reason">
          <el-input
            v-model="leaveForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入请假原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="leaveVisible = false">取消</el-button>
        <el-button type="primary" @click="submitLeave" :loading="submittingLeave">
          提交申请
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  Plus,
  Calendar,
  Select,
  Close,
} from '@element-plus/icons-vue'
import type { Doctor, DaySchedule, ScheduleSlot } from '@/types'
import {
  getDoctorDetail,
  getWeeklySchedule,
  setWeeklySchedule,
  setTemporarySchedule,
  applyLeave,
} from '@/api/doctor'

const route = useRoute()
const router = useRouter()
const doctorId = ref('')
const loading = ref(false)
const submittingSchedule = ref(false)
const submittingTemp = ref(false)
const submittingLeave = ref(false)
const conflictMessage = ref('')

const doctorInfo = ref<Partial<Doctor>>({})
const scheduleData = ref<DaySchedule[]>([])
const weekOffset = ref(0)

const weekStart = computed(() => {
  if (scheduleData.value.length > 0) {
    return scheduleData.value[0].date || ''
  }
  return ''
})
const weekEnd = computed(() => {
  if (scheduleData.value.length > 0) {
    return scheduleData.value[scheduleData.value.length - 1].date || ''
  }
  return ''
})

const dayNameMap: Record<string, string> = {
  monday: '周一',
  tuesday: '周二',
  wednesday: '周三',
  thursday: '周四',
  friday: '周五',
  saturday: '周六',
  sunday: '周日',
}

const weekDayList = [
  { key: 'monday', label: '周一' },
  { key: 'tuesday', label: '周二' },
  { key: 'wednesday', label: '周三' },
  { key: 'thursday', label: '周四' },
  { key: 'friday', label: '周五' },
  { key: 'saturday', label: '周六' },
  { key: 'sunday', label: '周日' },
]

const defaultSlot: ScheduleSlot = {
  available: false,
  slots: 0,
  startTime: '',
  endTime: '',
}

const editScheduleVisible = ref(false)
const editForm = reactive<any>({})

const tempScheduleVisible = ref(false)
const tempForm = reactive({
  date: '',
  morning: { available: false, slots: 8 },
  afternoon: { available: false, slots: 6 },
  evening: { available: false, slots: 0 },
})

const leaveVisible = ref(false)
const leaveFormRef = ref<FormInstance>()
const leaveForm = reactive({
  startDate: '',
  endDate: '',
  leaveType: '',
  reason: '',
})

const leaveRules: FormRules = {
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  leaveType: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  reason: [{ required: true, message: '请输入请假原因', trigger: 'blur' }],
}

onMounted(() => {
  doctorId.value = route.params.id as string
  fetchDoctorInfo()
  fetchSchedule()
})

async function fetchDoctorInfo() {
  try {
    const res: any = await getDoctorDetail(doctorId.value)
    doctorInfo.value = res.data
  } catch (e) {
    console.error('获取医生信息失败', e)
  }
}

async function fetchSchedule() {
  loading.value = true
  try {
    const res: any = await getWeeklySchedule(doctorId.value, weekOffset.value)
    scheduleData.value = res.data.schedule
  } catch (e) {
    console.error('获取排班失败', e)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function prevWeek() {
  weekOffset.value--
  fetchSchedule()
}

function nextWeek() {
  weekOffset.value++
  fetchSchedule()
}

function editDaySchedule(row: DaySchedule) {
  conflictMessage.value = ''
  ElMessage.info(`编辑 ${dayNameMap[row.day]} 的排班`)
}

function initEditForm() {
  weekDayList.forEach(day => {
    const daySchedule = scheduleData.value.find(s => s.day === day.key)
    editForm[day.key] = {
      morning: { ...(daySchedule?.morning || defaultSlot) },
      afternoon: { ...(daySchedule?.afternoon || defaultSlot) },
      evening: { ...(daySchedule?.evening || defaultSlot) },
    }
  })
}

async function submitWeekSchedule() {
  submittingSchedule.value = true
  try {
    const res: any = await setWeeklySchedule(doctorId.value, editForm)
    if (res.code === 200 || res.code === 0) {
      ElMessage.success('周排班设置成功')
      editScheduleVisible.value = false
      fetchSchedule()
    }
  } catch (e) {
    console.error('设置周排班失败', e)
  } finally {
    submittingSchedule.value = false
  }
}

async function submitTempSchedule() {
  if (!tempForm.date) {
    ElMessage.warning('请选择调班日期')
    return
  }
  submittingTemp.value = true
  try {
    const data = {
      date: tempForm.date,
      morning: tempForm.morning.available ? tempForm.morning : undefined,
      afternoon: tempForm.afternoon.available ? tempForm.afternoon : undefined,
      evening: tempForm.evening.available ? tempForm.evening : undefined,
    }
    const res: any = await setTemporarySchedule(doctorId.value, data as any)
    if (res.code === 200 || res.code === 0) {
      if (res.data?.hasConflict) {
        conflictMessage.value = res.data.message || '存在排班冲突'
        ElMessage.warning(res.data.message || '存在排班冲突')
      } else {
        ElMessage.success('临时调班设置成功')
        tempScheduleVisible.value = false
        fetchSchedule()
      }
    }
  } catch (e) {
    console.error('临时调班失败', e)
  } finally {
    submittingTemp.value = false
  }
}

async function submitLeave() {
  if (!leaveFormRef.value) return
  await leaveFormRef.value.validate(async (valid) => {
    if (!valid) return
    submittingLeave.value = true
    try {
      const res: any = await applyLeave(doctorId.value, leaveForm as any)
      if (res.code === 200 || res.code === 0) {
        ElMessage.success('请假申请已提交')
        leaveVisible.value = false
        fetchSchedule()
      }
    } catch (e) {
      console.error('请假申请失败', e)
    } finally {
      submittingLeave.value = false
    }
  })
}

watch(editScheduleVisible, (val) => {
  if (val) {
    initEditForm()
  }
})
</script>

<style scoped lang="scss">
.schedule-page {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .doctor-info {
      display: flex;
      align-items: center;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .week-range {
        font-weight: 500;
        color: #303133;
        min-width: 200px;
        text-align: center;
      }
    }
  }

  .date-cell {
    padding: 8px 0;

    .day-name {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }

    .date-text {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }

  .slot-cell {
    padding: 12px 8px;
    border-radius: 4px;

    &.slot-available {
      background-color: #f0f9eb;
    }

    &.slot-unavailable {
      background-color: #fef0f0;
    }

    .slot-icon {
      font-size: 20px;
      margin-bottom: 4px;
    }

    .slot-text {
      font-size: 13px;
      font-weight: 500;
    }

    .slot-count {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }

  .day-schedule-form {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .day-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
      padding-left: 8px;
      border-left: 3px solid #409eff;
    }
  }
}
</style>
