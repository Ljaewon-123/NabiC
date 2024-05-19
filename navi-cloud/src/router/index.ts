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
      redirect: { name: 'Home' },
      component: () => import('@/layouts/MainLayout.vue'),
      beforeEnter: () => {
        const token = localStorage.getItem('vtoken')
        if(!token) return { name: 'Login' }
      },
      children: [
        { 
          path: '/main/home', 
          name: 'Home',
          component: () => import('@/pages/Home.vue') 
        }
      ],
    },
  ]
})

export default router
