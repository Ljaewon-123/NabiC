import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: {
        name: 'Login'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      beforeEnter: () => {
        const { getAccessToken } = useAuthStore()
        const token = getAccessToken()
        if(token) return { name: 'Main' }

      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/Signup.vue'),
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('@/views/TestView.vue'),
    },
    {
      path: '/main',
      name: 'Main',
      redirect: { name: 'Root' },
      component: () => import('@/views/MainLayout.vue'),
      beforeEnter: () => {
        const { getAccessToken } = useAuthStore()

        const token = getAccessToken()
        if(!token) return { name: 'Login' }
      },
      children: [
        { 
          path: '/main/root', 
          name: 'Root',
          meta: { directory: '/' },
          component: () => import('@/views/files/RootView.vue')
        },
        { 
          path: '/main/path/:folderName/dp/:directory', 
          name: 'Path',
          component: () => import('@/views/files/FolderContents.vue') 
        },
      ],
    },
    {
      path: '/:path(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    },
  ]
})

export default router
