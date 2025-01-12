import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { handleIncomingRedirect } from '@inrupt/solid-client-authn-browser'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartContents.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/ProductsView.vue'),
    },
    {
      path: '/products/:name',
      name: 'productsdetails',
      component: () => import('@/views/ProductDetails.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/superplus',
      name: 'superplus',
      component: () => import('@/views/StepIn.vue'),
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('@/views/SuccessMessage.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminPortal.vue'),
    },
  ],
})

router.beforeEach(async () => {
  await handleIncomingRedirect()
})

export default router
