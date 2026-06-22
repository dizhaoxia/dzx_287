<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon :size="28"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-value">{{ stat.value }}</p>
              <p class="stat-label">{{ stat.title }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>会诊趋势</span>
          </template>
          <div ref="chartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>科室分布</span>
          </template>
          <div ref="pieChartRef" class="chart-container pie-chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="recent-card">
      <template #header>
        <div class="card-header">
          <span>最近会诊</span>
          <el-button type="primary" link @click="$router.push('/consultation')">查看全部</el-button>
        </div>
      </template>
      <el-table :data="recentConsultations" stripe>
        <el-table-column prop="title" label="会诊主题" min-width="200" />
        <el-table-column prop="patientName" label="患者" width="120" />
        <el-table-column prop="doctorName" label="医生" width="120" />
        <el-table-column prop="department" label="科室" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status]" size="small">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { TagProps } from 'element-plus'
import type { Consultation } from '@/types'

const chartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
let pieChartInstance: echarts.ECharts | null = null

const stats = [
  { title: '今日会诊', value: 28, icon: 'ChatDotRound', color: '#409eff' },
  { title: '待处理', value: 12, icon: 'Clock', color: '#e6a23c' },
  { title: '今日医生', value: 45, icon: 'Avatar', color: '#67c23a' },
  { title: '患者总数', value: 1286, icon: 'User', color: '#f56c6c' }
]

const statusTypeMap: Record<string, TagProps['type']> = {
  pending: 'warning',
  ongoing: 'success',
  completed: 'info',
  cancelled: 'danger'
}

const statusTextMap: Record<string, string> = {
  pending: '待开始',
  ongoing: '进行中',
  completed: '已完成',
  cancelled: '已取消'
}

const recentConsultations: any[] = [
  {
    id: '1',
    title: '高血压患者远程复诊',
    patientId: 'p1',
    patientName: '张三',
    doctorId: 'd1',
    doctorName: '李医生',
    department: '心内科',
    status: 'ongoing',
    type: 'video',
    description: '高血压患者定期复诊',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00'
  },
  {
    id: '2',
    title: '糖尿病患者咨询',
    patientId: 'p2',
    patientName: '李四',
    doctorId: 'd2',
    doctorName: '王医生',
    department: '内分泌科',
    status: 'pending',
    type: 'text',
    description: '糖尿病用药咨询',
    createdAt: '2024-01-15 09:15:00',
    updatedAt: '2024-01-15 09:15:00'
  },
  {
    id: '3',
    title: '皮肤病专家会诊',
    patientId: 'p3',
    patientName: '王五',
    doctorId: 'd3',
    doctorName: '赵医生',
    department: '皮肤科',
    status: 'completed',
    type: 'video',
    description: '慢性湿疹专家会诊',
    createdAt: '2024-01-14 14:20:00',
    updatedAt: '2024-01-14 15:00:00'
  },
  {
    id: '4',
    title: '儿科常规检查',
    patientId: 'p4',
    patientName: '小明',
    doctorId: 'd4',
    doctorName: '陈医生',
    department: '儿科',
    status: 'completed',
    type: 'voice',
    description: '儿童常规健康检查',
    createdAt: '2024-01-14 10:00:00',
    updatedAt: '2024-01-14 10:30:00'
  }
]

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['会诊数量'] },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [{
      name: '会诊数量',
      type: 'line',
      smooth: true,
      data: [12, 19, 15, 22, 28, 18, 25],
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
        ])
      },
      lineStyle: { color: '#409eff', width: 2 },
      itemStyle: { color: '#409eff' }
    }]
  })
}

function initPieChart() {
  if (!pieChartRef.value) return
  pieChartInstance = echarts.init(pieChartRef.value)
  pieChartInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: '5%', left: 'center' },
    series: [{
      name: '科室分布',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: [
        { value: 30, name: '心内科' },
        { value: 25, name: '内分泌科' },
        { value: 20, name: '皮肤科' },
        { value: 15, name: '儿科' },
        { value: 10, name: '其他' }
      ],
      color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
    }]
  })
}

function handleResize() {
  chartInstance?.resize()
  pieChartInstance?.resize()
}

onMounted(() => {
  initChart()
  initPieChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  pieChartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    margin-bottom: 20px;

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }

      .stat-info {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin: 0 0 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin: 0;
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;

    .chart-container {
      height: 320px;

      &.pie-chart {
        height: 320px;
      }
    }
  }

  .recent-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
