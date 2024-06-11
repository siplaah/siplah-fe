<script setup lang="ts">
import { ref, computed } from 'vue';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const data = ref([
  {
    nama: 'arila',
    email: 'arial@gmail.com',
    deskripsi: 'karyawan',
    start_working: '2024-01-01',
    alamat: 'bali',
    pendidikan: 'S2',
    tanggal_lahir: '2003-02-12',
    tempat_lahir: 'jakarta',
    status: 'aktif'
  },
  {
    nama: 'nia',
    email: 'arial@gmail.com',
    deskripsi: 'karyawan',
    start_working: '2024-01-01',
    alamat: 'bali',
    pendidikan: 'S2',
    tanggal_lahir: '2003-02-12',
    tempat_lahir: 'jakarta',
    status: 'aktif'
  },
  {
    nama: 'ale',
    email: 'arial@gmail.com',
    deskripsi: 'karyawan',
    start_working: '2024-01-01',
    alamat: 'bali',
    pendidikan: 'S2',
    tanggal_lahir: '2003-02-12',
    tempat_lahir: 'jakarta',
    status: 'aktif'
  }
]);

const editedIndex = ref(-1);
const editedItem = ref({
  nama: '',
  email: '',
  deskripsi: '',
  start_working: '',
  alamat: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  status: ''
});

const newKaryawan = ref({
  nama: '',
  email: '',
  deskripsi: '',
  start_working: '',
  alamat: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  status: ''
});

const openEditModal = (index: number) => {
  editedIndex.value = index;
  editedItem.value = { ...data.value[index] };
};

const saveEditedData = () => {
  if (editedIndex.value !== -1) {
    data.value.splice(editedIndex.value, 1, editedItem.value);
    editedIndex.value = -1;
  }
};

const openCreateModal = () => {
  newKaryawan.value = {
    nama: '',
    email: '',
    deskripsi: '',
    start_working: '',
    alamat: '',
    pendidikan: '',
    tanggal_lahir: '',
    tempat_lahir: '',
    status: ''
  };
};

const createNewKaryawan = () => {
  if (newKaryawan.value.nama.trim() !== '') {
    data.value.push({ ...newKaryawan.value });
    newKaryawan.value = {
      nama: '',
      email: '',
      deskripsi: '',
      start_working: '',
      alamat: '',
      pendidikan: '',
      tanggal_lahir: '',
      tempat_lahir: '',
      status: ''
    };
  }
};

const deletedIndex = ref(-1);

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const deleteData = () => {
  if (deletedIndex.value !== -1) {
    data.value.splice(deletedIndex.value, 1);
    deletedIndex.value = -1;
  }
};

const formatTanggal = (tanggal: string) => {
  return format(parseISO(tanggal), 'dd MMMM yyyy', { locale: id });
};

const viewItem = ref({
  nama: '',
  email: '',
  deskripsi: '',
  start_working: '',
  alamat: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  status: ''
});

const openViewModal = (item: {
  nama: string;
  email: string;
  deskripsi: string;
  start_working: string;
  alamat: string;
  pendidikan: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  status: string;
}) => {
  viewItem.value = { ...item };
};

const searchQuery = ref('');

const itemsPerPage = 5; // Jumlah item yang ingin ditampilkan per halaman
const currentPage = ref(1); // Halaman saat ini yang ditampilkan

const filteredData = computed(() => {
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return data.value.filter(item =>
    Object.values(item).some(value => String(value).toLowerCase().includes(lowerCaseQuery))
  );
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = currentPage.value * itemsPerPage;
  return filteredData.value.slice(start, end);
});

const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Master /</span> Data Karyawan</h4>
    <div class="row align-items-start">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-search-alt"></i></span>
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Data Karyawan..." />
        </div>
      </div>
      <div class="mb-3 text-end">
        <button
          class="btn btn-primary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#createModal"
          @click="openCreateModal"
        >
          Tambah Karyawan
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
              <th>Nama</th>
              <th>Email</th>
              <th>Deskripsi</th>
              <th>Mulai Bekerja</th>
              <th>Pendidikan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.nama }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.deskripsi }}</td>
              <td>{{ formatTanggal(item.start_working) }}</td>
              <td>{{ item.pendidikan }}</td>
              <td>
                <span
                  class="badge bg-label-info me-1"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#viewModal"
                  @click="openViewModal(item)"
                >
                  <i class="bx bx-show-alt me-1"></i> View
                </span>
                <span
                  class="badge bg-label-warning me-1"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  @click="openEditModal((currentPage - 1) * itemsPerPage + index)"
                >
                  <i class="bx bx-edit-alt me-1"></i> Edit
                </span>
                <span
                  class="badge bg-label-danger me-1"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  @click="openDeleteModal((currentPage - 1) * itemsPerPage + index)"
                >
                  <i class="bx bx-trash-alt me-1"></i> Hapus
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="fw-semibold mt-3" style="margin-left: 20px">
        Menampilkan {{ paginatedData.length }} dari {{ totalItems }} total data
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination pagination-sm justify-content-center mt-3">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" @click="currentPage > 1 && handlePageChange(currentPage - 1)">
              <i class="tf-icon bx bx-chevrons-left"></i>
            </a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <a class="page-link" @click="handlePageChange(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" @click="currentPage < totalPages && handlePageChange(currentPage + 1)">
              <i class="tf-icon bx bx-chevrons-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <!--/ Striped Rows -->

    <!-- Modal Create -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createModalTitle">Tambah Karyawan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="newNama" class="form-label">Nama</label>
                <input type="text" id="newNama" class="form-control" v-model="newKaryawan.nama" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newEmail" class="form-label">Email</label>
                <input type="text" id="newEmail" class="form-control" v-model="newKaryawan.email" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newDeskripsi" class="form-label">Deskripsi</label>
                <input type="text" id="newDeskripsi" class="form-control" v-model="newKaryawan.deskripsi" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="" class="form-label">Mulai Bekerja</label>
                <input
                  type="date"
                  id=""
                  class="form-control"
                  v-model="newKaryawan.start_working"
                  placeholder="DD / MM / YY"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newAlamat" class="form-label">Alamat</label>
                <input type="text" id="newAlamat" class="form-control" v-model="newKaryawan.alamat" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newPendidikan" class="form-label">Pendidikan</label>
                <select id="newPendidikan" class="select2 form-select" v-model="newKaryawan.pendidikan">
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newTanggalLahir" class="form-label">Tanggal Lahir</label>
                <input
                  type="date"
                  id="newTanggalLahir"
                  class="form-control"
                  v-model="newKaryawan.tanggal_lahir"
                  placeholder="DD / MM / YY"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newTempatLahir" class="form-label">Tempat Lahir</label>
                <input type="text" id="newTempatLahir" class="form-control" v-model="newKaryawan.tempat_lahir" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newStatus" class="form-label">Status</label>
                <input type="text" id="newStatus" class="form-control" v-model="newKaryawan.status" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="createNewKaryawan">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Create -->

    <!-- Modal Edit -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalTitle">Edit Karyawan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="editNama" class="form-label">Nama</label>
                <input type="text" id="editNama" class="form-control" v-model="editedItem.nama" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editEmail" class="form-label">Email</label>
                <input type="text" id="editEmail" class="form-control" v-model="editedItem.email" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editDeskripsi" class="form-label">Deskripsi</label>
                <input type="text" id="editDeskripsi" class="form-control" v-model="editedItem.deskripsi" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editStartWorking" class="form-label">Mulai Bekerja</label>
                <input type="date" id="editStartWorking" class="form-control" v-model="editedItem.start_working" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editAlamat" class="form-label">Alamat</label>
                <input type="text" id="editAlamat" class="form-control" v-model="editedItem.alamat" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editPendidikan" class="form-label">Pendidikan</label>
                <select id="editPendidikan" class="select2 form-select" v-model="editedItem.pendidikan">
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Sarjana">Sarjana</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editTanggalLahir" class="form-label">Tanggal Lahir</label>
                <input type="date" id="editTanggalLahir" class="form-control" v-model="editedItem.tanggal_lahir" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editTempatLahir" class="form-label">Tempat Lahir</label>
                <input type="text" id="editTempatLahir" class="form-control" v-model="editedItem.tempat_lahir" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editStatus" class="form-label">Status</label>
                <select id="editStatus" class="select2 form-select" v-model="editedItem.status">
                  <option value="aktif">Aktif</option>
                  <option value="non-aktif">Non-Aktif</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" @click="saveEditedData" data-bs-dismiss="modal">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Edit -->

    <!-- Modal Delete -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalTitle">Hapus Data Karyawan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Apakah anda yakin ingin menghapus data ini?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-danger" @click="deleteData" data-bs-dismiss="modal">Hapus</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Delete -->

    <!-- Modal View -->
    <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">Detail Karyawan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="viewNama" class="form-label">Nama Karyawan</label>
                <input type="text" id="viewNama" class="form-control" :value="viewItem.nama" readonly />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewEmail" class="form-label">Email</label>
                <input type="text" id="viewEmail" class="form-control" :value="viewItem.email" readonly />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewDeskripsi" class="form-label">Deskripsi</label>
                <input type="text" id="viewDeskripsi" class="form-control" :value="viewItem.deskripsi" readonly />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewStartWorking" class="form-label">Mulai Bekerja</label>
                <input
                  type="date"
                  id="viewStartWorking"
                  class="form-control"
                  :value="viewItem.start_working"
                  readonly
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewAlamat" class="form-label">Alamat</label>
                <input type="text" id="viewAlamat" class="form-control" :value="viewItem.alamat" readonly />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewPendidikan" class="form-label">Pendidikan</label>
                <select id="viewPendidikan" class="select2 form-select" :value="viewItem.pendidikan" disabled>
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Sarjana">Sarjana</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewTanggalLahir" class="form-label">Tanggal Lahir</label>
                <input
                  type="date"
                  id="viewTanggalLahir"
                  class="form-control"
                  :value="viewItem.tanggal_lahir"
                  readonly
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewTempatLahir" class="form-label">Tempat Lahir</label>
                <input type="text" id="viewTempatLahir" class="form-control" :value="viewItem.tempat_lahir" readonly />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewStatus" class="form-label">Status</label>
                <select id="viewStatus" class="select2 form-select" :value="viewItem.status" disabled>
                  <option value="aktif">Aktif</option>
                  <option value="non-aktif">Non-Aktif</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div>

    <!-- /Modal View -->
  </div>
</template>
