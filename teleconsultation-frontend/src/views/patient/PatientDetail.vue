<template>
  <div class="patient-detail">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button :icon="ArrowLeft" link @click="handleBack">返回</el-button>
            <span class="title">患者档案详情</span>
          </div>
          <el-button v-if="!isEdit" type="primary" :icon="Edit" @click="handleEdit">编辑</el-button>
          <div v-else class="header-actions">
            <el-button :icon="Close" @click="handleCancel">取消</el-button>
            <el-button type="primary" :icon="Check" @click="handleSave">保存</el-button>
          </div>
        </div>
      </template>

      <el-descriptions v-if="!isEdit" :column="2" border>
        <el-descriptions-item label="姓名">{{ patientInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ genderMap[patientInfo.gender] }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ patientInfo.age }}岁</el-descriptions-item>
        <el-descriptions-item label="血型">{{ patientInfo.bloodType || '未知' }}</el-descriptions-item>
        <el-descriptions-item label="身份证号" :span="2">{{ patientInfo.idCard }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ patientInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="婚姻状况">{{ maritalStatusMap[patientInfo.maritalStatus || ''] || '未知' }}</el-descriptions-item>
        <el-descriptions-item label="职业">{{ patientInfo.occupation || '未填写' }}</el-descriptions-item>
        <el-descriptions-item label="住址" :span="2">{{ patientInfo.address || '未填写' }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系人">{{ patientInfo.emergencyContact || '未填写' }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系电话">{{ patientInfo.emergencyPhone || '未填写' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ patientInfo.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ patientInfo.updatedAt || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-form v-else ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formData.gender">
                <el-radio value="male">男</el-radio>
                <el-radio value="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="formData.age" :min="0" :max="150" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="血型" prop="bloodType">
              <el-select v-model="formData.bloodType" placeholder="请选择血型" style="width: 100%">
                <el-option label="A型" value="A" />
                <el-option label="B型" value="B" />
                <el-option label="AB型" value="AB" />
                <el-option label="O型" value="O" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="婚姻状况" prop="maritalStatus">
              <el-select v-model="formData.maritalStatus" placeholder="请选择婚姻状况" style="width: 100%">
                <el-option label="未婚" value="single" />
                <el-option label="已婚" value="married" />
                <el-option label="离异" value="divorced" />
                <el-option label="丧偶" value="widowed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业" prop="occupation">
              <el-input v-model="formData.occupation" placeholder="请输入职业" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="住址" prop="address">
          <el-input v-model="formData.address" type="textarea" :rows="2" placeholder="请输入住址" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="紧急联系人" prop="emergencyContact">
              <el-input v-model="formData.emergencyContact" placeholder="请输入紧急联系人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系电话" prop="emergencyPhone">
              <el-input v-model="formData.emergencyPhone" placeholder="请输入紧急联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft, Edit, Check, Close } from '@element-plus/icons-vue'
import type { PatientDetail } from '@/types'
import { getPatientDetail, updatePatient } from '@/api/patient'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const isEdit = ref(false)

const patientInfo = ref<PatientDetail>({
  id: '',
  name: '',
  gender: 'male',
  age: 0,
  phone: '',
  idCard: '',
  address: '',
  medicalHistory: '',
  createdAt: '',
  emergencyContact: '',
  emergencyPhone: '',
  bloodType: undefined,
  maritalStatus: undefined,
  occupation: '',
  updatedAt: ''
})

const formData = reactive<Partial<PatientDetail>>({
  name: '',
  gender: 'male',
  age: 0,
  phone: '',
  idCard: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  bloodType: undefined,
  maritalStatus: undefined,
  occupation: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  emergencyPhone: [
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

const genderMap: Record<string, string> = {
  male: '男',
  female: '女'
}

const maritalStatusMap: Record<string, string> = {
  single: '未婚',
  married: '已婚',
  divorced: '离异',
  widowed: '丧偶'
}

function handleBack() {
  router.back()
}

function handleEdit() {
  Object.assign(formData, patientInfo.value)
  isEdit.value = true
}

function handleCancel() {
  isEdit.value = false
}

async function handleSave() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const patientId = route.params.id as string
        await updatePatient(patientId, formData)
        ElMessage.success('保存成功')
        isEdit.value = false
        await loadPatientDetail()
      } catch {
        ElMessage.error('保存失败')
      }
    }
  })
}

async function loadPatientDetail() {
  try {
    const patientId = route.params.id as string
    const res = await getPatientDetail(patientId)
    if (res.data) {
      patientInfo.value = res.data
    }
  } catch {
    patientInfo.value = getMockPatientDetail()
  }
}

function getMockPatientDetail(): PatientDetail {
  return {
    id: route.params.id as string,
    name: '张三',
    gender: 'male',
    age: 45,
    phone: '13800138001',
    idCard: '110101198001011234',
    address: '北京市朝阳区xxx街道xxx号',
    medicalHistory: '高血压、糖尿病',
    createdAt: '2024-01-10 09:00:00',
    updatedAt: '2024-03-15 14:30:00',
    emergencyContact: '张小三',
    emergencyPhone: '13900139001',
    bloodType: 'A',
    maritalStatus: 'married',
    occupation: '工程师'
  }
}

onMounted(() => {
  loadPatientDetail()
})
</script>

<style scoped lang="scss">
.patient-detail {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .title {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
