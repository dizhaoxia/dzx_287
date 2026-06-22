<template>
  <div class="doctor-detail-page">
    <el-button :icon="ArrowLeft" @click="goBack" style="margin-bottom: 16px">
      返回列表
    </el-button>

    <el-card v-loading="loading" class="base-info-card">
      <div class="doctor-header">
        <el-avatar :size="80" :src="doctorInfo.avatarUrl" class="doctor-avatar">
          {{ doctorInfo.realName?.charAt(0) }}
        </el-avatar>
        <div class="doctor-info">
          <div class="doctor-name">
            {{ doctorInfo.realName }}
            <el-tag :type="doctorInfo.licenseVerified ? 'success' : 'warning'" size="small" style="margin-left: 8px">
              {{ doctorInfo.licenseVerified ? '已认证' : '待认证' }}
            </el-tag>
          </div>
          <div class="doctor-meta">
            <span>{{ doctorInfo.department }}</span>
            <span class="divider">|</span>
            <span>{{ doctorInfo.professionalTitle }}</span>
            <span class="divider">|</span>
            <span>{{ doctorInfo.hospitalName }}</span>
          </div>
          <div class="doctor-stats">
            <div class="stat-item">
              <span class="stat-value">{{ doctorInfo.rating }}</span>
              <span class="stat-label">评分</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ doctorInfo.consultationCount }}</span>
              <span class="stat-label">接诊次数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">¥{{ doctorInfo.consultationFee }}</span>
              <span class="stat-label">咨询费</span>
            </div>
          </div>
        </div>
        <div class="doctor-actions">
          <el-button type="primary" :icon="Calendar" @click="goToSchedule">
            排班管理
          </el-button>
          <el-button :icon="Edit" @click="handleEditInfo">
            编辑信息
          </el-button>
        </div>
      </div>
    </el-card>

    <el-tabs v-model="activeTab" class="detail-tabs">
      <el-tab-pane label="专业擅长" name="specialties">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>专业擅长设置</span>
              <el-button type="primary" size="small" @click="specialtiesEditVisible = true">
                编辑
              </el-button>
            </div>
          </template>

          <div class="specialties-section">
            <h4>擅长疾病</h4>
            <div v-if="specialties.diseaseTags.length > 0" class="tag-group">
              <el-tag v-for="tag in specialties.diseaseTags" :key="tag" type="primary" effect="light">
                {{ tag }}
              </el-tag>
            </div>
            <el-empty v-else description="暂无数据" :image-size="80" />
          </div>

          <div class="specialties-section">
            <h4>擅长手术类型</h4>
            <div v-if="specialties.surgeryTypes.length > 0" class="tag-group">
              <el-tag v-for="tag in specialties.surgeryTypes" :key="tag" type="success" effect="light">
                {{ tag }}
              </el-tag>
            </div>
            <el-empty v-else description="暂无数据" :image-size="80" />
          </div>

          <div class="specialties-section">
            <h4>擅长治疗领域</h4>
            <div v-if="specialties.treatmentAreas.length > 0" class="tag-group">
              <el-tag v-for="tag in specialties.treatmentAreas" :key="tag" type="warning" effect="light">
                {{ tag }}
              </el-tag>
            </div>
            <el-empty v-else description="暂无数据" :image-size="80" />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="资质认证" name="certification">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>资质证书列表</span>
              <el-button type="primary" size="small" :icon="Plus" @click="openCertDialog">
                新增证书
              </el-button>
            </div>
          </template>

          <el-table :data="certList" stripe>
            <el-table-column prop="certName" label="证书名称" width="180" />
            <el-table-column prop="certType" label="类型" width="120">
              <template #default="{ row }">
                <el-tag size="small" :type="certTypeMap[(row as DoctorCertification).certType].type as any">
                  {{ certTypeMap[(row as DoctorCertification).certType].label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="certNumber" label="证书编号" width="180" />
            <el-table-column prop="issuingAuthority" label="发证机关" width="180" show-overflow-tooltip />
            <el-table-column prop="issueDate" label="发证日期" width="120" />
            <el-table-column label="有效期" width="200">
              <template #default="{ row }">
                <div :class="{ 'expiry-warning': isExpiringSoon(row as DoctorCertification) }">
                  <span>{{ (row as DoctorCertification).expiryDate || '长期有效' }}</span>
                  <el-tag v-if="isExpiringSoon(row as DoctorCertification)" type="danger" size="small" style="margin-left: 8px">
                    还剩 {{ getDaysRemaining(row as DoctorCertification) }} 天
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag size="small" :type="statusMap[(row as DoctorCertification).status] as any">
                  {{ statusTextMap[(row as DoctorCertification).status] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="viewCert(row as DoctorCertification)">查看</el-button>
                <el-button type="warning" link size="small" @click="editCert(row as DoctorCertification)">编辑</el-button>
                <el-button type="danger" link size="small" @click="deleteCert(row as DoctorCertification)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="个人简介" name="bio">
        <el-card>
          <template #header>
            <span>个人简介</span>
          </template>
          <p class="bio-text">{{ doctorInfo.bio || '暂无简介' }}</p>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-model="specialtiesEditVisible"
      title="编辑专业擅长"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="擅长疾病">
          <el-select
            v-model="specialtiesForm.diseaseTags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或输入擅长疾病"
            style="width: 100%"
          >
            <el-option
              v-for="tag in diseaseTagOptions"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手术类型">
          <el-select
            v-model="specialtiesForm.surgeryTypes"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或输入擅长手术类型"
            style="width: 100%"
          >
            <el-option
              v-for="tag in surgeryTypeOptions"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="治疗领域">
          <el-select
            v-model="specialtiesForm.treatmentAreas"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或输入擅长治疗领域"
            style="width: 100%"
          >
            <el-option
              v-for="tag in treatmentAreaOptions"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="specialtiesEditVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSpecialties" :loading="submittingSpecialties">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="certDialogVisible"
      :title="isCertEdit ? '编辑资质证书' : '新增资质证书'"
      width="600px"
    >
      <el-form
        ref="certFormRef"
        :model="certForm"
        :rules="certFormRules"
        label-width="100px"
      >
        <el-form-item label="证书类型" prop="certType">
          <el-select v-model="certForm.certType" placeholder="请选择证书类型" style="width: 100%">
            <el-option label="执业证书" value="practice" />
            <el-option label="职称证书" value="professional_title" />
            <el-option label="专科认证" value="specialty" />
          </el-select>
        </el-form-item>
        <el-form-item label="证书名称" prop="certName">
          <el-input v-model="certForm.certName" placeholder="请输入证书名称" />
        </el-form-item>
        <el-form-item label="证书编号" prop="certNumber">
          <el-input v-model="certForm.certNumber" placeholder="请输入证书编号" />
        </el-form-item>
        <el-form-item label="发证机关" prop="issuingAuthority">
          <el-input v-model="certForm.issuingAuthority" placeholder="请输入发证机关" />
        </el-form-item>
        <el-form-item label="发证日期" prop="issueDate">
          <el-date-picker
            v-model="certForm.issueDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="有效期至" prop="expiryDate">
          <el-date-picker
            v-model="certForm.expiryDate"
            type="date"
            placeholder="选择日期（长期有效可不填）"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="证书文件" prop="certFileUrl">
          <el-upload
            action="#"
            :auto-upload="false"
            :limit="1"
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <el-button :icon="Upload">上传证书</el-button>
            <template #tip>
              <div class="el-upload__tip">支持 pdf、jpg、png 格式</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="certForm.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="certDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCert" :loading="submittingCert">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import {
  ArrowLeft,
  Calendar,
  Edit,
  Plus,
  Upload,
} from '@element-plus/icons-vue'
import type {
  Doctor,
  SpecialtiesResponse,
  DoctorCertification,
  CreateCertificationDto,
} from '@/types'
import {
  getDoctorDetail,
  getDoctorSpecialties,
  updateDoctorSpecialties,
  getDoctorCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from '@/api/doctor'

const route = useRoute()
const router = useRouter()
const doctorId = ref('')
const loading = ref(false)
const activeTab = ref('specialties')
const submittingSpecialties = ref(false)
const submittingCert = ref(false)

const doctorInfo = ref<Partial<Doctor>>({})
const specialties = reactive<SpecialtiesResponse>({
  diseaseTags: [],
  surgeryTypes: [],
  treatmentAreas: [],
})
const certList = ref<DoctorCertification[]>([])

const specialtiesEditVisible = ref(false)
const specialtiesForm = reactive<SpecialtiesResponse>({
  diseaseTags: [],
  surgeryTypes: [],
  treatmentAreas: [],
})

const diseaseTagOptions = ['高血压', '糖尿病', '冠心病', '心力衰竭', '心律失常', '骨折', '关节炎', '湿疹', '皮炎']
const surgeryTypeOptions = ['冠脉介入治疗', '关节置换', '脊柱内固定术', '白内障手术', '激光治疗']
const treatmentAreaOptions = ['心血管内科', '内分泌科', '骨科', '皮肤科', '神经内科', '儿科', '眼科']

const certDialogVisible = ref(false)
const isCertEdit = ref(false)
const currentCertId = ref('')
const certFormRef = ref<FormInstance>()
const certForm = reactive<Partial<CreateCertificationDto>>({
  certType: 'practice',
  certName: '',
  certNumber: '',
  certFileUrl: '',
  issueDate: '',
  expiryDate: '',
  issuingAuthority: '',
  remark: '',
})

const certFormRules: FormRules = {
  certType: [{ required: true, message: '请选择证书类型', trigger: 'change' }],
  certName: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
  certNumber: [{ required: true, message: '请输入证书编号', trigger: 'blur' }],
}

const certTypeMap: Record<string, { label: string; type: string }> = {
  practice: { label: '执业证书', type: 'primary' },
  professional_title: { label: '职称证书', type: 'success' },
  specialty: { label: '专科认证', type: 'warning' },
}

const statusMap: Record<string, string> = {
  pending: 'warning',
  verified: 'success',
  rejected: 'danger',
}

const statusTextMap: Record<string, string> = {
  pending: '待审核',
  verified: '已通过',
  rejected: '已拒绝',
}

onMounted(() => {
  doctorId.value = route.params.id as string
  fetchDoctorDetail()
  fetchSpecialties()
  fetchCertifications()
})

async function fetchDoctorDetail() {
  loading.value = true
  try {
    const res: any = await getDoctorDetail(doctorId.value)
    doctorInfo.value = res.data
  } catch (e) {
    console.error('获取医生详情失败', e)
  } finally {
    loading.value = false
  }
}

async function fetchSpecialties() {
  try {
    const res: any = await getDoctorSpecialties(doctorId.value)
    Object.assign(specialties, res.data)
  } catch (e) {
    console.error('获取专业擅长失败', e)
  }
}

async function fetchCertifications() {
  try {
    const res: any = await getDoctorCertifications(doctorId.value)
    certList.value = res.data || []
  } catch (e) {
    console.error('获取资质认证失败', e)
  }
}

function goBack() {
  router.back()
}

function goToSchedule() {
  router.push(`/doctors/${doctorId.value}/schedule`)
}

function handleEditInfo() {
  ElMessage.info('编辑功能可在列表页操作')
}

function isExpiringSoon(cert: DoctorCertification): boolean {
  if (!cert.expiryDate) return false
  const now = new Date()
  const expiry = new Date(cert.expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 90
}

function getDaysRemaining(cert: DoctorCertification): number {
  if (!cert.expiryDate) return 0
  const now = new Date()
  const expiry = new Date(cert.expiryDate)
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

async function submitSpecialties() {
  submittingSpecialties.value = true
  try {
    const res: any = await updateDoctorSpecialties(doctorId.value, specialtiesForm)
    if (res.code === 200 || res.code === 0) {
      ElMessage.success('保存成功')
      specialtiesEditVisible.value = false
      Object.assign(specialties, res.data)
    }
  } catch (e) {
    console.error('保存专业擅长失败', e)
  } finally {
    submittingSpecialties.value = false
  }
}

function openCertDialog() {
  isCertEdit.value = false
  currentCertId.value = ''
  resetCertForm()
  certDialogVisible.value = true
}

function editCert(row: DoctorCertification) {
  isCertEdit.value = true
  currentCertId.value = row.id
  Object.assign(certForm, row)
  certDialogVisible.value = true
}

function viewCert(row: DoctorCertification) {
  ElMessageBox.alert(
    `
      <p><strong>证书名称：</strong>${row.certName}</p>
      <p><strong>证书编号：</strong>${row.certNumber}</p>
      <p><strong>发证机关：</strong>${row.issuingAuthority || '-'}</p>
      <p><strong>发证日期：</strong>${row.issueDate || '-'}</p>
      <p><strong>有效期至：</strong>${row.expiryDate || '长期有效'}</p>
      <p><strong>状态：</strong>${statusTextMap[row.status]}</p>
      <p><strong>备注：</strong>${row.remark || '-'}</p>
    `,
    '证书详情',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭',
    }
  )
}

function deleteCert(row: DoctorCertification) {
  ElMessageBox.confirm(
    `确定要删除证书"${row.certName}"吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res: any = await deleteCertification(row.id)
      if (res.code === 200 || res.code === 0) {
        ElMessage.success('删除成功')
        fetchCertifications()
      }
    } catch (e) {
      console.error('删除失败', e)
    }
  }).catch(() => {})
}

function resetCertForm() {
  certForm.certType = 'practice'
  certForm.certName = ''
  certForm.certNumber = ''
  certForm.certFileUrl = ''
  certForm.issueDate = ''
  certForm.expiryDate = ''
  certForm.issuingAuthority = ''
  certForm.remark = ''
  certFormRef.value?.resetFields()
}

async function submitCert() {
  if (!certFormRef.value) return
  await certFormRef.value.validate(async (valid) => {
    if (!valid) return
    submittingCert.value = true
    try {
      let res: any
      if (isCertEdit.value) {
        res = await updateCertification(currentCertId.value, certForm)
      } else {
        res = await createCertification(doctorId.value, certForm as CreateCertificationDto)
      }
      if (res.code === 200 || res.code === 0) {
        ElMessage.success(isCertEdit.value ? '编辑成功' : '新增成功')
        certDialogVisible.value = false
        fetchCertifications()
      }
    } catch (e) {
      console.error('提交失败', e)
    } finally {
      submittingCert.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.doctor-detail-page {
  .base-info-card {
    margin-bottom: 20px;
  }

  .doctor-header {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .doctor-avatar {
    flex-shrink: 0;
  }

  .doctor-info {
    flex: 1;

    .doctor-name {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
    }

    .doctor-meta {
      font-size: 14px;
      color: #606266;
      margin-bottom: 16px;

      .divider {
        margin: 0 8px;
        color: #dcdfe6;
      }
    }

    .doctor-stats {
      display: flex;
      gap: 40px;

      .stat-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: #409eff;
        }

        .stat-label {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  .doctor-actions {
    display: flex;
    gap: 12px;
  }

  .detail-tabs {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .specialties-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 12px 0;
    }

    .tag-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .expiry-warning {
    color: #f56c6c;
    font-weight: 500;
  }

  .bio-text {
    font-size: 14px;
    line-height: 1.8;
    color: #606266;
    margin: 0;
  }
}
</style>
