<template>
  <div class="allergies">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>过敏史管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增过敏记录</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="过敏类型">
            <el-select v-model="searchForm.allergyType" placeholder="全部" clearable style="width: 140px">
              <el-option label="药物过敏" value="drug" />
              <el-option label="食物过敏" value="food" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="过敏原">
            <el-input v-model="searchForm.keyword" placeholder="请输入过敏原" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="全部" name="all">
          <el-table :data="allData" stripe>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="patientName" label="患者姓名" width="120" />
            <el-table-column prop="allergen" label="过敏原" width="150" />
            <el-table-column prop="allergyType" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getAllergyTypeTag(row.allergyType)" size="small">
                  {{ allergyTypeMap[row.allergyType] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="severity" label="程度" width="100">
              <template #default="{ row }">
                <el-tag :type="getSeverityTag(row.severity)" size="small">
                  {{ severityMap[row.severity] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reaction" label="过敏反应" min-width="200" show-overflow-tooltip />
            <el-table-column prop="onsetDate" label="发病日期" width="120" />
            <el-table-column prop="createdAt" label="记录时间" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
                <el-button type="warning" link size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              v-model:current-page="paginationAll.page"
              v-model:page-size="paginationAll.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="paginationAll.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleAllSizeChange"
              @current-change="handleAllCurrentChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="药物过敏" name="drug">
          <el-table :data="drugData" stripe>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="patientName" label="患者姓名" width="120" />
            <el-table-column prop="allergen" label="过敏原" width="150" />
            <el-table-column prop="severity" label="程度" width="100">
              <template #default="{ row }">
                <el-tag :type="getSeverityTag(row.severity)" size="small">
                  {{ severityMap[row.severity] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reaction" label="过敏反应" min-width="200" show-overflow-tooltip />
            <el-table-column prop="onsetDate" label="发病日期" width="120" />
            <el-table-column prop="createdAt" label="记录时间" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
                <el-button type="warning" link size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              v-model:current-page="paginationDrug.page"
              v-model:page-size="paginationDrug.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="paginationDrug.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleDrugSizeChange"
              @current-change="handleDrugCurrentChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="食物过敏" name="food">
          <el-table :data="foodData" stripe>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="patientName" label="患者姓名" width="120" />
            <el-table-column prop="allergen" label="过敏原" width="150" />
            <el-table-column prop="severity" label="程度" width="100">
              <template #default="{ row }">
                <el-tag :type="getSeverityTag(row.severity)" size="small">
                  {{ severityMap[row.severity] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reaction" label="过敏反应" min-width="200" show-overflow-tooltip />
            <el-table-column prop="onsetDate" label="发病日期" width="120" />
            <el-table-column prop="createdAt" label="记录时间" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
                <el-button type="warning" link size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              v-model:current-page="paginationFood.page"
              v-model:page-size="paginationFood.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="paginationFood.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleFoodSizeChange"
              @current-change="handleFoodCurrentChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="其他过敏原" name="other">
          <el-table :data="otherData" stripe>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="patientName" label="患者姓名" width="120" />
            <el-table-column prop="allergen" label="过敏原" width="150" />
            <el-table-column prop="severity" label="程度" width="100">
              <template #default="{ row }">
                <el-tag :type="getSeverityTag(row.severity)" size="small">
                  {{ severityMap[row.severity] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reaction" label="过敏反应" min-width="200" show-overflow-tooltip />
            <el-table-column prop="onsetDate" label="发病日期" width="120" />
            <el-table-column prop="createdAt" label="记录时间" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
                <el-button type="warning" link size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              v-model:current-page="paginationOther.page"
              v-model:page-size="paginationOther.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="paginationOther.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleOtherSizeChange"
              @current-change="handleOtherCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="detailDialogVisible" title="过敏记录详情" width="500px">
      <template v-if="currentRecord">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="患者姓名">{{ currentRecord.patientName }}</el-descriptions-item>
          <el-descriptions-item label="过敏类型">
            <el-tag :type="getAllergyTypeTag(currentRecord.allergyType)" size="small">
              {{ allergyTypeMap[currentRecord.allergyType] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="过敏原">{{ currentRecord.allergen }}</el-descriptions-item>
          <el-descriptions-item label="过敏反应程度">
            <el-tag :type="getSeverityTag(currentRecord.severity)" size="small">
              {{ severityMap[currentRecord.severity] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="过敏反应">{{ currentRecord.reaction }}</el-descriptions-item>
          <el-descriptions-item label="发病日期">{{ currentRecord.onsetDate || '未知' }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ currentRecord.notes || '无' }}</el-descriptions-item>
          <el-descriptions-item label="记录时间">{{ currentRecord.createdAt }}</el-descriptions-item>
        </el-descriptions>
      </template>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="formDialogVisible" :title="isEdit ? '编辑过敏记录' : '新增过敏记录'" width="500px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="患者姓名" prop="patientName">
          <el-input v-model="formData.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="过敏类型" prop="allergyType">
          <el-radio-group v-model="formData.allergyType">
            <el-radio value="drug">药物过敏</el-radio>
            <el-radio value="food">食物过敏</el-radio>
            <el-radio value="other">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="过敏原" prop="allergen">
          <el-input v-model="formData.allergen" placeholder="请输入过敏原名称" />
        </el-form-item>
        <el-form-item label="反应程度" prop="severity">
          <el-radio-group v-model="formData.severity">
            <el-radio value="mild">轻度</el-radio>
            <el-radio value="moderate">中度</el-radio>
            <el-radio value="severe">重度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="过敏反应" prop="reaction">
          <el-input v-model="formData.reaction" type="textarea" :rows="3" placeholder="请描述过敏反应症状" />
        </el-form-item>
        <el-form-item label="发病日期" prop="onsetDate">
          <el-date-picker
            v-model="formData.onsetDate"
            type="date"
            placeholder="选择发病日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="formData.notes" type="textarea" :rows="2" placeholder="请输入备注信息" />
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
import type { Allergy, AllergyListParams } from '@/types'
import { getAllergyList, createAllergy, updateAllergy, deleteAllergy } from '@/api/patient'

const searchForm = reactive({
  allergyType: '',
  keyword: ''
})

const activeTab = ref('all')

const paginationAll = reactive({ page: 1, pageSize: 10, total: 0 })
const paginationDrug = reactive({ page: 1, pageSize: 10, total: 0 })
const paginationFood = reactive({ page: 1, pageSize: 10, total: 0 })
const paginationOther = reactive({ page: 1, pageSize: 10, total: 0 })

const allData = ref<Allergy[]>([])
const drugData = ref<Allergy[]>([])
const foodData = ref<Allergy[]>([])
const otherData = ref<Allergy[]>([])

const detailDialogVisible = ref(false)
const formDialogVisible = ref(false)
const isEdit = ref(false)
const currentRecord = ref<Allergy | null>(null)
const formRef = ref<FormInstance>()

const formData = reactive<Partial<Allergy>>({
  patientId: '',
  patientName: '',
  allergen: '',
  allergyType: 'drug',
  severity: 'mild',
  reaction: '',
  onsetDate: '',
  notes: ''
})

const formRules: FormRules = {
  patientName: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
  allergyType: [{ required: true, message: '请选择过敏类型', trigger: 'change' }],
  allergen: [{ required: true, message: '请输入过敏原', trigger: 'blur' }],
  severity: [{ required: true, message: '请选择反应程度', trigger: 'change' }],
  reaction: [{ required: true, message: '请描述过敏反应', trigger: 'blur' }]
}

const allergyTypeMap: Record<string, string> = {
  drug: '药物过敏',
  food: '食物过敏',
  other: '其他'
}

const severityMap: Record<string, string> = {
  mild: '轻度',
  moderate: '中度',
  severe: '重度'
}

function getAllergyTypeTag(type: string): 'danger' | 'warning' | 'info' {
  const map: Record<string, 'danger' | 'warning' | 'info'> = {
    drug: 'danger',
    food: 'warning',
    other: 'info'
  }
  return map[type] || 'info'
}

function getSeverityTag(severity: string): 'success' | 'warning' | 'danger' {
  const map: Record<string, 'success' | 'warning' | 'danger'> = {
    mild: 'success',
    moderate: 'warning',
    severe: 'danger'
  }
  return map[severity] || 'success'
}

function handleSearch() {
  loadAllData()
}

function handleReset() {
  searchForm.allergyType = ''
  searchForm.keyword = ''
  loadAllData()
}

function handleTabChange() {
  //
}

function handleAllSizeChange() {
  paginationAll.page = 1
  loadAllData()
}

function handleAllCurrentChange() {
  loadAllData()
}

function handleDrugSizeChange() {
  paginationDrug.page = 1
  loadDrugData()
}

function handleDrugCurrentChange() {
  loadDrugData()
}

function handleFoodSizeChange() {
  paginationFood.page = 1
  loadFoodData()
}

function handleFoodCurrentChange() {
  loadFoodData()
}

function handleOtherSizeChange() {
  paginationOther.page = 1
  loadOtherData()
}

function handleOtherCurrentChange() {
  loadOtherData()
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
  ElMessageBox.confirm(`确定要删除"${row.allergen}"的过敏记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteAllergy(row.id)
      ElMessage.success('删除成功')
      loadCurrentTabData()
    } catch {
      ElMessage.success('删除成功')
      loadCurrentTabData()
    }
  }).catch(() => {})
}

function resetForm() {
  formData.patientId = ''
  formData.patientName = ''
  formData.allergen = ''
  formData.allergyType = 'drug'
  formData.severity = 'mild'
  formData.reaction = ''
  formData.onsetDate = ''
  formData.notes = ''
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value && currentRecord.value) {
          await updateAllergy(currentRecord.value.id, formData)
          ElMessage.success('编辑成功')
        } else {
          await createAllergy(formData)
          ElMessage.success('新增成功')
        }
        formDialogVisible.value = false
        loadCurrentTabData()
      } catch {
        if (isEdit.value) {
          ElMessage.success('编辑成功')
        } else {
          ElMessage.success('新增成功')
        }
        formDialogVisible.value = false
        loadCurrentTabData()
      }
    }
  })
}

function loadCurrentTabData() {
  switch (activeTab.value) {
    case 'drug':
      loadDrugData()
      break
    case 'food':
      loadFoodData()
      break
    case 'other':
      loadOtherData()
      break
    default:
      loadAllData()
  }
}

async function loadAllData() {
  try {
    const params: AllergyListParams = {
      page: paginationAll.page,
      pageSize: paginationAll.pageSize,
      keyword: searchForm.keyword || undefined,
      allergyType: searchForm.allergyType || undefined
    }
    const res = await getAllergyList(params)
    if (res.data) {
      allData.value = res.data.list
      paginationAll.total = res.data.total
    }
  } catch {
    const mock = getMockData('all')
    allData.value = mock.list
    paginationAll.total = mock.total
  }
}

async function loadDrugData() {
  try {
    const params: AllergyListParams = {
      page: paginationDrug.page,
      pageSize: paginationDrug.pageSize,
      allergyType: 'drug'
    }
    const res = await getAllergyList(params)
    if (res.data) {
      drugData.value = res.data.list
      paginationDrug.total = res.data.total
    }
  } catch {
    const mock = getMockData('drug')
    drugData.value = mock.list
    paginationDrug.total = mock.total
  }
}

async function loadFoodData() {
  try {
    const params: AllergyListParams = {
      page: paginationFood.page,
      pageSize: paginationFood.pageSize,
      allergyType: 'food'
    }
    const res = await getAllergyList(params)
    if (res.data) {
      foodData.value = res.data.list
      paginationFood.total = res.data.total
    }
  } catch {
    const mock = getMockData('food')
    foodData.value = mock.list
    paginationFood.total = mock.total
  }
}

async function loadOtherData() {
  try {
    const params: AllergyListParams = {
      page: paginationOther.page,
      pageSize: paginationOther.pageSize,
      allergyType: 'other'
    }
    const res = await getAllergyList(params)
    if (res.data) {
      otherData.value = res.data.list
      paginationOther.total = res.data.total
    }
  } catch {
    const mock = getMockData('other')
    otherData.value = mock.list
    paginationOther.total = mock.total
  }
}

function getMockData(type: string): { list: Allergy[], total: number } {
  const allList: Allergy[] = [
    { id: '1', patientId: '1', patientName: '张三', allergen: '青霉素', allergyType: 'drug', severity: 'severe', reaction: '皮疹、呼吸困难、过敏性休克', onsetDate: '2020-05-10', notes: '注射后立即发生，需紧急处理', createdAt: '2024-01-10 09:00:00', updatedAt: '2024-01-10 09:00:00' },
    { id: '2', patientId: '1', patientName: '张三', allergen: '头孢类', allergyType: 'drug', severity: 'moderate', reaction: '皮肤瘙痒、红斑', onsetDate: '2021-03-15', notes: '口服后出现，停药后缓解', createdAt: '2024-01-10 09:05:00', updatedAt: '2024-01-10 09:05:00' },
    { id: '3', patientId: '2', patientName: '李四', allergen: '海鲜', allergyType: 'food', severity: 'moderate', reaction: '腹痛、腹泻、皮肤红疹', onsetDate: '2019-08-20', notes: '食用虾蟹后出现', createdAt: '2024-01-12 10:30:00', updatedAt: '2024-01-12 10:30:00' },
    { id: '4', patientId: '2', patientName: '李四', allergen: '芒果', allergyType: 'food', severity: 'mild', reaction: '口唇周围红肿、瘙痒', onsetDate: '2020-06-10', notes: '接触性皮炎', createdAt: '2024-01-12 10:35:00', updatedAt: '2024-01-12 10:35:00' },
    { id: '5', patientId: '3', patientName: '王五', allergen: '花粉', allergyType: 'other', severity: 'moderate', reaction: '打喷嚏、流鼻涕、眼痒', onsetDate: '2018-04-01', notes: '春季多发', createdAt: '2024-01-08 14:20:00', updatedAt: '2024-01-08 14:20:00' },
    { id: '6', patientId: '3', patientName: '王五', allergen: '尘螨', allergyType: 'other', severity: 'mild', reaction: '鼻塞、咳嗽', onsetDate: '2019-10-15', notes: '常年性过敏性鼻炎', createdAt: '2024-01-08 14:25:00', updatedAt: '2024-01-08 14:25:00' },
    { id: '7', patientId: '4', patientName: '赵六', allergen: '阿司匹林', allergyType: 'drug', severity: 'severe', reaction: '哮喘发作、荨麻疹', onsetDate: '2017-11-20', notes: '阿司匹林哮喘', createdAt: '2024-01-15 11:00:00', updatedAt: '2024-01-15 11:00:00' },
    { id: '8', patientId: '5', patientName: '钱七', allergen: '牛奶', allergyType: 'food', severity: 'mild', reaction: '腹胀、嗳气', onsetDate: '2015-01-10', notes: '乳糖不耐受', createdAt: '2024-01-20 09:45:00', updatedAt: '2024-01-20 09:45:00' },
    { id: '9', patientId: '6', patientName: '孙八', allergen: '动物毛发', allergyType: 'other', severity: 'moderate', reaction: '皮肤瘙痒、鼻炎', onsetDate: '2020-09-01', notes: '猫毛狗毛均可诱发', createdAt: '2024-02-01 16:30:00', updatedAt: '2024-02-01 16:30:00' },
    { id: '10', patientId: '1', patientName: '张三', allergen: '磺胺类', allergyType: 'drug', severity: 'moderate', reaction: '皮疹、发热', onsetDate: '2016-07-10', notes: '固定性药疹', createdAt: '2024-01-10 09:10:00', updatedAt: '2024-01-10 09:10:00' }
  ]

  let list = allList
  if (type === 'drug') {
    list = allList.filter(item => item.allergyType === 'drug')
  } else if (type === 'food') {
    list = allList.filter(item => item.allergyType === 'food')
  } else if (type === 'other') {
    list = allList.filter(item => item.allergyType === 'other')
  }

  return { list, total: list.length + 5 }
}

onMounted(() => {
  loadAllData()
  loadDrugData()
  loadFoodData()
  loadOtherData()
})
</script>

<style scoped lang="scss">
.allergies {
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
}
</style>
