import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Overtime from '../views/Overtime.vue'
import TimeOff from '../views/TimeOff.vue'
import Meeting from '../views/Meeting.vue'
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';

const routes = [
  { path: '/', component: Login },
  {
    path: '/dashboard',
    components: {
      default: Dashboard,
      header: Navbar,
      sidebar: Sidebar,
      footer: Footer
    }
  },
  {
    path: '/overtimes',
    components: {
      default: Overtime,
      header: Navbar,
      sidebar: Sidebar,
      footer: Footer
    }
  },
  {
    path: '/time-off',
    components: {
      default: TimeOff,
      header: Navbar,
      sidebar: Sidebar,
      footer: Footer
    }
  },
  {
    path: '/meeting',
    components: {
      default: Meeting,
      header: Navbar,
      sidebar: Sidebar,
      footer: Footer
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
