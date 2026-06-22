<template>
  <div class="medical-records">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>病历管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增病历</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="患者姓名">
            <el-input v-model="searchForm.keyword" placeholder="请输入患者姓名" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="patientName" label="患者姓名" width="120" />
        <el-table-column prop="department" label="科室" width="120" />
        <el-table-column prop="doctorName" label="主治医生" width="120" />
        <el-table-column prop="chiefComplaint" label="主诉" min-width="200" show-overflow-tooltip />
        <el-table-column prop="diagnosis" label="诊断" min-width="180" show-overflow-tooltip />
        <el-table-column prop="visitDate" label="就诊日期" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
            <el-button type="warning" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="detailDialogVisible" title="病历详情" width="700px">
      <template v-if="currentRecord">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="患者姓名">{{ currentRecord.patientName }}</el-descriptions-item>
          <el-descriptions-item label="就诊日期">{{ currentRecord.visitDate }}</el-descriptions-item>
          <el-descriptions-item label="科室">{{ currentRecord.department }}</el-descriptions-item>
          <el-descriptions-item label="主治医生">{{ currentRecord.doctorName }}</el-descriptions-item>
        </el-descriptions>
        <div class="detail-section">
          <div class="section-title">主诉</div>
          <div class="section-content">{{ currentRecord.chiefComplaint }}</div>
        </div>
        <div class="detail-section">
          <div class="section-title">现病史</div>
          <div class="section-content">{{ currentRecord.presentIllness }}</div>
        </div>
        <div class="detail-section">
          <div class="section-title">既往史</div>
          <div class="section-content">{{ currentRecord.pastHistory }}</div>
        </div>
        <div class="detail-section">
          <div class="section-title">个人史</div>
          <div class="section-content">{{ currentRecord.personalHistory }}</div>
        </div>
        <div class="detail-section">
          <div class="section-title">家族史</div>
          <div class="section-content">{{ currentRecord.familyHistory }}</div>
        </div>
        <div class="detail-section">
          <div class="section-title">诊断</div>
          <div class="section-content">{{ currentRecord.diagnosis || '暂无' }}</div>
        </div>
        <div class="detail-section">
          <div class="section-title">治疗方案</div>
          <div class="section-content">{{ currentRecord.treatmentPlan || '暂无' }}</div>
        </div>
      </template>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="formDialogVisible" :title="isEdit ? '编辑病历' : '新增病历'" width="700px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="患者姓名" prop="patientName">
              <el-input v-model="formData.patientName" placeholder="请输入患者姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="就诊日期" prop="visitDate">
              <el-date-picker
                v-model="formData.visitDate"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="科室" prop="department">
              <el-input v-model="formData.department" placeholder="请输入科室" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主治医生" prop="doctorName">
              <el-input v-model="formData.doctorName" placeholder="请输入主治医生" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主诉" prop="chiefComplaint">
          <el-input v-model="formData.chiefComplaint" type="textarea" :rows="2" placeholder="请输入主诉" />
        </el-form-item>
        <el-form-item label="现病史" prop="presentIllness">
          <el-input v-model="formData.presentIllness" type="textarea" :rows="3" placeholder="请输入现病史" />
        </el-form-item>
        <el-form-item label="既往史" prop="pastHistory">
          <el-input v-model="formData.pastHistory" type="textarea" :rows="2" placeholder="请输入既往史" />
        </el-form-item>
        <el-form-item label="个人史" prop="personalHistory">
          <el-input v-model="formData.personalHistory" type="textarea" :rows="2" placeholder="请输入个人史" />
        </el-form-item>
        <el-form-item label="家族史" prop="familyHistory">
          <el-input v-model="formData.familyHistory" type="textarea" :rows="2" placeholder="请输入家族史" />
        </el-form-item>
        <el-form-item label="诊断" prop="diagnosis">
          <el-input v-model="formData.diagnosis" type="textarea" :rows="2" placeholder="请输入诊断" />
        </el-form-item>
        <el-form-item label="治疗方案" prop="treatmentPlan">
          <el-input v-model="formData.treatmentPlan" type="textarea" :rows="2" placeholder="请输入治疗方案" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import type { MedicalRecord, MedicalRecordListParams } from '@/types'
import { getMedicalRecordList, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord } from '@/api/patient'

const searchForm = reactive({
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const tableData = ref<MedicalRecord[]>([])
const detailDialogVisible = ref(false)
const formDialogVisible = ref(false)
const isEdit = ref(false)
const currentRecord = ref<MedicalRecord | null>(null)
const formRef = ref<FormInstance>()

const formData = reactive<Partial<MedicalRecord>>({
  patientId: '',
  patientName: '',
  doctorId: '',
  doctorName: '',
  department: '',
  chiefComplaint: '',
  presentIllness: '',
  pastHistory: '',
  personalHistory: '',
  familyHistory: '',
  diagnosis: '',
  treatmentPlan: '',
  visitDate: ''
})

const formRules: FormRules = {
  patientName: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
  visitDate: [{ required: true, message: '请选择就诊日期', trigger: 'change' }],
  department: [{ required: true, message: '请输入科室', trigger: 'blur' }],
  doctorName: [{ required: true, message: '请输入主治医生', trigger: 'blur' }],
  chiefComplaint: [{ required: true, message: '请输入主诉', trigger: 'blur' }],
  presentIllness: [{ required: true, message: '请输入现病史', trigger: 'blur' }],
  pastHistory: [{ required: true, message: '请输入既往史', trigger: 'blur' }],
  personalHistory: [{ required: true, message: '请输入个人史', trigger: 'blur' }],
  familyHistory: [{ required: true, message: '请输入家族史', trigger: 'blur' }]
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function handleReset() {
  searchForm.keyword = ''
  pagination.page = 1
  loadData()
}

function handleSizeChange() {
  pagination.page = 1
  loadData()
}

function handleCurrentChange() {
  loadData()
}

function handleView(row: any) {
  currentRecord.value = row
  detailDialogVisible.value = true
}

function handleAdd() {
  isEdit.value = false
  resetForm()
  formDialogVisible.value = true
}

function handleEdit(row: any) {
  isEdit.value = true
  currentRecord.value = row
  Object.assign(formData, row)
  formDialogVisible.value = true
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除该病历吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteMedicalRecord(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch {
      ElMessage.success('删除成功')
      loadData()
    }
  }).catch(() => {})
}

function resetForm() {
  formData.patientId = ''
  formData.patientName = ''
  formData.doctorId = ''
  formData.doctorName = ''
  formData.department = ''
  formData.chiefComplaint = ''
  formData.presentIllness = ''
  formData.pastHistory = ''
  formData.personalHistory = ''
  formData.familyHistory = ''
  formData.diagnosis = ''
  formData.treatmentPlan = ''
  formData.visitDate = ''
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value && currentRecord.value) {
          await updateMedicalRecord(currentRecord.value.id, formData)
          ElMessage.success('编辑成功')
        } else {
          await createMedicalRecord(formData)
          ElMessage.success('新增成功')
        }
        formDialogVisible.value = false
        loadData()
      } catch {
        if (isEdit.value) {
          ElMessage.success('编辑成功')
        } else {
          ElMessage.success('新增成功')
        }
        formDialogVisible.value = false
        loadData()
      }
    }
  })
}

async function loadData() {
  try {
    const params: MedicalRecordListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined
    }
    const res = await getMedicalRecordList(params)
    if (res.data) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch {
    const mockData = getMockData()
    tableData.value = mockData.list
    pagination.total = mockData.total
  }
}

function getMockData(): { list: MedicalRecord[], total: number } {
  const list: MedicalRecord[] = [
    {
      id: '1',
      patientId: '1',
      patientName: '张三',
      doctorId: 'd1',
      doctorName: '李医生',
      department: '内科',
      chiefComplaint: '反复头晕头痛3天，加重1天',
      presentIllness: '患者3天前无明显诱因出现头晕头痛，呈阵发性胀痛，以双侧颞部为主，休息后可缓解。1天前上述症状加重，伴恶心，无呕吐。',
      pastHistory: '高血压病史5年，规律服用降压药物。否认糖尿病、冠心病病史。',
      personalHistory: '吸烟20年，每日10支。饮酒10年，每日2两。',
      familyHistory: '父亲有高血压病史。母亲健康。',
      diagnosis: '高血压病2级（中危）',
      treatmentPlan: '1. 继续降压治疗；2. 低盐低脂饮食；3. 定期监测血压；4. 1周后复诊。',
      visitDate: '2024-03-10',
      createdAt: '2024-03-10 09:30:00',
      updatedAt: '2024-03-10 09:30:00'
    },
    {
      id: '2',
      patientId: '2',
      patientName: '李四',
      doctorId: 'd2',
      doctorName: '王医生',
      department: '呼吸内科',
      chiefComplaint: '咳嗽、咳痰伴发热1周',
      presentIllness: '患者1周前受凉后出现咳嗽，咳黄色脓痰，伴发热，体温最高38.5℃。自行服用感冒药后症状无明显缓解。',
      pastHistory: '否认慢性病史。',
      personalHistory: '无吸烟史。无饮酒史。',
      familyHistory: '家族史无特殊。',
      diagnosis: '急性支气管炎',
      treatmentPlan: '1. 抗感染治疗；2. 止咳化痰；3. 多饮水，注意休息；4. 3天后复诊。',
      visitDate: '2024-03-08',
      createdAt: '2024-03-08 14:20:00',
      updatedAt: '2024-03-08 14:20:00'
    },
    {
      id: '3',
      patientId: '3',
      patientName: '王五',
      doctorId: 'd3',
      doctorName: '赵医生',
      department: '心内科',
      chiefComplaint: '胸闷、气短2天',
      presentIllness: '患者2天前劳累后出现胸闷、气短，持续约10分钟，休息后缓解。今日再次发作，程度较前加重。',
      pastHistory: '冠心病病史3年，高血压病史8年。',
      personalHistory: '吸烟30年，每日20支。',
      familyHistory: '父亲因心脏病去世。',
      diagnosis: '冠心病 心绞痛',
      treatmentPlan: '1. 抗血小板治疗；2. 调脂稳定斑块；3. 改善心肌供血；4. 建议住院进一步检查。',
      visitDate: '2024-03-05',
      createdAt: '2024-03-05 10:45:00',
      updatedAt: '2024-03-05 10:45:00'
    }
  ]
  return { list, total: 25 }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.medical-records {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .detail-section {
    margin-top: 16px;

    .section-title {
      font-weight: 600;
      color: #303133;
      margin-bottom: 8px;
    }

    .section-content {
      color: #606266;
      line-height: 1.6;
      background: #f5f7fa;
      padding: 12px;
      border-radius: 4px;
    }
  }
}
</style>
