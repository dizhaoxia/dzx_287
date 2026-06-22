<template>
  <div class="doctor-list-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>医生管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增医生</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="姓名">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入姓名/科室/医院"
              clearable
              style="width: 200px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="科室">
            <el-select
              v-model="searchForm.department"
              placeholder="全部科室"
              clearable
              style="width: 160px"
            >
              <el-option
                v-for="dept in departmentList"
                :key="dept.id"
                :label="dept.deptName"
                :value="dept.deptName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="职称">
            <el-select
              v-model="searchForm.professionalTitle"
              placeholder="全部职称"
              clearable
              style="width: 160px"
            >
              <el-option
                v-for="title in titleList"
                :key="title"
                :label="title"
                :value="title"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatarUrl">
              {{ row.realName?.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" width="100" />
        <el-table-column prop="department" label="科室" width="100" />
        <el-table-column prop="professionalTitle" label="职称" width="100" />
        <el-table-column prop="hospitalName" label="所属医院" width="160" show-overflow-tooltip />
        <el-table-column prop="specialties" label="擅长" min-width="180" show-overflow-tooltip />
        <el-table-column prop="phoneNumber" label="电话" width="130" />
        <el-table-column label="认证状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.licenseVerified ? 'success' : 'warning'" size="small">
              {{ row.licenseVerified ? '已认证' : '待认证' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评分" width="90">
          <template #default="{ row }">
            <div class="rating">
              <el-rate :model-value="(row as Doctor).rating" disabled size="small" />
              <span class="rating-text">{{ (row as Doctor).rating }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row as Doctor)">详情</el-button>
            <el-button type="success" link size="small" @click="handleSchedule(row as Doctor)">排班</el-button>
            <el-button type="warning" link size="small" @click="handleEdit(row as Doctor)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row as Doctor)">删除</el-button>
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
          @current-change="fetchList"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑医生' : '新增医生'"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="formData.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="formData.age" :min="18" :max="100" />
        </el-form-item>
        <el-form-item label="电话" prop="phoneNumber">
          <el-input v-model="formData.phoneNumber" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="科室" prop="department">
          <el-select v-model="formData.department" placeholder="请选择科室" style="width: 100%">
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.deptName"
              :value="dept.deptName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="professionalTitle">
          <el-input v-model="formData.professionalTitle" placeholder="请输入职称" />
        </el-form-item>
        <el-form-item label="所属医院" prop="hospitalName">
          <el-input v-model="formData.hospitalName" placeholder="请输入医院名称" />
        </el-form-item>
        <el-form-item label="擅长" prop="specialties">
          <el-input
            v-model="formData.specialties"
            type="textarea"
            :rows="2"
            placeholder="请输入擅长领域，用逗号分隔"
          />
        </el-form-item>
        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="formData.bio"
            type="textarea"
            :rows="3"
            placeholder="请输入个人简介"
          />
        </el-form-item>
        <el-form-item label="执业证号" prop="licenseNumber">
          <el-input v-model="formData.licenseNumber" placeholder="请输入执业证书编号" />
        </el-form-item>
        <el-form-item label="咨询费用" prop="consultationFee">
          <el-input-number v-model="formData.consultationFee" :min="0" :step="10" />
          <span style="margin-left: 8px">元</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import type { Doctor, Department } from '@/types'
import {
  getDoctorList,
  getDepartments,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '@/api/doctor'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref('')

const searchForm = reactive({
  keyword: '',
  department: '',
  professionalTitle: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const tableData = ref<Doctor[]>([])
const departmentList = ref<Department[]>([])
const titleList = ref<string[]>([])

const formData = reactive<Partial<Doctor>>({
  realName: '',
  gender: '男',
  age: 30,
  phoneNumber: '',
  department: '',
  professionalTitle: '',
  hospitalName: '',
  specialties: '',
  bio: '',
  licenseNumber: '',
  consultationFee: 0,
})

const formRules: FormRules = {
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请选择科室', trigger: 'change' }],
  professionalTitle: [{ required: true, message: '请输入职称', trigger: 'blur' }],
}

onMounted(() => {
  fetchDepartments()
  fetchList()
})

async function fetchDepartments() {
  try {
    const res: any = await getDepartments()
    departmentList.value = res.data || []
  } catch (e) {
    console.error('获取科室列表失败', e)
  }
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getDoctorList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      department: searchForm.department || undefined,
      professionalTitle: searchForm.professionalTitle || undefined,
      keyword: searchForm.keyword || undefined,
    })
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (e) {
    console.error('获取医生列表失败', e)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchList()
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.department = ''
  searchForm.professionalTitle = ''
  pagination.page = 1
  fetchList()
}

function handleSizeChange() {
  pagination.page = 1
  fetchList()
}

function handleAdd() {
  isEdit.value = false
  currentId.value = ''
  resetForm()
  dialogVisible.value = true
}

function handleEdit(row: Doctor) {
  isEdit.value = true
  currentId.value = row.id
  Object.assign(formData, row)
  dialogVisible.value = true
}

function handleView(row: Doctor) {
  router.push(`/doctors/${row.id}`)
}

function handleSchedule(row: Doctor) {
  router.push(`/doctors/${row.id}/schedule`)
}

function handleDelete(row: Doctor) {
  ElMessageBox.confirm(`确定要删除医生"${row.realName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res: any = await deleteDoctor(row.id)
      if (res.code === 200 || res.code === 0) {
        ElMessage.success('删除成功')
        fetchList()
      }
    } catch (e) {
      console.error('删除失败', e)
    }
  }).catch(() => {})
}

function resetForm() {
  formData.realName = ''
  formData.gender = '男'
  formData.age = 30
  formData.phoneNumber = ''
  formData.department = ''
  formData.professionalTitle = ''
  formData.hospitalName = ''
  formData.specialties = ''
  formData.bio = ''
  formData.licenseNumber = ''
  formData.consultationFee = 0
  formRef.value?.resetFields()
}

function handleDialogClose() {
  resetForm()
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      let res: any
      if (isEdit.value) {
        res = await updateDoctor(currentId.value, formData)
      } else {
        res = await createDoctor(formData)
      }
      if (res.code === 200 || res.code === 0) {
        ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
        dialogVisible.value = false
        fetchList()
      }
    } catch (e) {
      console.error('提交失败', e)
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.doctor-list-page {
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

  .rating {
    display: flex;
    align-items: center;
    gap: 4px;

    .rating-text {
      font-size: 12px;
      color: #f59e0b;
    }
  }
}
</style>
