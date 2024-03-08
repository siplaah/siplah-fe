import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'
import Setting from '../views/Setting.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/', component: Setting }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;