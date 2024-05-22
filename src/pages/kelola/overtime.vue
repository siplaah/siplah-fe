<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
  { karyawan: 'Albert Cook', tanggal: '25 Maret 2024', waktuMulai: '07:00', waktuSelesai: '22:00', attachment: 'file1.pdf' },
  { karyawan: 'Barry Hunter', tanggal: '31 Maret 2024', waktuMulai: '08:00', waktuSelesai: '21:00', attachment: 'file2.pdf' },
  { karyawan: 'Trevor Baker', tanggal: '4 April 2024', waktuMulai: '08:00', waktuSelesai: '02:00', attachment: 'file3.pdf' },
  { karyawan: 'Albert Cook', tanggal: '5 April 2024', waktuMulai: '07:00', waktuSelesai: '23:00', attachment: 'file4.pdf' },
  { karyawan: 'Jerry Milton', tanggal: '6 April 2024', waktuMulai: '08:00', waktuSelesai: '23:00', attachment: 'file5.pdf' }
]); 

const getPdfPath = (filename: string) => {
  return `/assets/file/${filename}`;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Lembur</h4>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Karyawan</th>
              <th>Tanggal</th>
              <th>Waktu Mulai</th>
              <th>Waktu Selesai</th>
              <th>Attachment</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through your data to display each row -->
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.karyawan }}</td>
              <td>{{ item.tanggal }}</td>
              <td>{{ item.waktuMulai }}</td>
              <td>{{ item.waktuSelesai }}</td>
              <td>
                <a :href="getPdfPath(item.attachment)" target="_blank"><i class="bx bxs-file"></i> Lihat PDF</a>
              </td>
              <td>
                <div>
                  <span
                    class="badge bg-label-success me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCenter"
                    ><i class="bx bx-check me-1"></i> Setujui
                  </span>
                  <span
                    class="badge bg-label-danger me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#smallModal"
                    ><i class="bx bx-x me-1"></i> Tolak
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination pagination-sm justify-content-center mt-3">
          <li class="page-item prev">
            <a class="page-link"  ><i class="tf-icon bx bx-chevrons-left"></i></a>
          </li>
          <li class="page-item">
            <a class="page-link"  >1</a>
          </li>
          <li class="page-item">
            <a class="page-link"  >2</a>
          </li>
          <li class="page-item active">
            <a class="page-link"  >3</a>
          </li>
          <li class="page-item">
            <a class="page-link"  >4</a>
          </li>
          <li class="page-item">
            <a class="page-link"  >5</a>
          </li>
          <li class="page-item next">
            <a class="page-link"  ><i class="tf-icon bx bx-chevrons-right"></i></a>
          </li>
        </ul>
      </nav>
    </div>
    <!--/ Striped Rows -->
  </div>
</template>
