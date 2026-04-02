import axios from 'axios'
import { useGlobalStore } from '../store'


// ======================================
// 1. 固定 baseURL
// ======================================
const baseURL = 'https://www.kaoiki.com:2248'

// ======================================
// 2. 接口地址字典
// ======================================
const API = {
    "invoke": "/invoke",
    "event-init": "/event-init/init",
    "novel": "/novel"
}

// ======================================
// 创建 axios 实例
// ======================================
const service = axios.create({
  baseURL,
  timeout: 300000
})

// 请求计数器：防止多个请求同时触发闪烁
let requestCount = 0

// 显示 Loading
const showLoading = () => {
  if (requestCount === 0) {
    window.$showLoading?.()
  }
  requestCount++
}

// 隐藏 Loading
const hideLoading = () => {
  requestCount--
  if (requestCount === 0) {
    window.$hideLoading?.()
  }
}

// ======================================
// 请求拦截：token + 开启 loading
// ======================================
service.interceptors.request.use(config => {

  showLoading()

  const store = useGlobalStore()
  let token = localStorage.getItem('token') || store.defaultToken

  if (token) {
    config.headers.token = token
  }
  return config
}, error => {
  hideLoading()
  return Promise.reject(error)
})

// ======================================
// 响应拦截：关闭 loading + 抛出错误码
// ======================================
service.interceptors.response.use(
  response => {
    hideLoading()
    return response.data
  },
  error => {
    
    // 抛出错误信息（含code）
    const errInfo = {
      code: error.response?.status || 999,
      msg: error.response?.data?.message || error.message || '请求失败',
      data: error.response?.data || null
    }
    hideLoading()
    return Promise.reject(errInfo)
  }
)

// ======================================
// 统一请求方法
// ======================================
export const request = {
  get(urlKey, params) {
    return service({ url: API[urlKey], method: 'get', params })
  },
  post(urlKey, data) {
    return service({ url: API[urlKey], method: 'post', data })
  },
  put(urlKey, data) {
    return service({ url: API[urlKey], method: 'put', data })
  },
  delete(urlKey, params) {
    return service({ url: API[urlKey], method: 'delete', params })
  }
}

export default service