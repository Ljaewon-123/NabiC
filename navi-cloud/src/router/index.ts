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
      component: () => import('@/pages/Login.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/pages/Signup.vue'),
    },
    {
      path: '/main',
      name: 'Main',
      redirect: { name: 'Root' },
      component: () => import('@/layouts/MainLayout.vue'),
      beforeEnter: () => {
        const { getAccessToken } = useAuthStore()

        const token = getAccessToken()
        if(!token) return { name: 'Login' }
      },
      children: [
        { 
          path: '/main/root', 
          name: 'Root',
          component: () => import('@/pages/Root.vue') 
        },
        { 
          path: '/main/path:directory', 
          name: 'Path',
          component: () => import('@/pages/Path.vue') 
        },
      ],
    },
    {
      path: '/:path(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/NotFoundView.vue')
    },
  ]
})

export default router
