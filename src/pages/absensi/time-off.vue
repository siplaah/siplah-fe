<script setup lang="ts"></script>
<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Cuti</h4>

    <!-- Striped Rows -->
    <div class="card">
      <!-- <h5 class="card-header">Striped rows</h5> -->
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Selesai</th>
              <th>Tipe</th>
              <th>Attachment</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr>
              <td>1</td>
              <td>12 April 2024</td>
              <td>15 April 2024</td>
              <td>Sakit</td>
              <td><i class="bx bxs-file"></i></td>
              <td>
                <div>
                  <!-- <span class="badge bg-label-success me-1"><i class="bx bx-detail me-1"></i> Detail </span> -->
                  <span class="badge bg-label-warning me-1"><i class="bx bx-edit-alt me-1"></i> Edit </span>
                  <span class="badge bg-label-danger me-1"><i class="bx bx-trash-alt me-1"></i> Hapus </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>12 April 2024</td>
              <td>15 April 2024</td>
              <td>Sakit</td>
              <td><i class="bx bxs-file"></i></td>
              <td>
                <div>
                  <!-- <span class="badge bg-label-success me-1"><i class="bx bx-detail me-1"></i> Detail </span> -->
                  <span class="badge bg-label-warning me-1"><i class="bx bx-edit-alt me-1"></i> Edit </span>
                  <span class="badge bg-label-danger me-1"><i class="bx bx-trash-alt me-1"></i> Hapus </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>12 April 2024</td>
              <td>15 April 2024</td>
              <td>Sakit</td>
              <td><i class="bx bxs-file"></i></td>
              <td>
                <div>
                  <!-- <span class="badge bg-label-success me-1"><i class="bx bx-detail me-1"></i> Detail </span> -->
                  <span class="badge bg-label-warning me-1"><i class="bx bx-edit-alt me-1"></i> Edit </span>
                  <span class="badge bg-label-danger me-1"><i class="bx bx-trash-alt me-1"></i> Hapus </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>12 April 2024</td>
              <td>15 April 2024</td>
              <td>Sakit</td>
              <td><i class="bx bxs-file"></i></td>
              <td>
                <div>
                  <!-- <span class="badge bg-label-success me-1"><i class="bx bx-detail me-1"></i> Detail </span> -->
                  <span class="badge bg-label-warning me-1"><i class="bx bx-edit-alt me-1"></i> Edit </span>
                  <span class="badge bg-label-danger me-1"><i class="bx bx-trash-alt me-1"></i> Hapus </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>12 April 2024</td>
              <td>15 April 2024</td>
              <td>Sakit</td>
              <td><i class="bx bxs-file"></i></td>
              <td>
                <div>
                  <!-- <span class="badge bg-label-success me-1"><i class="bx bx-detail me-1"></i> Detail </span> -->
                  <span class="badge bg-label-warning me-1"><i class="bx bx-edit-alt me-1"></i> Edit </span>
                  <span class="badge bg-label-danger me-1"><i class="bx bx-trash-alt me-1"></i> Hapus </span>
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
  </div>
</template>
