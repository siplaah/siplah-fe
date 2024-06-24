<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
// import { format, parseISO } from 'date-fns';
// import { id } from 'date-fns/locale';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import DeleteModal from '../../components/modal/Delete.vue';
import Pagination from '../../components/pagination/Pagination.vue';
import { storeToRefs } from 'pinia';

const searchQuery = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref<'add' | 'edit'>('add');
const formItem = ref({
  name: '',
  email: '',
  password: '',
  alamat: '',
  keterangan: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  start_working: '',
  cuti: '',
  deskripsi:'',
  id_jabatan: ''
});

const apiEmployeeStore = useApiEmployeeStore();
const { listEmployee } = storeToRefs(apiEmployeeStore);

const itemsPerPage = 5;
const currentPage = ref(1);

const totalItems = computed(() => listEmployee.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const sortedEmployee = computed(() => {
  return Array.isArray(listEmployee.value)
    ? listEmployee.value
        .slice()
        .sort((a: { id_employee: number }, b: { id_employee: number }) => a.id_employee - b.id_employee)
    : [];
});

const paginatedData = computed(() => {
  const filteredData = searchQuery.value
    ? sortedEmployee.value.filter((item: { name: string }) =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : sortedEmployee.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredData.slice(startIndex, startIndex + itemsPerPage);
});

const getData = async () => {
  await apiEmployeeStore.getEmployee();
};

onMounted(() => {
  getData();
});

// const formatTanggal = (tanggal: string) => {
//   return format(parseISO(tanggal), 'dd MMMM yyyy', { locale: id });
// };

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  formMode.value = mode;
  if (mode === 'edit') {
    editedIndex.value = index;
    formItem.value = { ...paginatedData.value[index] };
  } else {
    editedIndex.value = -1;
    formItem.value = {
      name: '',
      email: '',
      keterangan: '',
      start_working: '',
      alamat: '',
      pendidikan: '',
      tanggal_lahir: '',
      tempat_lahir: '',
      id_jabatan: '',
      password: '',
      deskripsi:'',
      cuti:''
    };
  }
};

const viewItem = ref({
  name: '',
  email: '',
  keterangan: '',
  start_working: '',
  alamat: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  status: '',
  id_jabatan: '',
  password: '',
  deskripsi:''
});

const openView = (item: {
  name: string;
  email: string;
  keterangan: string;
  start_working: string;
  alamat: string;
  pendidikan: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  status: string;
  id_jabatan: string;
  password: string;
  deskripsi:string;
}) => {
  viewItem.value = { ...item };
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const saveData = async () => {
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
  await apiEmployeeStore.deleteEmployee(id);
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
          <span class="input-group-text"><i class="bx bx-search-alt"></i></span>
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search" />
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
              <th>Jabatan</th>
              <th>Keterangan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.id_jabatan }}</td>
              <td>{{ item.keterangan }}</td>
              <td>
                <span
                  :class="{
                    'badge bg-label-success': item.deskripsi === 'Aktif',
                    'badge bg-label-danger': item.deskripsi === 'NonAktif'
                  }"
                >
                  {{ item.deskripsi }}
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
                    ><i class="bx bx-show-alt me-1"></i> View</span
                  >
                  <span
                    class="badge bg-label-warning me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#formModal"
                    @click="openModal('edit', (currentPage - 1) * itemsPerPage + index)"
                  >
                    <i class="bx bx-edit-alt me-1"></i> Edit
                  </span>
                  <span
                    class="badge bg-label-danger me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#smallModal"
                    @click="openDeleteModal((currentPage - 1) * itemsPerPage + index)"
                  >
                    <i class="bx bx-trash-alt me-1"></i> Hapus
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
        <h5 class="modal-title" id="formModalTitle">{{ formMode === 'edit' ? 'Edit' : 'Tambah' }} Data Karyawan</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col mb-3">
            <label for="name" class="form-label">Nama</label>
            <input type="text" id="name" class="form-control" v-model="formItem.name" placeholder="" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" id="email" class="form-control" v-model="formItem.email" placeholder="" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="password" class="form-label"> Password</label>
            <input type="password" id="password" class="form-control" v-model="formItem.password" placeholder="" />
          </div>
        </div>
        <div class="row">
          <div class="col mb-3">
            <label for="jabatan" class="form-label">Jabatan</label>
            <select id="jabatan" class="select2 form-select" v-model="formItem.id_jabatan">
              <option value="CTO">CTO</option>
              <option value="HRD">HRD</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
        <div class="row g-2">
          <div class="col mb-0">
            <label for="keterangan" class="form-label">Keterangan</label>
            <select id="Keterangan" class="select2 form-select" v-model="formItem.keterangan">
              <option value="Karyawan">Karyawan</option>
              <option value="Freelance">Freelance</option>
              <option value="Partime">Partime</option>
              <option value="Probation">Probation</option>
            </select>
          </div>
          <div class="col mb-0">
            <label for="start_working" class="form-label">Mulai Bekerja</label>
            <input type="date" id="start_working" class="form-control" v-model="formItem.start_working" placeholder="DD / MM / YY" />
          </div>
        </div>
        <div class="row g-2">
          <div class="col mb-0">
            <label for="alamat" class="form-label">Alamat</label>
            <input type="text" id="alamat" class="form-control" v-model="formItem.alamat" placeholder="" />
          </div>
          <div class="col mb-0">
            <label for="pendidikan" class="form-label">Pendidikan</label>
            <select id="pendidikan" class="select2 form-select" v-model="formItem.pendidikan">
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>
        </div>
        <div class="row g-2">
          <div class="col mb-0">
            <label for="tanggal_lahir" class="form-label">Tanggal Lahir</label>
            <input type="date" id="tanggal_lahir" class="form-control" v-model="formItem.tanggal_lahir" placeholder="DD / MM / YY" />
          </div>
          <div class="col mb-0">
            <label for="tempat_lahir" class="form-label">Tempat Lahir</label>
            <input type="text" id="tempat_lahir" class="form-control" v-model="formItem.tempat_lahir" placeholder="" />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="saveData">Simpan</button>
      </div>
    </div>
  </div>
</div>
<!-- /Modal Form -->



  <!-- Modal View -->
<div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="formModalTitle">Data Karyawan</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="col mb-3">
          <label for="name" class="form-label">Nama</label>
          <input type="text" id="name" class="form-control" v-model="viewItem.name" placeholder="" disabled />
        </div>
        <div class="col mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="text" id="email" class="form-control" v-model="viewItem.email" placeholder="" disabled />
        </div>
        <div class="col mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" class="form-control" v-model="viewItem.password" placeholder="" disabled />
        </div>
        <div class="col mb-3">
          <label for="jabatan" class="form-label">Jabatan</label>
          <select id="jabatan" class="select2 form-select" v-model="viewItem.id_jabatan" disabled>
            <option value="CTO">CTO</option>
            <option value="HRD">HRD</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <div class="row g-2">
          <div class="col mb-0">
            <label for="keterangan" class="form-label">Keterangan</label>
            <select id="keterangan" class="select2 form-select" v-model="viewItem.keterangan" disabled>
              <option value="Karyawan">Karyawan</option>
              <option value="Freelance">Freelance</option>
              <option value="Partime">Partime</option>
              <option value="Probation">Probation</option>
            </select>
          </div>
          <div class="col mb-0">
            <label for="start_working" class="form-label">Mulai Bekerja</label>
            <input type="date" id="start_working" class="form-control" v-model="viewItem.start_working" placeholder="" disabled />
          </div>
        </div>
        <div class="row g-2">
          <div class="col mb-0">
            <label for="alamat" class="form-label">Alamat</label>
            <input type="text" id="alamat" class="form-control" v-model="viewItem.alamat" placeholder="" disabled />
          </div>
          <div class="col mb-0">
            <label for="pendidikan" class="form-label">Pendidikan</label>
            <select id="pendidikan" class="select2 form-select" v-model="viewItem.pendidikan" disabled>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>
        </div>
        <div class="row g-2">
          <div class="col mb-0">
            <label for="tanggal_lahir" class="form-label">Tanggal Lahir</label>
            <input type="date" id="tanggal_lahir" class="form-control" v-model="viewItem.tanggal_lahir" placeholder="" disabled />
          </div>
          <div class="col mb-0">
            <label for="tempat_lahir" class="form-label">Tempat Lahir</label>
            <input type="text" id="tempat_lahir" class="form-control" v-model="viewItem.tempat_lahir" placeholder="" disabled />
          </div>
        </div>
        <div class="col mb-0">
          <label for="status" class="form-label">Status</label>
          <div>
            <span :class="{'badge bg-label-success': viewItem.deskripsi === 'Aktif', 'badge bg-label-danger': viewItem.deskripsi === 'NonAktif'}">
              {{ viewItem.deskripsi }}
            </span>
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


  <!-- Modal Hapus -->
  <DeleteModal :onDelete="deleteData" />
  <!-- /Modal Hapus -->
  </div>
</template>
