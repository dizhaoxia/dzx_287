<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <el-icon :size="48" color="#409eff"><Monitor /></el-icon>
        <h1>远程会诊系统</h1>
        <p>Teleconsultation Platform</p>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <div class="forgot-password">
            <a href="javascript:;">忘记密码？</a>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <p>演示账号：admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores'
import { login } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  remember: false
})

const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  if (!loginFormRef.value) return
  
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const res: any = await login({
          username: loginForm.username,
          password: loginForm.password
        })
        if (res.code === 0 || res.code === 200) {
          const { token, user } = res.data
          userStore.setToken(token)
          userStore.setUserInfo({
            id: user.id,
            username: user.username,
            name: user.realName || user.username,
            role: user.role,
            phone: user.phoneNumber,
            email: user.email,
            department: user.department
          })
          ElMessage.success('登录成功')
          router.push('/dashboard')
        }
      } catch (error: any) {
        console.error('登录失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;

  h1 {
    margin: 16px 0 8px;
    font-size: 24px;
    color: #303133;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }
}

.login-form {
  .forgot-password {
    text-align: right;

    a {
      color: #409eff;
      text-decoration: none;
      font-size: 14px;
    }
  }

  .login-btn {
    width: 100%;
  }
}

.login-footer {
  margin-top: 20px;
  text-align: center;

  p {
    font-size: 12px;
    color: #c0c4cc;
    margin: 0;
  }
}
</style>
