<script setup lang="ts">
import { ref, computed } from 'vue';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

import Pagination from '../../components/pagination/Pagination.vue';

interface Item {
  karyawan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  waktuMulai: string;
  waktuSelesai: string;
  attachment: string;
  status: string;
  description: string;
}

const selectedItem = ref<Item | null>(null);

const data = ref([
  {
    karyawan: 'Albert Cook',
    tanggalMulai: '2024-03-25',
    tanggalSelesai: '2024-03-25',
    waktuMulai: '07:00',
    waktuSelesai: '22:00',
    attachment: 'file1.pdf',
    status: 'pending',
    description: ''
  },
  {
    karyawan: 'Barry Hunter',
    tanggalMulai: '2024-03-31',
    tanggalSelesai: '2024-03-31',
    waktuMulai: '08:00',
    waktuSelesai: '21:00',
    attachment: 'file2.pdf',
    status: 'pending',
    description: ''
  },
  {
    karyawan: 'Trevor Baker',
    tanggalMulai: '2024-04-04',
    tanggalSelesai: '2024-04-05',
    waktuMulai: '08:00',
    waktuSelesai: '02:00',
    attachment: 'file3.pdf',
    status: 'pending',
    description: ''
  },
  {
    karyawan: 'Albert Cook',
    tanggalMulai: '2024-04-05',
    tanggalSelesai: '2024-04-05',
    waktuMulai: '07:00',
    waktuSelesai: '23:00',
    attachment: 'file4.pdf',
    status: 'rejected',
    description: 'attachment tidak valid'
  },
  {
    karyawan: 'Jerry Milton',
    tanggalMulai: '2024-04-06',
    tanggalSelesai: '2024-04-06',
    waktuMulai: '08:00',
    waktuSelesai: '23:00',
    attachment: 'file5.pdf',
    status: 'approved',
    description: ''
  }
]);

const getPdfPath = (filename: string) => {
  return `/assets/file/${filename}`;
};

const searchMonthYear = ref('');

const itemsPerPage = 5; // Jumlah item yang ingin ditampilkan per halaman
const currentPage = ref(1); // Halaman saat ini yang ditampilkan

const totalItems = computed(() => data.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const sourceData = searchMonthYear.value ? filteredData.value : data.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sourceData.slice(startIndex, endIndex);
});

const filteredData = computed(() => {
  if (!searchMonthYear.value) {
    return data.value;
  }
  const [searchYear, searchMonth] = searchMonthYear.value.split('-').map(Number);
  return data.value.filter(item => {
    const itemDate = new Date(item.tanggalMulai);
    return itemDate.getFullYear() === searchYear && itemDate.getMonth() + 1 === searchMonth;
  });
});

const formatTanggal = (tanggal: string) => {
  return format(parseISO(tanggal), 'dd MMMM yyyy', { locale: id });
};

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

const viewItem = ref({
  karyawan: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  waktuMulai: '',
  waktuSelesai: '',
  attachment: '',
  status: '',
  description: ''
});

const openView = (item: {
  karyawan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  waktuMulai: string;
  waktuSelesai: string;
  attachment: string;
  status: string;
  description: string;
}) => {
  viewItem.value = { ...item };
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Lembur</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-calendar"></i></span>
          <input type="month" class="form-control" v-model="searchMonthYear" placeholder="Pilih Bulan dan Tahun" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Karyawan</th>
              <th>Tanggal Mulai</th>
              <th>Waktu Mulai</th>
              <th>Waktu Selesai</th>
              <!-- <th>Attachment</th> -->
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.karyawan }}</td>
              <td>{{ formatTanggal(item.tanggalMulai) }}</td>
              <td>{{ item.waktuMulai }}</td>
              <td>{{ item.waktuSelesai }}</td>
              <!-- <td>
                <a :href="getPdfPath(item.attachment)" target="_blank"><i class="bx bxs-file"></i> Lihat PDF</a>
              </td> -->
              <td>
                <span
                  :class="{
                    'badge bg-label-warning': item.status === 'pending',
                    'badge bg-label-success': item.status === 'approved',
                    'badge bg-label-danger': item.status === 'rejected'
                  }"
                >
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
                  <span
                    class="badge bg-label-info me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#viewModal"
                    @click="openView(item)"
                    ><i class="bx bx-edit-alt me-1"></i> View</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="fw-semibold mt-3" style="margin-left: 20px">
        Menampilkan {{ paginatedData.length }} dari {{ totalItems }} total data
      </div>
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @pageChange="handlePageChange" />
    </div>
    <!--/ Striped Rows -->

    <!-- Modal Action -->
    <div class="modal fade" id="actionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ actionType === 'approve' ? 'Setujui' : 'Tolak' }} Pengajuan Lembur</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>
              Apakah Anda yakin ingin {{ actionType === 'approve' ? 'menyetujui' : 'menolak' }} pengajuan lembur oleh
              {{ selectedItem?.karyawan }} pada tanggal {{ selectedItem?.tanggalMulai }}?
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

     <!-- Modal View -->
     <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">Detail Pengajuan Lembur</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="karyawan" class="form-label">Nama Karyawan</label>
                <input
                  type="text"
                  id="karyawan"
                  class="form-control"
                  v-model="viewItem.karyawan"
                  disabled
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="tanggalMulai" class="form-label">Tanggal Mulai</label>
                <input
                  type="date"
                  id="tanggalMulai"
                  class="form-control"
                  v-model="viewItem.tanggalMulai"
                  placeholder="DD / MM / YY"
                  disabled
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="tanggalSelesai" class="form-label">Tanggal Selesai</label>
                <input
                  type="date"
                  id="tanggalSelesai"
                  class="form-control"
                  v-model="viewItem.tanggalSelesai"
                  placeholder="DD / MM / YY"
                  disabled
                />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="waktuMulai" class="form-label">Waktu Mulai</label>
                <input
                  type="time"
                  id="waktuMulai"
                  class="form-control"
                  v-model="viewItem.waktuMulai"
                  placeholder="HH : MM"
                  disabled
                />
              </div>
              <div class="col mb-0">
                <label for="waktuSelesai" class="form-label">Waktu Selesai</label>
                <input
                  type="time"
                  id="waktuSelesai"
                  class="form-control"
                  v-model="viewItem.waktuSelesai"
                  placeholder="HH : MM"
                  disabled
                />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mt-3">
                <label for="attachment" class="form-label mb-2">Attachment</label>
                <!-- <input class="form-control" type="file" id="attachment" v-on:change="viewItem.attachment" @change="handleFileUpload" /> -->
                <a :href="getPdfPath(viewItem.attachment)" target="_blank" class="form-control"
                  ><i class="bx bxs-file"></i> Lihat PDF</a
                >
              </div>
              <div class="col mt-3">
                <label for="status" class="form-label">Status</label>
                <span
                  class="form-control"
                  :class="{
                    'badge bg-label-warning': viewItem.status === 'pending',
                    'badge bg-label-success': viewItem.status === 'approved',
                    'badge bg-label-danger': viewItem.status === 'rejected'
                  }"
                >
                  {{ viewItem.status }}
                </span>
              </div>
            </div>
            <div v-if="viewItem.status === 'rejected'" class="row">
              <div class="col mt-3">
                <label for="description" class="form-label">Deskripsi</label>
                <textarea class="form-control" id="description" rows="3" v-model="viewItem.description" disabled></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal View -->
  </div>
</template>
