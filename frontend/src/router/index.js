import { createRouter, createWebHistory } from 'vue-router'
import index from '@/views/index.vue'
import login from '@/views/login.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
    },
  ],
})

export default router
