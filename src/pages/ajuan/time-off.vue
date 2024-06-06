<script setup lang="ts">
import { ref, computed } from 'vue';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

import DeleteModal from '../../components/modal/Delete.vue';
import Pagination from '../../components/pagination/Pagination.vue';

const data = ref([
  {
    tanggalMulai: '2024-03-01',
    tanggalSelesai: '2024-03-04',
    tipe: 'sakit',
    attachment: 'file4.pdf',
    status: 'pending',
    description: ''
  },
  {
    tanggalMulai: '2024-03-10',
    tanggalSelesai: '2024-03-14',
    tipe: 'sakit',
    attachment: 'file5.pdf',
    status: 'pending',
    description: ''
  },
  {
    tanggalMulai: '2024-03-25',
    tanggalSelesai: '2024-03-27',
    tipe: 'sakit',
    attachment: 'file1.pdf',
    status: 'pending',
    description: ''
  },
  {
    tanggalMulai: '2024-04-01',
    tanggalSelesai: '2024-04-05',
    tipe: 'nikah',
    attachment: 'file2.pdf',
    status: 'rejected',
    description: 'attachment tidak valid'
  },
  {
    tanggalMulai: '2024-04-07',
    tanggalSelesai: '2024-04-08',
    tipe: 'sakit',
    attachment: 'file3.pdf',
    status: 'approved',
    description: ''
  }
]);

const getPdfPath = (filename: string) => {
  return `/assets/file/${filename}`;
};

const searchMonthYear = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref<'add' | 'edit'>('add');
const formItem = ref({ tanggalMulai: '', tanggalSelesai: '', tipe: '', attachment: '', status: '', description: '' });

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

const viewItem = ref({
  tanggalMulai: '',
  tanggalSelesai: '',
  tipe: '',
  attachment: '',
  status: '',
  description: ''
});

const openView = (item: {
  tanggalMulai: string;
  tanggalSelesai: string;
  tipe: string;
  attachment: string;
  status: string;
  description: string;
}) => {
  viewItem.value = { ...item };
};

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  if (mode === 'edit' && data.value[index].status !== 'rejected') {
    return;
  }
  formMode.value = mode;
  if (mode === 'edit' && index !== -1) {
    editedIndex.value = index;
    formItem.value = { ...data.value[index] };
  } else {
    editedIndex.value = -1;
    formItem.value = {
      tanggalMulai: '',
      tanggalSelesai: '',
      tipe: '',
      attachment: '',
      status: 'pending',
      description: ''
    };
  }
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const saveData = () => {
  if (formMode.value === 'edit' && editedIndex.value !== -1) {
    data.value.splice(editedIndex.value, 1, { ...formItem.value });
  } else if (formMode.value === 'add') {
    data.value.push({ ...formItem.value });
  }
  formItem.value = {
    tanggalMulai: '',
    tanggalSelesai: '',
    tipe: '',
    attachment: '',
    status: 'pending',
    description: ''
  };
};

const deleteData = () => {
  if (deletedIndex.value !== -1) {
    data.value.splice(deletedIndex.value, 1);
    deletedIndex.value = -1;
  }
};

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formItem.value.attachment = file.name;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const formatTanggal = (tanggal: string) => {
  return format(parseISO(tanggal), 'dd MMMM yyyy', { locale: id });
};

const isImage = (url: string) => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Cuti</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-calendar"></i></span>
          <input type="month" class="form-control" v-model="searchMonthYear" placeholder="Pilih Bulan dan Tahun" />
        </div>
      </div>
      <div class="col-md-8 d-flex justify-content-end align-items-center">
        <div class="me-4">
          Total Cuti Anda: <span class="badge badge-center rounded-pill bg-label-primary">11</span>
        </div>
        <button
          class="btn btn-primary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#formModal"
          @click="openModal('add')"
        >
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
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ formatTanggal(item.tanggalMulai) }}</td>
              <td>{{ formatTanggal(item.tanggalSelesai) }}</td>
              <td>{{ item.tipe }}</td>
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
                    class="badge bg-label-info me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#viewModal"
                    @click="openView(item)"
                    ><i class="bx bx-edit-alt me-1"></i> View</span
                  >
                  <span
                    v-if="item.status === 'rejected'"
                    class="badge bg-label-warning me-1"
                    role="button"
                    @click="openModal('edit', index)"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCenter"
                    ><i class="bx bx-edit-alt me-1"></i> Edit
                  </span>
                  <span
                    v-if="item.status !== 'approved'"
                    class="badge bg-label-danger me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                    @click="openDeleteModal((currentPage - 1) * itemsPerPage + index)"
                    ><i class="bx bx-trash-alt me-1"></i> Hapus
                  </span>
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

    <!-- Modal View -->
    <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">Detail Pengajuan Cuti</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
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
            <div class="row">
              <div class="col">
                <label for="tipe" class="form-label">Tipe Cuti</label>
                <input
                  type="text"
                  id="tipe"
                  class="form-control"
                  v-model="viewItem.tipe"
                  placeholder="DD / MM / YY"
                  disabled
                />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mt-3">
                <label for="attachment" class="form-label mb-2">Attachment</label>
                <div v-if="viewItem.attachment" class="mt-2">
                  <img v-if="isImage(viewItem.attachment)" :src="viewItem.attachment" class="img-fluid" />
                  <a v-else :href="getPdfPath(viewItem.attachment)" target="_blank" rel="noopener noreferrer"
                    ><i class="bx bxs-file"></i> Lihat PDF</a
                  >
                </div>
              </div>
              <div class="col mt-3">
                <label for="status" class="form-label">Status</label>
                <div>
                  <span
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
            </div>
            <div v-if="viewItem.status === 'rejected'" class="row">
              <div class="col mt-3">
                <label for="description" class="form-label">Deskripsi</label>
                <textarea
                  class="form-control"
                  id="description"
                  rows="3"
                  v-model="viewItem.description"
                  disabled
                ></textarea>
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

    <!-- Modal Form -->
    <div class="modal fade" id="modalCenter" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCenterTitle">
              {{ formMode === 'edit' ? 'Edit' : 'Tambah' }} Data Pengajuan
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-2">
              <div class="col mb-0">
                <label for="start_date" class="form-label">Tanggal Mulai</label>
                <input type="date" id="start_date" class="form-control" v-model="formItem.tanggalMulai" />
              </div>
              <div class="col mb-0">
                <label for="end_date" class="form-label">Tanggal Selesai</label>
                <input type="date" id="end_date" class="form-control" v-model="formItem.tanggalSelesai" />
              </div>
            </div>
            <div class="row">
              <div class="col mt-3">
                <label for="tipe" class="form-label">Tipe Cuti</label>
                <select id="tipe" class="form-select" v-model="formItem.tipe">
                  <option value="">Pilih Tipe Cuti</option>
                  <option value="cuti tahunan">Cuti Tahunan</option>
                  <option value="cuti menikah">Cuti Menikah</option>
                  <option value="cuti melahirkan">Cuti Melahirkan</option>
                  <option value="sakit">Sakit</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col mt-3">
                <label for="formFile" class="form-label">Attachment</label>
                <input class="form-control" type="file" id="formFile" @change="handleFileUpload" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" @click="saveData" data-bs-dismiss="modal">Simpan</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Edit -->

    <!-- Modal Hapus -->
    <DeleteModal :onDelete="deleteData" />
    <!-- /Modal Hapus -->
  </div>
</template>

<style scoped>
.modal-body i {
  font-size: 50px;
  margin-top: 20px;
}
</style>
