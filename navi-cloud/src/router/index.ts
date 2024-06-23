import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
// import { setupLayouts } from 'virtual:generated-layouts';
// import generatedRoutes from 'virtual:generated-pages';

// const routes = setupLayouts(generatedRoutes);

// export const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes,
//   strict: true,
// });

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
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/Signup.vue'),
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
