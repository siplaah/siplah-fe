<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
  { 
  nama: 'Arila', 
  tanggal: '25 Maret 2024', 
  presensiMasuk: '07:00', 
  presensiKeluar: '22:00'  
},
  { 
    nama: 'Ajeng', 
    tanggal: '31 Maret 2024', 
    presensiMasuk: '08:00', 
    presensiKeluar: '21:00' 
  },
]); 


</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Absensi Karyawan</h4>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Tanggal</th>
              <th>Presensi Masuk</th>
              <th>Presensi Keluar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through your data to display each row -->
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.nama }}</td>
              <td>{{ item.tanggal }}</td>
              <td>{{ item.presensiMasuk }}</td>
              <td>{{ item.presensiKeluar }}</td>
  
              <td>
                <div>
                  <span
                    class="badge bg-label-success me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCenter"
                    ><i class="bx me-1"></i> Detail
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
    <!--/ Striped Rows -->
  </div>
</template>
