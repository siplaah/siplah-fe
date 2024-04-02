import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'
import Setting from '../views/Setting.vue'
import Setting2 from '../views/Setting2.vue'
import DataJabatan from '../views/DataJabatan.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/setting', component: Setting },
  { path: '/setting2', component: Setting2 },
  { path: '/datajabatan', component: DataJabatan }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;