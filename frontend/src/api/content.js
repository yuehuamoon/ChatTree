import request from './index.js';

const CONTENT_BASE = '/content'

export const contentApi = {

    getContent() {
        return request.post(`${CONTENT_BASE}/meetList`)
    },
    publishContent(data){
        return request.post(`${CONTENT_BASE}/publish`, data)
    },



}