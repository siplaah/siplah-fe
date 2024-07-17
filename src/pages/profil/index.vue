<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/api/authStore';

const apiAuthStore = useAuthStore();
const { employee } = storeToRefs(apiAuthStore);
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Account /</span> Profile User</h4>

    <!-- Basic Bootstrap Table -->
    <div class="card">
      <br />
      <div class="row">
        <!-- Basic -->
        <div class="col-md-6">
          <div class="card mb-4">
            <h5 class="card-header">Profile</h5>
            <!-- <img src="" alt class="rounded-circle mx-auto" height="160px" width="160px" /> -->
            <div class="card-body demo-vertical-spacing demo-only-element">
              <div class="form-Username-toggle">
                <h6>Nama</h6>
                <div class="input-group text-primary fs-5">
                  {{ employee?.name }}
                </div>
              </div>
              <div class="form-Username-toggle">
                <h6>Jabatan</h6>
                <div class="input-group text-primary fs-5">
                  <p>{{ employee?.jabatan }}</p>
                </div>
              </div>
              <div class="form-Email-toggle">
                <h6>Keterangan</h6>
                <div class="input-group text-primary fs-5">
                  <p>{{ employee?.keterangan }}</p>
                </div>
              </div>
              <div class="form-Nama-toggle">
                <h6>Tempat Lahir</h6>
                <div class="input-group text-primary fs-5">
                  <p>{{ employee?.tempat_lahir }}</p>
                </div>
              </div>
              <div class="form-Username-toggle">
                <h6>Pendidikan</h6>
                <div class="input-group text-primary fs-5">
                  <p>{{ employee?.pendidikan }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Merged -->
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body demo-vertical-spacing demo-only-element">
              <div class="form-gender-toggle">
                <h6>Email</h6>
                <div class="input-group text-primary fs-5">
                  <p>{{ employee?.email }}</p>
                </div>
              </div>
              <div class="form-Username-toggle">
                <h6>Gender</h6>
                <div class="input-group text-primary fs-5">
                  <p>{{ employee?.gender }}</p>
                </div>
              </div>
              <div class="form-Username-toggle">
                <h6>Mulai Bekerja</h6>
                <div class="input-group text-primary fs-5">
                  <p>{{ employee?.start_working }}</p>
                </div>
              </div>
              <div class="form-posisi-toggle">
                <h6>Tanggal Lahir</h6>
                <div class="input-group text-primary fs-5">
                  <p>{{ employee?.tanggal_lahir }}</p>
                </div>
              </div>
              <div class="form-Username-toggle">
                <h6>Alamat</h6>
                <div class="input-group text-primary fs-5">
                  <p>{{ employee?.alamat }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <br />
  </div>
</template>
