import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: 'myfiles',
        name: 'Myfiles',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: 'mydisk',
        name: 'Mydisk',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: 'private',
        name: 'Private',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: 'trash',
        name: 'Trash',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('pages/DashboardPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
