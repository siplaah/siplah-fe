<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/api/authStore';
import { useRouter } from 'vue-router';

import 'boxicons/css/boxicons.min.css'; // Impor CSS dari Boxicons

const auth = useAuthStore();
const router = useRouter();
const employeeName = computed(() => auth.employee?.name );
const employeeJabatan = computed(() => auth.employee?.jabatan );

const onLogout = async () => {
  try {
    await auth.logout();
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout failed', error);
  }
};
</script>

<template>
  <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
    <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
      <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
        <i class="bx bx-menu bx-sm"></i>
      </a>
    </div>

    <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
      <ul class="navbar-nav flex-row align-items-center ms-auto">
        <!-- User -->
        <li class="nav-item navbar-dropdown dropdown-user dropdown">
          <a class="nav-link dropdown-toggle hide-arrow d-flex align-items-center" data-bs-toggle="dropdown">
            <div class="avatar avatar-online me-2">
              <!-- Menggunakan ikon "user" dari Boxicons -->
              <i class='bx bx-user-circle bx-lg'></i>
            </div>

            <p class="mb-0"><b>Hai,</b> {{ employeeName }}</p>
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#">
                <div class="d-flex">
                  <div class="flex-shrink-0 me-3">
                    <div class="avatar avatar-online">
                      <!-- Menggunakan ikon "user" dari Boxicons -->
                      <i class='bx bx-user-circle bx-lg'></i>

                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <span class="fw-semibold d-block">{{ employeeName }}</span>
                    <small class="text-muted">{{ employeeJabatan }}</small>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <div class="dropdown-divider"></div>
            </li>
            <li>
              <a class="dropdown-item" href="/profil">
                <i class="bx bx-user me-2"></i>
                <span class="align-middle fw-bolder">My Profile</span>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="/profil/setting">
                <i class="bx bx-cog me-2"></i>
                <span class="align-middle fw-bolder">Settings</span>
              </a>
            </li>
            <li>
              <div class="dropdown-divider"></div>
            </li>
            <li>
              <a class="dropdown-item" @click.prevent="onLogout">
                <i class="bx bx-power-off me-2"></i>
                <span class="align-middle">Log Out</span>
              </a>
            </li>
          </ul>
        </li>
        <!--/ User -->
      </ul>
    </div>
  </nav>
</template>