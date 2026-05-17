// src/api/index.js
import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
    baseURL: '/api',  // 统一前缀
    timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 自动添加 token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        if (response.data.code === 200) {
            return response.data
        }
        return Promise.reject(response.data)
    },
    error => {
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

export default request;
export * from './user';