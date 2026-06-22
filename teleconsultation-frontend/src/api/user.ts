import { post, get } from '@/utils/request'
import type { LoginParams, LoginResponse, UserInfo } from '@/types'

export function login(data: LoginParams) {
  return post<LoginResponse>('/auth/login', data)
}

export function getUserInfo() {
  return get<UserInfo>('/user/info')
}

export function logoutApi() {
  return post('/auth/logout')
}
