<script setup lang="ts">
import { ref, computed } from 'vue';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const data = ref([
  { tanggalMulai: '2024-03-01', tanggalSelesai: '2024-03-04', tipe: 'sakit', attachment: 'file4.pdf' },
  { tanggalMulai: '2024-03-10', tanggalSelesai: '2024-03-14', tipe: 'sakit', attachment: 'file5.pdf' },
  { tanggalMulai: '2024-03-25', tanggalSelesai: '2024-03-27', tipe: 'sakit', attachment: 'file1.pdf' },
  { tanggalMulai: '2024-04-01', tanggalSelesai: '2024-04-05', tipe: 'nikah', attachment: 'file2.pdf' },
  { tanggalMulai: '2024-04-07', tanggalSelesai: '2024-04-08', tipe: 'sakit', attachment: 'file3.pdf' }
]);

const getPdfPath = (filename: string) => {
  return `/assets/file/${filename}`;
};

const searchMonthYear = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref<'add' | 'edit'>('add');
const formItem = ref({ tanggalMulai: '', tanggalSelesai: '', tipe: '', attachment: '' });

const itemsPerPage = 5;
const currentPage = ref(1);

const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredData.value.slice(startIndex, endIndex);
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

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  formMode.value = mode;
  if (mode === 'edit' && index !== -1) {
    editedIndex.value = index;
    formItem.value = { ...data.value[index] };
  } else {
    editedIndex.value = -1;
    formItem.value = { tanggalMulai: '', tanggalSelesai: '', tipe: '', attachment: '' };
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
  formItem.value = { tanggalMulai: '', tanggalSelesai: '', tipe: '', attachment: '' };
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

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const formatTanggal = (tanggal: string) => {
  return format(parseISO(tanggal), 'dd MMMM yyyy', { locale: id });
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Cuti</h4>
    <div class="row align-items-start">
      <div class="mb-3 text-end">
        <button class="btn btn-primary" type="button" @click="openModal('add')" data-bs-toggle="modal" data-bs-target="#modalCenter">Tambah</button>
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
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ formatTanggal(item.tanggalMulai) }}</td>
              <td>{{ formatTanggal(item.tanggalSelesai) }}</td>
              <td>{{ item.tipe }}</td>
              <td>
                <a :href="getPdfPath(item.attachment)" target="_blank"><i class="bx bxs-file"></i> Lihat PDF</a>
              </td>
              <td>
                <div>
                  <span
                    class="badge bg-label-warning me-1"
                    role="button"
                    @click="openModal('edit', index)"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCenter"
                    ><i class="bx bx-edit-alt me-1"></i> Edit
                  </span>
                  <span
                    class="badge bg-label-danger me-1"
                    role="button"
                    @click="openDeleteModal((currentPage - 1) * itemsPerPage + index)"
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
          <li class="page-item prev" @click="changePage(currentPage - 1)">
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
          <li class="page-item next" @click="changePage(currentPage + 1)">
            <a class="page-link" role="button"><i class="tf-icon bx bx-chevrons-right"></i></a>
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
            <h5 class="modal-title" id="modalCenterTitle">{{ formMode === 'edit' ? 'Edit' : 'Tambah' }} Data Pengajuan</h5>
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
    <div class="modal fade" id="smallModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-center">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <h5>Apakah anda yakin ingin menghapus data ini?</h5>
            <i class="bx bx-trash bx-tada" style="color: rgba(255, 0, 0, 0.6); font-size: 150px"></i>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="button" class="btn btn-primary" @click="deleteData" data-bs-dismiss="modal">Ya</button>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tidak</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Hapus -->
  </div>
</template>

<style scoped>
  .modal-body i {
    font-size: 50px;
    margin-top: 20px;
  }
</style>
