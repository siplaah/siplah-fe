<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
  { tanggal: '25 Maret 2024', waktuMulai: '07:00', waktuSelesai: '22:00', attachment: 'file1.pdf' },
  { tanggal: '31 Maret 2024', waktuMulai: '08:00', waktuSelesai: '21:00', attachment: 'file2.pdf' },
  { tanggal: '4 April 2024', waktuMulai: '08:00', waktuSelesai: '02:00', attachment: 'file3.pdf' },
  { tanggal: '5 April 2024', waktuMulai: '07:00', waktuSelesai: '23:00', attachment: 'file4.pdf' },
  { tanggal: '6 April 2024', waktuMulai: '08:00', waktuSelesai: '23:00', attachment: 'file5.pdf' }
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
              <td>{{ item.tanggal }}</td>
              <td>{{ item.waktuMulai }}</td>
              <td>{{ item.waktuSelesai }}</td>
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
            <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevrons-left"></i></a>
          </li>
          <li class="page-item">
            <a class="page-link" href="javascript:void(0);">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="javascript:void(0);">2</a>
          </li>
          <li class="page-item active">
            <a class="page-link" href="javascript:void(0);">3</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="javascript:void(0);">4</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="javascript:void(0);">5</a>
          </li>
          <li class="page-item next">
            <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevrons-right"></i></a>
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
            <div class="row">
              <div class="col mb-3">
                <label for="start_date" class="form-label">Tanggal</label>
                <input type="date" id="start_date" class="form-control" placeholder="DD / MM / YY" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="start_time" class="form-label">Waktu Mulai</label>
                <input type="time" id="start_time" class="form-control" placeholder="HH : MM" />
              </div>
              <div class="col mb-0">
                <label for="end_time" class="form-label">Waktu Selesai</label>
                <input type="time" id="end_time" class="form-control" placeholder="HH : MM" />
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
            <h5 >Apakah anda yakin igin menghapus data ini?</h5> 
            <i class='bx bx-trash bx-tada' style='color:rgba(255,0,0,0.6); font-size: 150px;' ></i>
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
