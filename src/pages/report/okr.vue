<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
  { month: 'Mei', karyawan: 'Albert Cook', type: 'should stay below', target: '80', realisasi: '81' },
  { month: 'Mei', karyawan: 'Barry Hunter', type: 'should stay above', target: '80', realisasi: '90' },
  { month: 'Mei', karyawan: 'Trevor Baker', type: 'should decrease to', target: '80', realisasi: '88' },
  { month: 'Mei', karyawan: 'Jerry Milton', type: 'should increase to', target: '80', realisasi: '85' },
]); 

</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Report /</span> OKR</h4>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Bulan</th>
              <th>Karyawan</th>
              <th>Target</th>
              <th>Total Nilai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through your data to display each row -->
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.month }}</td>
              <td>{{ item.karyawan }}</td>
              <td>{{ item.target }}</td>
              <td><span class="badge rounded-pill bg-success">{{ item.realisasi }}</span></td>
              <td>
                <div>
                  <span
                    class="badge bg-label-primary me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCenter"
                    ><i class="bx bx-show-alt me-1"></i> View
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
