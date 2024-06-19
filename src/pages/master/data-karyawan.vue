<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useApiEmployeeStrore } from '@/stores/api/master/karyawan';
import DeleteModal from '../../components/modal/Delete.vue';
import Pagination from '../../components/pagination/Pagination.vue';
import { storeToRefs } from 'pinia';

const searchQuery = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref<'add' | 'edit'>('add'); // 'add' or 'edit'
const formItem = ref({
  nama: '',
  email: '',
  deskripsi: '',
  start_working: '',
  alamat: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  status: '',
  id_jabatan: '',
  password: ''
});

const apiEmployeeStore = useApiEmployeeStrore();
const { listEmployee } = storeToRefs(apiEmployeeStore);

const itemsPerPage = 5; // Jumlah item yang ingin ditampilkan per halaman
const currentPage = ref(1); // Halaman saat ini yang ditampilkan

const totalItems = computed(() => listEmployee.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const sortedEmployee = computed(() => {
  return listEmployee.value
    .slice()
    .sort((a: { id_employee: number }, b: { id_employee: number }) => a.id_employee - b.id_employee);
});

const paginatedData = computed(() => {
  const filteredData = searchQuery.value
    ? sortedEmployee.value.filter((item: { employee: string }) =>
        item.employee.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : sortedEmployee.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredData.slice(startIndex, startIndex + itemsPerPage);
});

// const paginatedData = computed(() => {
//   const start = (currentPage.value - 1) * itemsPerPage;
//   const end = currentPage.value * itemsPerPage;
//   return filteredData.value.slice(start, end);
// });

// const filteredData = computed(() => {
//   const lowerCaseQuery = searchQuery.value.toLowerCase();
//   return listEmployee.value.filter((item: Item) => {
//     return [
//       'nama',
//       'email',
//       'deskripsi',
//       'start_working',
//       'alamat',
//       'pendidikan',
//       'tanggal_lahir',
//       'tempat_lahir',
//       'status'
//     ].some(key => {
//       const value = item[key as keyof Item]; // Mengakses nilai berdasarkan kunci
//       if (value) {
//         return value.toLowerCase().includes(lowerCaseQuery);
//       }
//       return false;
//     });
//   });
// });

const getData = async () => {
  await apiEmployeeStore.getEmployee();
};

onMounted(() => {
  getData();
});

const formatTanggal = (tanggal: string) => {
  return format(parseISO(tanggal), 'dd MMMM yyyy', { locale: id });
};

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  if (mode === 'edit' && listEmployee.value[index]) {
    return;
  }
  formMode.value = mode;
  if (mode === 'edit') {
    editedIndex.value = index;
    formItem.value = { ...paginatedData.value[index] };
  } else {
    editedIndex.value = -1;
    formItem.value = {
      nama: '',
      email: '',
      deskripsi: '',
      start_working: '',
      alamat: '',
      pendidikan: '',
      tanggal_lahir: '',
      tempat_lahir: '',
      status: '',
      id_jabatan: '',
      password: ''
    };
  }
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
  status: '',
  id_jabatan: '',
  password: ''
});

const openView = (item: {
  nama: '';
  email: '';
  deskripsi: '';
  start_working: '';
  alamat: '';
  pendidikan: '';
  tanggal_lahir: '';
  tempat_lahir: '';
  status: '';
  id_jabatan: '';
  password: '';
}) => {
  viewItem.value = { ...item };
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const saveData = async () => {
  // if (!formItem.value.overtime || !formItem.value.target) {
  //   alert('Harap isi kedua field sebelum menyimpan.');
  //   return; // Menghentikan proses penyimpanan jika salah satu input kosong
  // }

  if (formMode.value === 'add') {
    await apiEmployeeStore.postEmployee(formItem.value);
  } else if (formMode.value === 'edit') {
    const id = paginatedData.value[editedIndex.value].id_employee;
    await apiEmployeeStore.patchEmployee(formItem.value, id);
  }
  getData();
};

const deleteData = async () => {
  const id = paginatedData.value[deletedIndex.value].id_employee;
  await apiEmployeeStore.deleteOvertime(id);
  getData();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Master /</span> Data Karyawan</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-calendar"></i></span>
          <input type="month" class="form-control" v-model="searchQuery" placeholder="Pilih Bulan dan Tahun" />
        </div>
      </div>
      <div class="col-md-8 d-flex justify-content-end align-items-center">
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

    <!-- table -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Passowrd</th>
              <th>Jabatan</th>
              <th>Deskripsi</th>
              <th>Mulai Bekerja</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.nama }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.password }}</td>
              <td>{{ item.id_jabatan }}</td>
              <td>{{ item.deskripsi }}</td>

              <td>{{ formatTanggal(item.start_working) }}</td>
              <td>
                <span
                  :class="{
                    'badge bg-label-success': item.status === 'Aktif',
                    'badge bg-label-danger': item.status === 'Nonaktif'
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
                    data-bs-toggle="modal"
                    data-bs-target="#formModal"
                    @click="openModal('edit', (currentPage - 1) * itemsPerPage + index)"
                    ><i class="bx bx-edit-alt me-1"></i> Edit</span
                  >
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
    <!--/ table -->

    <!-- Modal Form -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="start_date" class="form-label">Nama</label>
                <input type="text" id="name" class="form-control" v-model="formItem.nama" placeholder="" />
              </div>
            </div>

            <div class="row">
              <div class="col mb-3">
                <label for="end_date" class="form-label">Email</label>
                <input type="text" id="email" class="form-control" v-model="formItem.email" placeholder="" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="start_date" class="form-label"> Password</label>
                <input type="password" id="password" class="form-control" v-model="formItem.password" placeholder="" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="start_date" class="form-label">Jabatan</label>
                <input type="text" id="name" class="form-control" v-model="formItem.id_jabatan" placeholder="" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="start_time" class="form-label">Deskripsi</label>
                <input type="text" id="deskripsi" class="form-control" v-model="formItem.deskripsi" placeholder="" />
              </div>
              <div class="col mb-0">
                <label for="end_time" class="form-label">Mulai Bekerja</label>
                <input type="text" id="" class="form-control" v-model="formItem.start_working" placeholder="" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="start_time" class="form-label">Alamat</label>
                <input type="text" id="alamat" class="form-control" v-model="formItem.alamat" placeholder="" />
              </div>
              <div class="col mb-0">
                <label for="newPendidikan" class="form-label">Pendidikan</label>
                <select id="newPendidikan" class="select2 form-select" v-model="formItem.pendidikan">
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
              <div class="row g-2">
                <div class="col mb-0">
                  <label for="start_time" class="form-label">Tanggal Lahir</label>
                  <input
                    type="text"
                    id="tanggal_lahir"
                    class="form-control"
                    v-model="formItem.tanggal_lahir"
                    placeholder=""
                  />
                </div>
                <div class="col mb-0">
                  <label for="end_time" class="form-label">Tempat Lahir</label>
                  <input type="text" id="" class="form-control" v-model="formItem.tempat_lahir" placeholder="" />
                </div>
                <div class="row g-2">
                  <div class="col mb-0">
                    <label for="newStatus" class="form-label">Status</label>
                    <select id="newStatus" class="form-select" v-model="formItem.status">
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="saveData">Simpan</button>
      </div>
    </div>
  </div>

  <!-- /Modal Form -->

  <!-- Modal View -->
  <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="formModalTitle">Detail Pengajuan Lembur</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="col mb-3">
            <label for="start_date" class="form-label">Nama</label>
            <input type="text" id="name" class="form-control" v-model="viewItem.nama" placeholder="" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="end_date" class="form-label">Email</label>
            <input type="text" id="email" class="form-control" v-model="viewItem.email" placeholder="" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="start_date" class="form-label"> Password</label>
            <input type="password" id="password" class="form-control" v-model="viewItem.password" placeholder="" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="start_date" class="form-label">Jabatan</label>
            <input type="text" id="name" class="form-control" v-model="viewItem.id_jabatan" placeholder="" />
          </div>
        </div>
        <div class="row g-2">
          <div class="col mb-0">
            <label for="start_time" class="form-label">Deskripsi</label>
            <input type="text" id="deskripsi" class="form-control" v-model="viewItem.deskripsi" placeholder="" />
          </div>
          <div class="col mb-0">
            <label for="end_time" class="form-label">Mulai Bekerja</label>
            <input type="text" id="" class="form-control" v-model="viewItem.start_working" placeholder="" />
          </div>
        </div>
        <div class="row g-2">
          <div class="col mb-0">
            <label for="start_time" class="form-label">Alamat</label>
            <input type="text" id="alamat" class="form-control" v-model="viewItem.alamat" placeholder="" />
          </div>
          <div class="col mb-0">
            <label for="newPendidikan" class="form-label">Pendidikan</label>
            <select id="newPendidikan" class="select2 form-select" v-model="viewItem.pendidikan">
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>
          <div class="row g-2">
            <div class="col mb-0">
              <label for="start_time" class="form-label">Tanggal Lahir</label>
              <input
                type="text"
                id="tanggal_lahir"
                class="form-control"
                v-model="viewItem.tanggal_lahir"
                placeholder=""
              />
            </div>
            <div class="col mb-0">
              <label for="end_time" class="form-label">Tempat Lahir</label>
              <input type="text" id="" class="form-control" v-model="viewItem.tempat_lahir" placeholder="" />
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="newStatus" class="form-label">Status</label>
                <select id="newStatus" class="form-select" v-model="viewItem.status">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal View -->

    <!-- Modal Hapus -->
    <DeleteModal :onDelete="deleteData" />
    <!-- /Modal Hapus -->
  </div>
</template>
