<template>
  <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <div class="app-brand demo">
      <a href="/" class="app-brand-link">
        <span class="app-brand-logo demo">
          <!-- SVG logo omitted for brevity -->
        </span>
        <span class="app-brand-text demo menu-text fw-bolder ms-2">SIPLAH</span>
      </a>

      <a class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
        <i class="bx bx-chevron-left bx-sm align-middle"></i>
      </a>
    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-1">
      <li  class="menu-item" :class="{ active: $route.path === '/' }">
        <router-link to="/" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div>Dashboard</div>
        </router-link>
      </li>
      <li v-if="isAuthorized('dataMaster')" class="menu-item" :class="{ open: isDataMasterOpen }">
        <a class="menu-link menu-toggle" @click="toggleDropdown('dataMaster')">
          <i class="menu-icon tf-icons bx bx-cube-alt"></i>
          <div data-i18n="Data Master">Data Master</div>
        </a>
        <ul class="menu-sub" v-show="isDataMasterOpen">
          <li v-if="isAuthorized('dataJabatan')" class="menu-item" :class="{ active: $route.path === '/master/data-jabatan' }">
            <router-link to="/master/data-jabatan" class="menu-link">
              <div class="fw-bolder">Data Jabatan</div>
            </router-link>
          </li>
          <li v-if="isAuthorized('dataKaryawan')" class="menu-item" :class="{ active: $route.path === '/master/data-karyawan' }">
            <router-link to="/master/data-karyawan" class="menu-link">
              <div class="fw-bolder">Data Karyawan</div>
            </router-link>
          </li>
          <li v-if="isAuthorized('dataProject')" class="menu-item" :class="{ active: $route.path === '/master/data-project' }">
            <router-link to="/master/data-project" class="menu-link">
              <div class="fw-bolder">Data Project</div>
            </router-link>
          </li>
          <li v-if="isAuthorized('dataKeyResult')" class="menu-item" :class="{ active: $route.path === '/master/key-result' }">
            <router-link to="/master/key-result" class="menu-link">
              <div>Key Result</div>
            </router-link>
          </li>
        </ul>
      </li>
      <li v-if="isAuthorized('presensi')" class="menu-item" :class="{ active: $route.path === '/absensi/absensi' }">
        <router-link to="/absensi/absensi" class="menu-link">
          <i class="menu-icon tf-icons bx bx-time"></i>
          <div class="fw-bolder">Presensi</div>
        </router-link>
      </li>
      <li v-if="isAuthorized('dailyReport')" class="menu-item" :class="{ active: $route.path === '/absensi/daily-report' }">
        <router-link to="/absensi/daily-report" class="menu-link">
          <i class="menu-icon tf-icons bx bxs-report"></i>
          <div class="fw-bolder">Daily Report</div>
        </router-link>
      </li>
      <li class="menu-item" :class="{ active: $route.path === '/ajuan/overtime' }">
        <router-link to="/ajuan/overtime" class="menu-link">
          <i class="menu-icon tf-icons bx bxs-hourglass"></i>
          <div>Lembur</div>
        </router-link>
      </li>
      <li class="menu-item" :class="{ active: $route.path === '/ajuan/time-off' }">
        <router-link to="/ajuan/time-off" class="menu-link">
          <i class="menu-icon tf-icons bx bx-pause-circle"></i>
          <div>Cuti</div>
        </router-link>
      </li>
      <li v-if="isAuthorized('kelolaAbsensi')" class="menu-item" :class="{ open: isKelolaAbsensiOpen }">
        <a class="menu-link menu-toggle" @click="toggleDropdown('dataAbsen')">
          <i class="menu-icon tf-icons bx bx-box"></i>
          <div data-i18n="Kelola Absensi">Kelola Absensi</div>
        </a>
        <ul class="menu-sub" v-show="isKelolaAbsensiOpen">
          <li v-if="isAuthorized('readpresensi')" class="menu-item" :class="{ active: $route.path === '/kelola/absensi' }">
            <router-link to="/kelola/absensi" class="menu-link">
              <div class="fw-bolder">Absensi Karyawan</div>
            </router-link>
          </li>
          <li v-if="isAuthorized('readdailyReport')" class="menu-item" :class="{ active: $route.path === '/report/daily-report' }">
            <router-link to="/report/daily-report" class="menu-link">
              <div class="fw-bolder">Report Karyawan</div>
            </router-link>
          </li>
          <li v-if="isAuthorized('lembur')" class="menu-item" :class="{ active: $route.path === '/kelola/overtime' }">
            <router-link to="/kelola/overtime" class="menu-link">
              <div>Review Lembur</div>
            </router-link>
          </li>
          <li v-if="isAuthorized('cuti')" class="menu-item" :class="{ active: $route.path === '/kelola/time-off' }">
            <router-link to="/kelola/time-off" class="menu-link">
              <div>Ajuan Cuti</div>
            </router-link>
          </li>
        </ul>
      </li>
      <li v-if="isAuthorized('okr')" class="menu-item" :class="{ active: $route.path === '/report/okr' }">
        <router-link to="/report/okr" class="menu-link">
          <i class="menu-icon tf-icons bx bx-collection"></i>
          <div>Review OKR</div>
        </router-link>
      </li>
      <li v-if="isAuthorized('meeting')" class="menu-item" :class="{ active: $route.path === '/meeting/meeting' }">
        <router-link to="/meeting/meeting" class="menu-link">
          <i class="menu-icon tf-icons bx bx-calendar-event"></i>
          <div>Meeting</div>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/api/authStore';

export default defineComponent({
  data() {
    return {
      isDataMasterOpen: false,
      isKelolaAbsensiOpen: false,
    };
  },
  methods: {
    toggleDropdown(menu: string) {
      if (menu === 'dataMaster') {
        this.isDataMasterOpen = !this.isDataMasterOpen;
      }
      if (menu === 'dataAbsen') {
        this.isKelolaAbsensiOpen = !this.isKelolaAbsensiOpen;
      }
    },
    toggleMenu() {
      // Logic to toggle the entire sidebar menu (e.g., for mobile view)
    },
    isAuthorized(menu: string): boolean {
      const authStore = useAuthStore();
      const employeeJabatan = authStore.employee?.jabatan ?? '';

      // Define the allowed roles for each menu item
      const rolePermissions: { [key: string]: string[] } = {
        // dashboard: ['HRD', 'PM', 'CTO'],
        dataMaster: ['HRD', 'CTO'],
        dataJabatan: ['HRD','CTO'],
        dataProject: ['HRD', 'CTO'],
        dataKaryawan: ['HRD', 'CTO'],
        dataKeyResult: ['HRD'],
        presensi: ['UIUX', 'HRD', 'PM','Frontend'],
        dailyReport: ['UIUX', 'HRD', 'Frontend'],
        readpresensi: ['HRD', 'PM', 'CTO'],
        readdailyReport: ['HRD', 'PM', 'CTO'],
        lembur: ['HRD', 'CTO','Frontend'],
        cuti: ['HRD', 'CTO', 'Frontend'],
        kelolaAbsensi: ['HRD', 'CTO', 'PM'],
        okr: ['HRD', 'PM', 'CTO'],
        meeting: ['HRD', 'PM'],
      };

      const allowedRoles = rolePermissions[menu];
      return allowedRoles ? allowedRoles.includes(employeeJabatan) : false;
    },
  },
});
</script>

<style scoped></style>
