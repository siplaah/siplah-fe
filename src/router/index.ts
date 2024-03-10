import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'
import Setting from '../views/Setting.vue'
import DataJabatan from '../views/DataJabatan.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/setting', component: Setting },
  { path: '/datajabatan', component: DataJabatan }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;