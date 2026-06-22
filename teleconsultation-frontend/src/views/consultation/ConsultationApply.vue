<template>
  <div class="consultation-apply">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>发起会诊申请</span>
          <el-tag v-if="applicationNo" type="info">{{ applicationNo }}</el-tag>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="apply-form"
      >
        <el-form-item label="申请科室" prop="department">
          <el-select
            v-model="formData.department"
            placeholder="请选择申请科室"
            style="width: 100%; max-width: 400px"
          >
            <el-option
              v-for="dept in departmentOptions"
              :key="dept.value"
              :label="dept.label"
              :value="dept.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="会诊类型" prop="consultationType">
          <el-radio-group v-model="formData.consultationType">
            <el-radio :value="ConsultationType.SINGLE">
              <div class="radio-option">
                <el-icon><User /></el-icon>
                <span>单科会诊</span>
              </div>
            </el-radio>
            <el-radio :value="ConsultationType.MULTI">
              <div class="radio-option">
                <el-icon><UserFilled /></el-icon>
                <span>多科会诊</span>
              </div>
            </el-radio>
            <el-radio :value="ConsultationType.EMERGENCY">
              <div class="radio-option emergency">
                <el-icon><Warning /></el-icon>
                <span>紧急会诊</span>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="目标专家" prop="targetDoctorIds">
          <div v-if="formData.consultationType === ConsultationType.SINGLE">
            <el-select
              v-model="selectedDoctor"
              placeholder="请选择专家"
              filterable
              style="width: 100%; max-width: 400px"
              @change="handleDoctorChange"
            >
              <el-option
                v-for="doctor in doctorOptions"
                :key="doctor.id"
                :label="`${doctor.name} - ${doctor.department} ${doctor.title}`"
                :value="doctor.id"
              >
                <span>{{ doctor.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ doctor.department }} {{ doctor.title }}
                </span>
              </el-option>
            </el-select>
          </div>
          <div v-else>
            <el-select
              v-model="formData.targetDoctorIds"
              placeholder="请选择专家（可多选）"
              multiple
              filterable
              style="width: 100%; max-width: 500px"
              @change="handleDoctorsChange"
            >
              <el-option
                v-for="doctor in doctorOptions"
                :key="doctor.id"
                :label="`${doctor.name} - ${doctor.department} ${doctor.title}`"
                :value="doctor.id"
              />
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="会诊目的" prop="consultationPurpose">
          <el-input
            v-model="formData.consultationPurpose"
            placeholder="请输入会诊目的"
            maxlength="200"
            show-word-limit
            style="width: 100%; max-width: 500px"
          />
        </el-form-item>

        <el-form-item label="病情摘要" prop="conditionSummary">
          <el-input
            v-model="formData.conditionSummary"
            type="textarea"
            :rows="5"
            placeholder="请详细描述病情摘要、相关病史、检查结果等"
            maxlength="2000"
            show-word-limit
            style="width: 100%; max-width: 600px"
          />
        </el-form-item>

        <el-form-item label="附件资料">
          <div class="attachment-upload">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
              :file-list="fileList"
              multiple
              accept=".dcm,.pdf,.jpg,.jpeg,.png,.gif"
            >
              <el-button type="primary" :icon="Upload">上传附件</el-button>
              <template #tip>
                <div class="upload-tip">
                  支持DICOM影像、PDF报告、图片等格式，单个文件不超过50MB
                </div>
              </template>
            </el-upload>
          </div>
          <div v-if="attachmentList.length > 0" class="attachment-list">
            <div
              v-for="(item, index) in attachmentList"
              :key="index"
              class="attachment-item"
            >
              <el-icon class="file-icon"><Document /></el-icon>
              <span class="file-name">{{ item.name }}</span>
              <span class="file-size">{{ formatFileSize(item.size || 0) }}</span>
              <el-button type="danger" link :icon="Delete" @click="removeAttachment(index)" />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="紧急程度" prop="urgencyLevel">
          <el-radio-group v-model="formData.urgencyLevel">
            <el-radio :value="UrgencyLevel.NORMAL">
              <el-tag type="info" effect="plain">普通</el-tag>
            </el-radio>
            <el-radio :value="UrgencyLevel.URGENT">
              <el-tag type="warning" effect="plain">加急</el-tag>
            </el-radio>
            <el-radio :value="UrgencyLevel.EMERGENCY">
              <el-tag type="danger" effect="plain">紧急</el-tag>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <div class="form-actions">
            <el-button type="primary" :icon="Check" :loading="submitting" @click="handleSubmit">
              提交申请
            </el-button>
            <el-button :icon="Close" @click="handleReset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules, type UploadFile, type UploadFiles } from 'element-plus'
import {
  User,
  UserFilled,
  Warning,
  Upload,
  Document,
  Delete,
  Check,
  Close
} from '@element-plus/icons-vue'
import {
  ConsultationType,
  UrgencyLevel,
  type CreateConsultationParams
} from '@/types'
import { createConsultation, generateApplicationNo } from '@/api/consultation'

const router = useRouter()
const formRef = ref<FormInstance>()
const uploadRef = ref()
const submitting = ref(false)
const applicationNo = ref('')
const selectedDoctor = ref('')
const fileList = ref<UploadFile[]>([])
const attachmentList = ref<any[]>([])

const formData = reactive<CreateConsultationParams>({
  department: '',
  consultationType: ConsultationType.SINGLE,
  targetDoctorIds: [],
  targetDoctorNames: [],
  targetDepartments: [],
  consultationPurpose: '',
  conditionSummary: '',
  urgencyLevel: UrgencyLevel.NORMAL
})

const rules: FormRules = {
  department: [{ required: true, message: '请选择申请科室', trigger: 'change' }],
  consultationType: [{ required: true, message: '请选择会诊类型', trigger: 'change' }],
  targetDoctorIds: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (formData.consultationType === ConsultationType.SINGLE) {
          if (!selectedDoctor.value) {
            callback(new Error('请选择专家'))
          } else {
            callback()
          }
        } else {
          if (!formData.targetDoctorIds || formData.targetDoctorIds.length === 0) {
            callback(new Error('请选择至少一位专家'))
          } else {
            callback()
          }
        }
      },
      trigger: 'change'
    }
  ],
  consultationPurpose: [{ required: true, message: '请输入会诊目的', trigger: 'blur' }],
  conditionSummary: [{ required: true, message: '请输入病情摘要', trigger: 'blur' }],
  urgencyLevel: [{ required: true, message: '请选择紧急程度', trigger: 'change' }]
}

const departmentOptions = [
  { label: '心内科', value: '心内科' },
  { label: '神经内科', value: '神经内科' },
  { label: '呼吸内科', value: '呼吸内科' },
  { label: '消化内科', value: '消化内科' },
  { label: '内分泌科', value: '内分泌科' },
  { label: '骨科', value: '骨科' },
  { label: '皮肤科', value: '皮肤科' },
  { label: '儿科', value: '儿科' },
  { label: '急诊科', value: '急诊科' },
  { label: '心理科', value: '心理科' },
  { label: '眼科', value: '眼科' }
]

const doctorOptions = [
  { id: 'doctor-1', name: '李医生', department: '心内科', title: '主任医师' },
  { id: 'doctor-2', name: '王医生', department: '神经内科', title: '副主任医师' },
  { id: 'doctor-3', name: '赵医生', department: '神经内科', title: '主治医师' },
  { id: 'doctor-4', name: '陈主任', department: '心内科', title: '主任医师' },
  { id: 'doctor-5', name: '刘医生', department: '皮肤科', title: '副主任医师' },
  { id: 'doctor-6', name: '孙医生', department: '骨科', title: '主治医师' },
  { id: 'doctor-7', name: '周医生', department: '内分泌科', title: '主任医师' }
]

const handleDoctorChange = (doctorId: string) => {
  const doctor = doctorOptions.find(d => d.id === doctorId)
  formData.targetDoctorIds = doctorId ? [doctorId] : []
  formData.targetDoctorNames = doctor ? [doctor.name] : []
}

const handleDoctorsChange = (doctorIds: string[]) => {
  formData.targetDoctorIds = doctorIds
  formData.targetDoctorNames = doctorIds
    .map(id => doctorOptions.find(d => d.id === id)?.name || '')
    .filter(name => name)
}

const handleFileChange = (file: UploadFile, files: UploadFiles) => {
  attachmentList.value = files.map(f => ({
    name: f.name,
    size: f.size,
    raw: f.raw
  }))
}

const handleFileRemove = (file: UploadFile, files: UploadFiles) => {
  attachmentList.value = files.map(f => ({
    name: f.name,
    size: f.size,
    raw: f.raw
  }))
}

const removeAttachment = (index: number) => {
  attachmentList.value.splice(index, 1)
  if (uploadRef.value) {
    uploadRef.value.handleRemove(fileList.value[index])
  }
}

const formatFileSize = (size: number): string => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  submitting.value = true

  try {
    const result = await createConsultation(formData)
    ElMessage.success('会诊申请提交成功！')
    router.push(`/consultation/${result.id}`)
  } catch (error: any) {
    ElMessage.error(error.message || '提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
  selectedDoctor.value = ''
  attachmentList.value = []
  fileList.value = []
}

onMounted(async () => {
  try {
    const result = await generateApplicationNo()
    applicationNo.value = result.applicationNo
  } catch (error) {
    console.error('获取申请单号失败', error)
  }
})
</script>

<style scoped lang="scss">
.consultation-apply {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .apply-form {
    padding: 20px 0;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 6px;

    &.emergency {
      color: #f56c6c;
    }
  }

  .attachment-upload {
    margin-bottom: 16px;
  }

  .upload-tip {
    color: #909399;
    font-size: 12px;
    margin-top: 8px;
  }

  .attachment-list {
    width: 100%;
    max-width: 500px;
  }

  .attachment-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: #f5f7fa;
    border-radius: 4px;
    margin-bottom: 8px;

    .file-icon {
      margin-right: 8px;
      color: #409eff;
    }

    .file-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      color: #909399;
      font-size: 12px;
      margin-right: 12px;
    }
  }

  .form-actions {
    display: flex;
    gap: 12px;
    padding-left: 120px;
  }
}
</style>
