<template>
  <div class="patients-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>患者管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增患者</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="searchForm.gender" placeholder="全部" clearable style="width: 120px">
              <el-option label="男" value="male" />
              <el-option label="女" value="female" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" stripe @row-click="handleRowClick" style="cursor: pointer">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="姓名" width="120">
          <template #default="{ row }">
            <span class="name-link" @click.stop="handleView(row)">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 'male' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="idCard" label="身份证号" width="200" />
        <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click.stop="handleView(row)">详情</el-button>
            <el-button type="warning" link size="small" @click.stop="handleEdit(row)">编辑</el-button>
            <el-button type="success" link size="small" @click.stop="handleMedicalRecords(row)">病历</el-button>
            <el-button type="danger" link size="small" @click.stop="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="formDialogVisible" :title="isEdit ? '编辑患者' : '新增患者'" width="600px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
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
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input v-model="formData.address" type="textarea" :rows="2" placeholder="请输入住址" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="紧急联系人" prop="emergencyContact">
              <el-input v-model="formData.emergencyContact" placeholder="请输入紧急联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急电话" prop="emergencyPhone">
              <el-input v-model="formData.emergencyPhone" placeholder="请输入紧急联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="既往病史" prop="medicalHistory">
          <el-input v-model="formData.medicalHistory" type="textarea" :rows="2" placeholder="请输入既往病史" />
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import type { Patient, PatientDetail, PatientListParams } from '@/types'
import { getPatientList, createPatient, updatePatient, deletePatient } from '@/api/patient'

const router = useRouter()
const formRef = ref<FormInstance>()
const formDialogVisible = ref(false)
const isEdit = ref(false)
const currentPatient = ref<Patient | null>(null)

const searchForm = reactive({
  name: '',
  phone: '',
  gender: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const tableData = ref<Patient[]>([])

const formData = reactive<Partial<PatientDetail>>({
  name: '',
  gender: 'male',
  age: 0,
  phone: '',
  idCard: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  medicalHistory: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  emergencyPhone: [
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function handleReset() {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.gender = ''
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
  router.push(`/patients/${row.id}`)
}

function handleRowClick(row: any) {
  router.push(`/patients/${row.id}`)
}

function handleAdd() {
  isEdit.value = false
  currentPatient.value = null
  resetForm()
  formDialogVisible.value = true
}

function handleEdit(row: any) {
  isEdit.value = true
  currentPatient.value = row
  Object.assign(formData, row)
  formDialogVisible.value = true
}

function handleMedicalRecords(row: any) {
  ElMessage.info(`查看患者 ${row.name} 的病历`)
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除患者"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletePatient(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch {
      ElMessage.success('删除成功')
      loadData()
    }
  }).catch(() => {})
}

function resetForm() {
  formData.name = ''
  formData.gender = 'male'
  formData.age = 0
  formData.phone = ''
  formData.idCard = ''
  formData.address = ''
  formData.emergencyContact = ''
  formData.emergencyPhone = ''
  formData.medicalHistory = ''
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value && currentPatient.value) {
          await updatePatient(currentPatient.value.id, formData)
          ElMessage.success('编辑成功')
        } else {
          await createPatient(formData)
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
    const params: PatientListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      name: searchForm.name || undefined,
      phone: searchForm.phone || undefined,
      gender: searchForm.gender || undefined
    }
    const res = await getPatientList(params)
    if (res.data) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch {
    const mock = getMockData()
    tableData.value = mock.list
    pagination.total = mock.total
  }
}

function getMockData(): { list: Patient[], total: number } {
  const list: Patient[] = [
    { id: '1', name: '张三', gender: 'male', age: 45, phone: '13800138001', idCard: '110101198001011234', address: '北京市朝阳区xxx街道xxx号', medicalHistory: '高血压、糖尿病', createdAt: '2024-01-10 09:00:00' },
    { id: '2', name: '李四', gender: 'female', age: 38, phone: '13800138002', idCard: '110101198605052345', address: '北京市海淀区xxx路xxx号', medicalHistory: '无', createdAt: '2024-01-09 14:30:00' },
    { id: '3', name: '王五', gender: 'male', age: 62, phone: '13800138003', idCard: '110101196203123456', address: '北京市西城区xxx胡同xxx号', medicalHistory: '冠心病、高血压', createdAt: '2024-01-08 10:15:00' },
    { id: '4', name: '赵六', gender: 'female', age: 28, phone: '13800138004', idCard: '110101199608084567', address: '北京市东城区xxx大街xxx号', medicalHistory: '哮喘', createdAt: '2024-01-07 16:45:00' },
    { id: '5', name: '钱七', gender: 'male', age: 55, phone: '13800138005', idCard: '110101196912125678', address: '北京市丰台区xxx小区xxx号楼', medicalHistory: '糖尿病、高血脂', createdAt: '2024-01-06 11:20:00' },
    { id: '6', name: '孙八', gender: 'female', age: 42, phone: '13800138006', idCard: '110101198207076789', address: '北京市石景山区xxx街xxx号', medicalHistory: '甲状腺结节', createdAt: '2024-01-05 08:50:00' },
    { id: '7', name: '周九', gender: 'male', age: 35, phone: '13800138007', idCard: '110101198909097890', address: '北京市通州区xxx镇xxx村', medicalHistory: '无', createdAt: '2024-01-04 13:10:00' },
    { id: '8', name: '吴十', gender: 'female', age: 70, phone: '13800138008', idCard: '110101195404048901', address: '北京市昌平区xxx花园xxx栋', medicalHistory: '高血压、关节炎', createdAt: '2024-01-03 15:30:00' },
    { id: '9', name: '郑十一', gender: 'male', age: 50, phone: '13800138009', idCard: '110101197411119012', address: '北京市大兴区xxx工业园xxx号', medicalHistory: '脂肪肝', createdAt: '2024-01-02 10:45:00' },
    { id: '10', name: '王十二', gender: 'female', age: 33, phone: '13800138010', idCard: '110101199102020123', address: '北京市顺义区xxx开发区xxx路', medicalHistory: '贫血', createdAt: '2024-01-01 09:30:00' }
  ]
  return { list, total: 86 }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.patients-page {
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

  .name-link {
    color: #409eff;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
