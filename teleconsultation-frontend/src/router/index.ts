import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: DefaultLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'consultation',
        name: 'Consultation',
        component: () => import('@/views/Consultation.vue'),
        meta: { title: '会诊管理', icon: 'ChatDotRound' }
      },
      {
        path: 'consultation/apply',
        name: 'ConsultationApply',
        component: () => import('@/views/consultation/ConsultationApply.vue'),
        meta: { title: '发起会诊', icon: 'ChatDotRound', hidden: true }
      },
      {
        path: 'consultation/:id',
        name: 'ConsultationDetail',
        component: () => import('@/views/consultation/ConsultationDetail.vue'),
        meta: { title: '会诊详情', icon: 'ChatDotRound', hidden: true }
      },
      {
        path: 'patients',
        name: 'Patients',
        component: () => import('@/views/Patients.vue'),
        meta: { title: '患者管理', icon: 'User' }
      },
      {
        path: 'patients/:id',
        name: 'PatientDetail',
        component: () => import('@/views/patient/PatientDetail.vue'),
        meta: { title: '患者详情', icon: 'User', hidden: true }
      },
      {
        path: 'medical-records',
        name: 'MedicalRecords',
        component: () => import('@/views/patient/MedicalRecords.vue'),
        meta: { title: '病历管理', icon: 'Document' }
      },
      {
        path: 'examination-reports',
        name: 'ExaminationReports',
        component: () => import('@/views/patient/ExaminationReports.vue'),
        meta: { title: '检查报告', icon: 'DataAnalysis' }
      },
      {
        path: 'allergies',
        name: 'Allergies',
        component: () => import('@/views/patient/Allergies.vue'),
        meta: { title: '过敏史管理', icon: 'Warning' }
      },
      {
        path: 'doctors',
        name: 'Doctors',
        component: () => import('@/views/doctor/DoctorList.vue'),
        meta: { title: '医生管理', icon: 'Avatar' }
      },
      {
        path: 'doctors/:id',
        name: 'DoctorDetail',
        component: () => import('@/views/doctor/DoctorDetail.vue'),
        meta: { title: '医生详情', icon: 'Avatar', hidden: true }
      },
      {
        path: 'doctors/:id/schedule',
        name: 'DoctorSchedule',
        component: () => import('@/views/doctor/Schedule.vue'),
        meta: { title: '排班管理', icon: 'Calendar', hidden: true }
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/message/MessageCenter.vue'),
        meta: { title: '消息中心', icon: 'Bell' }
      },
      {
        path: 'announcements',
        name: 'Announcements',
        component: () => import('@/views/message/Announcements.vue'),
        meta: { title: '系统公告', icon: 'Warning' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
