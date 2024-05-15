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
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        { path: '/main/home', component: () => import('@/pages/Home.vue') }
      ],
    },
  ]
})

export default router
