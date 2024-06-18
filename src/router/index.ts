import { storeToRefs } from 'pinia';
import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from '~pages';
import { useAuthStore } from '../stores/api/authStore'

const routes = setupLayouts(generatedRoutes)
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore)

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/auth/login')
  } else {
    next() 
  }
})

export default router