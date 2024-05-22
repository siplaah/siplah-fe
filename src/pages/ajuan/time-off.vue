<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
  { tanggalMulai: '1 Maret 2024', tanggalSelesai: '4 Maret 2024', tipe: 'sakit', attachment: 'file4.pdf' },
  { tanggalMulai: '10 Maret 2024', tanggalSelesai: '14 Maret 2024', tipe: 'sakit', attachment: 'file5.pdf' },
  { tanggalMulai: '25 Maret 2024', tanggalSelesai: '27 Maret 2024', tipe: 'sakit', attachment: 'file1.pdf' },
  { tanggalMulai: '1 April 2024', tanggalSelesai: '5 April 2024', tipe: 'nikah', attachment: 'file2.pdf' },
  { tanggalMulai: '7 April 2024', tanggalSelesai: '8 April 2024', tipe: 'sakit', attachment: 'file3.pdf' }
]);

const getPdfPath = (filename: string) => {
  return `/assets/file/${filename}`;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Cuti</h4>
    <div class="row align-items-start">
      <div class="mb-3 text-end">
        <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#create">
          Tambah
        </button>
      </div>
    </div>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Selesai</th>
              <th>Tipe Cuti</th>
              <th>Attachment</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through your data to display each row -->
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.tanggalMulai }}</td>
              <td>{{ item.tanggalSelesai }}</td>
              <td>{{ item.tipe }}</td>
              <td>
                <a :href="getPdfPath(item.attachment)" target="_blank"><i class="bx bxs-file"></i> Lihat PDF</a>
              </td>
              <td>
                <div>
                  <span
                    class="badge bg-label-warning me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCenter"
                    ><i class="bx bx-edit-alt me-1"></i> Edit
                  </span>
                  <span
                    class="badge bg-label-danger me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#smallModal"
                    ><i class="bx bx-trash-alt me-1"></i> Hapus
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

    <!-- Modal Edit -->
    <div class="modal fade" id="modalCenter" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCenterTitle">Edit Data Pengajuan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-2">
              <div class="col mb-0">
                <label for="start_date" class="form-label">Tanggal Mulai</label>
                <input type="date" id="start_date" class="form-control" placeholder="DD / MM / YY" />
              </div>
              <div class="col mb-0">
                <label for="end_date" class="form-label">Tanggal Selesai</label>
                <input type="date" id="end_date" class="form-control" placeholder="DD / MM / YY" />
              </div>
            </div>
            <div class="row">
              <div class="col mt-3">
                <label for="tipe" class="form-label">Tipe Cuti</label>
                <select id="tipe" class="form-select">
                  <option>Tipe Cuti</option>
                  <option value="1">Cuti Tahunan</option>
                  <option value="2">Cuti Menikah</option>
                  <option value="3">Cuti Melahirkan</option>
                  <option value="4">Sakit</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col mt-3">
                <label for="formFile" class="form-label">Attachment</label>
                <input class="form-control" type="file" id="formFile" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary">Simpan</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Edit -->

    <!-- Modal Hapus -->
    <div class="modal fade" id="smallModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-center">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <h5>Apakah anda yakin igin menghapus data ini?</h5>
            <i class="bx bx-trash bx-tada" style="color: rgba(255, 0, 0, 0.6); font-size: 150px"></i>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="button" class="btn btn-primary">Ya</button>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tidak</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Hapus -->
  </div>
</template>
