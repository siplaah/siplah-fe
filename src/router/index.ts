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
  const { isAuthenticated, employee } = storeToRefs(authStore)

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/auth/login');
  } else if (to.meta.jabatan) {
    const userEmployee = employee.value;

    const allowedJabatan = Array.isArray(to.meta.jabatan) ? to.meta.jabatan : [];
    const userJabatan = userEmployee?.jabatan || '';

    if (!allowedJabatan.includes(userJabatan)) {
      next('/auth/unauthorized'); 
      return;
    }
  }
  next();
});

export default router