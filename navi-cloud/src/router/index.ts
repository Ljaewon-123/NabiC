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
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('@/pages/index.vue') }
      ],
    },
  ]
})

export default router
