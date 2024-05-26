<script setup lang="ts">
import { ref, computed } from 'vue';

interface Item {
  karyawan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tipe: string;
  attachment: string;
  status: string;
}

const data = ref<Item[]>([
  {
    karyawan: 'Albert Cook',
    tanggalMulai: '1 Maret 2024',
    tanggalSelesai: '4 Maret 2024',
    tipe: 'sakit',
    attachment: 'file4.pdf',
    status: 'pending'
  },
  {
    karyawan: 'Barry Hunter',
    tanggalMulai: '10 Maret 2024',
    tanggalSelesai: '14 Maret 2024',
    tipe: 'sakit',
    attachment: 'file5.pdf',
    status: 'pending'
  },
  {
    karyawan: 'Trevor Baker',
    tanggalMulai: '25 Maret 2024',
    tanggalSelesai: '27 Maret 2024',
    tipe: 'sakit',
    attachment: 'file1.pdf',
    status: 'pending'
  },
  {
    karyawan: 'Albert Cook',
    tanggalMulai: '1 April 2024',
    tanggalSelesai: '5 April 2024',
    tipe: 'nikah',
    attachment: 'file2.pdf',
    status: 'pending'
  },
  {
    karyawan: 'Jerry Milton',
    tanggalMulai: '7 April 2024',
    tanggalSelesai: '8 April 2024',
    tipe: 'sakit',
    attachment: 'file3.pdf',
    status: 'pending'
  }
]);

const getPdfPath = (filename: string) => {
  return `/assets/file/${filename}`;
};

const itemsPerPage = 5;
const currentPage = ref(1);

const totalItems = computed(() => data.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return data.value.slice(startIndex, startIndex + itemsPerPage);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const selectedItem = ref<Item | null>(null);
const actionType = ref('');

const openModal = (item: Item | null, type: string) => {
  selectedItem.value = item;
  actionType.value = type;
};

const updateStatus = () => {
  if (selectedItem.value && actionType.value) {
    selectedItem.value.status = actionType.value === 'approve' ? 'approved' : 'rejected';
  }
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Cuti</h4>

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
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through paginated data to display each row -->
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.tanggalMulai }}</td>
              <td>{{ item.tanggalSelesai }}</td>
              <td>{{ item.tipe }}</td>
              <td>
                <a :href="getPdfPath(item.attachment)" target="_blank"><i class="bx bxs-file"></i> Lihat PDF</a>
              </td>
              <td>
                <span :class="{'badge bg-label-warning': item.status === 'pending', 'badge bg-label-success': item.status === 'approved', 'badge bg-label-danger': item.status === 'rejected'}">
                  {{ item.status }}
                </span>
              </td>
              <td>
                <div>
                  <span
                    class="badge bg-label-success me-1"
                    role="button"
                    @click="openModal(item, 'approve')"
                    data-bs-toggle="modal"
                    data-bs-target="#actionModal"
                    ><i class="bx bx-check me-1"></i> Setujui
                  </span>
                  <span
                    class="badge bg-label-danger me-1"
                    role="button"
                    @click="openModal(item, 'reject')"
                    data-bs-toggle="modal"
                    data-bs-target="#actionModal"
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
          <li class="page-item prev" :class="{ disabled: currentPage === 1 }" @click="changePage(currentPage - 1)">
            <a class="page-link" role="button"><i class="tf-icon bx bx-chevrons-left"></i></a>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            <a class="page-link" role="button">{{ page }}</a>
          </li>
          <li
            class="page-item next"
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            <a class="page-link" role="button"><i class="tf-icon bx bx-chevrons-right"></i></a>
          </li>
        </ul>
      </nav>
    </div>
    <!--/ Striped Rows -->

    <!-- Modal Action -->
    <div class="modal fade" id="actionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ actionType === 'approve' ? 'Setujui' : 'Tolak' }} Pengajuan Cuti</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>
              Apakah Anda yakin ingin {{ actionType === 'approve' ? 'menyetujui' : 'menolak' }} pengajuan cuti oleh
              {{ selectedItem?.karyawan }} dari {{ selectedItem?.tanggalMulai }} hingga
              {{ selectedItem?.tanggalSelesai }}?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" @click="updateStatus" data-bs-dismiss="modal">
              {{ actionType === 'approve' ? 'Setujui' : 'Tolak' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Action -->
  </div>
</template>
