import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../pages/Test.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router