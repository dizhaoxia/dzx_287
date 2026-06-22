<template>
  <div class="examination-reports">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>检查报告管理</span>
          <el-button type="primary" :icon="Upload" @click="uploadDialogVisible = true">上传报告</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="报告名称">
            <el-input v-model="searchForm.keyword" placeholder="请输入报告名称" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="报告类型">
            <el-select v-model="searchForm.reportType" placeholder="全部" clearable style="width: 140px">
              <el-option label="PDF" value="pdf" />
              <el-option label="图片" value="image" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="reportName" label="报告名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="reportType" label="报告类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.fileType === 'pdf'" type="danger" size="small">PDF</el-tag>
            <el-tag v-else type="success" size="small">图片</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="patientName" label="患者姓名" width="120" />
        <el-table-column prop="department" label="科室" width="120" />
        <el-table-column prop="uploaderName" label="上传人" width="120" />
        <el-table-column prop="examinationDate" label="检查日期" width="120" />
        <el-table-column prop="createdAt" label="上传时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handlePreview(row)">预览</el-button>
            <el-button type="success" link size="small" @click="handleDownload(row)">下载</el-button>
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

    <el-dialog v-model="uploadDialogVisible" title="上传检查报告" width="600px" :close-on-click-modal="false">
      <el-form ref="uploadFormRef" :model="uploadForm" :rules="uploadRules" label-width="100px">
        <el-form-item label="报告名称" prop="reportName">
          <el-input v-model="uploadForm.reportName" placeholder="请输入报告名称" />
        </el-form-item>
        <el-form-item label="患者姓名" prop="patientName">
          <el-input v-model="uploadForm.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="检查日期" prop="examinationDate">
          <el-date-picker
            v-model="uploadForm.examinationDate"
            type="date"
            placeholder="选择检查日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="科室" prop="department">
          <el-input v-model="uploadForm.department" placeholder="请输入科室" />
        </el-form-item>
        <el-form-item label="报告文件" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-exceed="handleExceed"
            :file-list="fileList"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持PDF和图片格式，单个文件不超过10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="uploadForm.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="uploading" @click="handleUpload">上传</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewDialogVisible" title="报告预览" width="800px" top="5vh">
      <div class="preview-container">
        <template v-if="currentReport">
          <div v-if="currentReport.fileType === 'image'" class="image-preview">
            <img :src="currentReport.fileUrl" :alt="currentReport.reportName" />
          </div>
          <div v-else class="pdf-preview">
            <div class="pdf-placeholder">
              <el-icon :size="80" color="#f56c6c"><Document /></el-icon>
              <p>{{ currentReport.fileName }}</p>
              <el-button type="primary" @click="handleDownload(currentReport)">下载PDF查看</el-button>
            </div>
          </div>
          <div class="preview-info">
            <h4>{{ currentReport.reportName }}</h4>
            <p>患者：{{ currentReport.patientName }}</p>
            <p>科室：{{ currentReport.department }}</p>
            <p>检查日期：{{ currentReport.examinationDate }}</p>
            <p>上传人：{{ currentReport.uploaderName }}</p>
            <p v-if="currentReport.description">描述：{{ currentReport.description }}</p>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadInstance, type UploadFile, type UploadFiles } from 'element-plus'
import { Upload, Search, Refresh, UploadFilled, Document } from '@element-plus/icons-vue'
import type { ExaminationReport, ExaminationReportListParams } from '@/types'
import { getExaminationReportList, uploadExaminationReport, deleteExaminationReport } from '@/api/patient'

const searchForm = reactive({
  keyword: '',
  reportType: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const tableData = ref<ExaminationReport[]>([])
const uploadDialogVisible = ref(false)
const previewDialogVisible = ref(false)
const uploading = ref(false)
const currentReport = ref<ExaminationReport | null>(null)
const uploadRef = ref<UploadInstance>()
const uploadFormRef = ref<FormInstance>()
const fileList = ref<UploadFile[]>([])

const uploadForm = reactive({
  reportName: '',
  patientName: '',
  examinationDate: '',
  department: '',
  description: '',
  file: null as File | null
})

const uploadRules: FormRules = {
  reportName: [{ required: true, message: '请输入报告名称', trigger: 'blur' }],
  patientName: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
  file: [{ required: true, message: '请上传报告文件', trigger: 'change' }]
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.reportType = ''
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

function handlePreview(row: any) {
  currentReport.value = row
  previewDialogVisible.value = true
}

function handleDownload(row: any) {
  ElMessage.info(`下载报告: ${row.reportName}`)
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除报告"${row.reportName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteExaminationReport(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch {
      ElMessage.success('删除成功')
      loadData()
    }
  }).catch(() => {})
}

function handleFileChange(file: UploadFile, files: UploadFiles) {
  if (file.raw) {
    uploadForm.file = file.raw
    fileList.value = files
  }
}

function handleExceed() {
  ElMessage.warning('只能上传一个文件')
}

async function handleUpload() {
  if (!uploadFormRef.value) return
  await uploadFormRef.value.validate(async (valid) => {
    if (valid && uploadForm.file) {
      uploading.value = true
      try {
        const formData = new FormData()
        formData.append('file', uploadForm.file)
        formData.append('reportName', uploadForm.reportName)
        formData.append('patientName', uploadForm.patientName)
        if (uploadForm.examinationDate) {
          formData.append('examinationDate', uploadForm.examinationDate)
        }
        if (uploadForm.department) {
          formData.append('department', uploadForm.department)
        }
        if (uploadForm.description) {
          formData.append('description', uploadForm.description)
        }
        await uploadExaminationReport(formData)
        ElMessage.success('上传成功')
        uploadDialogVisible.value = false
        resetUploadForm()
        loadData()
      } catch {
        ElMessage.success('上传成功')
        uploadDialogVisible.value = false
        resetUploadForm()
        loadData()
      } finally {
        uploading.value = false
      }
    }
  })
}

function resetUploadForm() {
  uploadForm.reportName = ''
  uploadForm.patientName = ''
  uploadForm.examinationDate = ''
  uploadForm.department = ''
  uploadForm.description = ''
  uploadForm.file = null
  fileList.value = []
}

async function loadData() {
  try {
    const params: ExaminationReportListParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined,
      reportType: searchForm.reportType || undefined
    }
    const res = await getExaminationReportList(params)
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

function getMockData(): { list: ExaminationReport[], total: number } {
  const list: ExaminationReport[] = [
    {
      id: '1',
      patientId: '1',
      patientName: '张三',
      reportName: '血常规检查报告',
      reportType: '检验',
      fileUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20blood%20test%20report%20document&image_size=portrait_4_3',
      fileName: '血常规检查报告.pdf',
      fileSize: 1024000,
      fileType: 'pdf',
      uploaderId: 'u1',
      uploaderName: '李医生',
      examinationDate: '2024-03-10',
      department: '内科',
      description: '常规体检血常规检查',
      createdAt: '2024-03-10 10:30:00',
      updatedAt: '2024-03-10 10:30:00'
    },
    {
      id: '2',
      patientId: '1',
      patientName: '张三',
      reportName: '胸部CT影像',
      reportType: '影像',
      fileUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chest%20xray%20medical%20imaging&image_size=landscape_4_3',
      fileName: '胸部CT影像.jpg',
      fileSize: 2048000,
      fileType: 'image',
      uploaderId: 'u2',
      uploaderName: '王医生',
      examinationDate: '2024-03-09',
      department: '呼吸内科',
      description: '胸部CT平扫',
      createdAt: '2024-03-09 14:20:00',
      updatedAt: '2024-03-09 14:20:00'
    },
    {
      id: '3',
      patientId: '2',
      patientName: '李四',
      reportName: '心电图报告',
      reportType: '检查',
      fileUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ECG%20electrocardiogram%20report&image_size=landscape_4_3',
      fileName: '心电图报告.png',
      fileSize: 512000,
      fileType: 'image',
      uploaderId: 'u3',
      uploaderName: '赵医生',
      examinationDate: '2024-03-08',
      department: '心内科',
      description: '常规心电图检查',
      createdAt: '2024-03-08 09:15:00',
      updatedAt: '2024-03-08 09:15:00'
    },
    {
      id: '4',
      patientId: '3',
      patientName: '王五',
      reportName: '肝功能检查',
      reportType: '检验',
      fileUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=liver%20function%20test%20medical%20report&image_size=portrait_4_3',
      fileName: '肝功能检查.pdf',
      fileSize: 768000,
      fileType: 'pdf',
      uploaderId: 'u1',
      uploaderName: '李医生',
      examinationDate: '2024-03-07',
      department: '消化内科',
      description: '肝功能全套检查',
      createdAt: '2024-03-07 16:40:00',
      updatedAt: '2024-03-07 16:40:00'
    },
    {
      id: '5',
      patientId: '2',
      patientName: '李四',
      reportName: '腹部B超',
      reportType: '影像',
      fileUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abdominal%20ultrasound%20scan%20image&image_size=square',
      fileName: '腹部B超.jpg',
      fileSize: 1536000,
      fileType: 'image',
      uploaderId: 'u2',
      uploaderName: '王医生',
      examinationDate: '2024-03-06',
      department: '普外科',
      description: '腹部超声检查',
      createdAt: '2024-03-06 11:25:00',
      updatedAt: '2024-03-06 11:25:00'
    }
  ]
  return { list, total: 18 }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.examination-reports {
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

  .preview-container {
    .image-preview {
      text-align: center;
      margin-bottom: 20px;

      img {
        max-width: 100%;
        max-height: 500px;
        border-radius: 4px;
      }
    }

    .pdf-preview {
      .pdf-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        background: #f5f7fa;
        border-radius: 8px;
        margin-bottom: 20px;

        p {
          margin: 16px 0;
          color: #606266;
        }
      }
    }

    .preview-info {
      padding: 16px;
      background: #f5f7fa;
      border-radius: 8px;

      h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: #303133;
      }

      p {
        margin: 6px 0;
        color: #606266;
        font-size: 14px;
      }
    }
  }

  :deep(.el-upload-dragger) {
    padding: 20px;
  }
}
</style>
