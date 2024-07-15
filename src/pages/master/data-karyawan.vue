<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { format, parseISO, isValid, formatISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { useApiJabatanStore } from '@/stores/api/master/jabatan';
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
  gender: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  start_working: '',
  id_jabatan: '',
  deskripsi: 'Aktif'
});
const formItemAdd = ref({
  name: '',
  email: '',
  password: '',
  id_jabatan: ''
});

const apiEmployeeStore = useApiEmployeeStore();
const { listEmployee } = storeToRefs(apiEmployeeStore);
const apiJabatanStore = useApiJabatanStore();
const { selectJabatan } = storeToRefs(apiJabatanStore);

const getJabatanName = (id_jabatan: number) => {
  const jabatan = selectJabatan.value.find((emp: { value: number }) => emp.value === id_jabatan);
  return jabatan ? jabatan.label : 'Unknown';
};

const getData = async () => {
  await apiEmployeeStore.getEmployee();
  await apiJabatanStore.getJabatan();
};

const itemsPerPage = 10;
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

onMounted(() => {
  getData();
});

const formatTanggal = (tanggal: string) => {
  const date = parseISO(tanggal);
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  return format(date, 'dd MMMM yyyy', { locale: id });
};

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  formMode.value = mode;
  if (mode === 'edit') {
    editedIndex.value = index;
    const selectedItem = paginatedData.value[index];
    formItem.value = {
      name: selectedItem.name,
      email: selectedItem.email,
      keterangan: selectedItem.keterangan,
      start_working: formatISO(parseISO(selectedItem.start_working), { representation: 'date' }), // Adjust format as needed
      alamat: selectedItem.alamat,
      gender: selectedItem.gender,
      pendidikan: selectedItem.pendidikan,
      tanggal_lahir: formatISO(parseISO(selectedItem.tanggal_lahir), { representation: 'date' }), // Adjust format as needed
      tempat_lahir: selectedItem.tempat_lahir,
      id_jabatan: selectedItem.id_jabatan,
      password: selectedItem.password,
      deskripsi: selectedItem.deskripsi
    };
  } else {
    editedIndex.value = -1;
    formItemAdd.value = {
      name: '',
      email: '',
      password: '',
      id_jabatan: ''
    };
  }
};

const viewItem = ref({
  name: '',
  email: '',
  keterangan: '',
  start_working: '',
  gender: '',
  alamat: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  status: '',
  id_jabatan: '',
  password: '',
  deskripsi: ''
});

const openView = (item: {
  name: string;
  email: string;
  keterangan: string;
  start_working: string;
  gender: string;
  alamat: string;
  pendidikan: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  status: string;
  id_jabatan: string;
  password: string;
  deskripsi: string;
}) => {
  viewItem.value = { ...item };
};

const saveData = async () => {
  if (formMode.value === 'add') {
    await apiEmployeeStore.postEmployee(formItemAdd.value);
  } else if (formMode.value === 'edit') {
    const id = paginatedData.value[editedIndex.value].id_employee;
    await apiEmployeeStore.patchEmployee(formItem.value, id);
  }
  getData();
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
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
              <td>{{ getJabatanName(item.id_jabatan) }}</td>
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
                    data-bs-target="#deleteModal"
                    @click="openDeleteModal(index)"
                    ><i class="bx bx-trash me-1"></i> Delete</span
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
        <div v-if="formMode === 'add'">
          <div class="row">
            <div class="col mb-3">
              <label for="name" class="form-label">Nama</label>
              <input type="text" id="name" class="form-control" v-model="formItemAdd.name" placeholder="" />
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="text" id="email" class="form-control" v-model="formItemAdd.email" placeholder="" />
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" class="form-control" v-model="formItemAdd.password" placeholder="" />
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="jabatan" class="form-label">Jabatan</label>
              <select class="form-select" id="jabatan" v-model="formItemAdd.id_jabatan">
                <option v-for="jabatan in selectJabatan" :key="jabatan.value" :value="jabatan.value">
                  {{ jabatan.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div v-if="formMode === 'edit'">
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
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" class="form-control" v-model="formItem.password" placeholder="" />
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="jabatan" class="form-label">Jabatan</label>
              <select class="form-select" id="jabatan" v-model="formItem.id_jabatan">
                <option v-for="jabatan in selectJabatan" :key="jabatan.value" :value="jabatan.value">
                  {{ jabatan.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="deskripsi" class="form-label">Status</label>
              <select class="form-select" id="deskripsi" v-model="formItem.deskripsi">
                <option value="Aktif">Aktif</option>
                  <option value="NonAktif">NonAktif</option>
              </select>
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
              <label for="jabatan" class="form-label">Jabatan</label>
              <select id="jabatan" class="select2 form-select" :value="viewItem.id_jabatan" disabled>
                <option value="CTO">CTO</option>
                <option value="HRD">HRD</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="gender" class="form-label">Gender</label>
                <select id="gender" class="select2 form-select" v-model="viewItem.gender"  disabled>
                  <option value="Pria">Pria</option>
                  <option value="Wanita">Wanita</option>
                </select>
              </div>
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
                <input
                  type="text"
                  id="start_working"
                  class="form-control"
                  :value="formatTanggal(viewItem.start_working)"
                  disabled
                />
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
                <input
                  type="text"
                  id="start_working"
                  class="form-control"
                  :value="formatTanggal(viewItem.tanggal_lahir)"
                  disabled
                />
              </div>
              <div class="col mb-0">
                <label for="tempat_lahir" class="form-label">Tempat Lahir</label>
                <input
                  type="text"
                  id="tempat_lahir"
                  class="form-control"
                  v-model="viewItem.tempat_lahir"
                  placeholder=""
                  disabled
                />
              </div>
            </div>
            <div class="col mb-0">
              <label for="status" class="form-label">Status</label>
              <div>
                <span
                  :class="{
                    'badge bg-label-success': viewItem.deskripsi === 'Aktif',
                    'badge bg-label-danger': viewItem.deskripsi === 'NonAktif'
                  }"
                >
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
