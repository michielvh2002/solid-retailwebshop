import { createRouter, createWebHistory } from 'vue-router'
import Overview from '@/views/RetailerOverview.vue'
import { getDefaultSession, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Overview,
      meta: { requiresAuth: true, hideHeader: false },
    },
    {
      path: '/addretailer',
      name: 'addretailer',
      component: () => import('@/views/AddRetailer.vue'),
      meta: { requiresAuth: true, hideHeader: false },
    },
    {
      path: '/setuppod',
      name: 'setuppod',
      component: () => import('@/views/SetupPod.vue'),
      meta: { requiresAuth: true, hideHeader: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { requiresAuth: false, hideHeader: true },
    },
  ],
})

router.beforeEach(async (to) => {
  await handleIncomingRedirect()
  if (to.meta.requiresAuth && !getDefaultSession().info.isLoggedIn) {
    return { name: 'login' }
  }
})

export default router
