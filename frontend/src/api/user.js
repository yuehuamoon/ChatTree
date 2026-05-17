import request from './index.js';


export const userApi = {
    // 登录
    login(data) {
        return request.post('/user/login', data)
    },

    // 注册
    register(data) {
        return request.post('/user/register', data)
    },

    // 删除用户
    deleteUser(email) {
        return request.post('/user/delete', { email })
    },

    // 更新用户
    updateUser(data) {
        return request.post('/user/update', data)
    },

    // 获取用户统计
    getUserStats() {
        return request.get('/user/count')
    },

    // 身份验证
    identify(data) {
        return request.post('/user/identify', data)
    }
}