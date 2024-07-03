<!-- <route lang="yaml">
meta:
  layout: default
  requiresAuth: true
  jabatan: HRD
</route> -->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useApiProjectStore } from '@/stores/api/master/project';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
// import DeleteModal from '../../components/modal/Delete.vue';

const searchQuery = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref<'add' | 'edit'>('add');
const formItem = ref({
  name_project: '',
  id_employee: ''
});

const apiProjectStore = useApiProjectStore();
const { listProject } = storeToRefs(apiProjectStore);
const apiEmployeeStore = useApiEmployeeStore();
const { selectedEmployee } = storeToRefs(apiEmployeeStore);

const getEmployeeName = (id_employee: number) => {
  const employee = selectedEmployee.value.find((emp: { value: number }) => emp.value === id_employee);
  return employee ? employee.label : 'Unknown';
};

const getData = async () => {
  await apiProjectStore.getProject();
  await apiEmployeeStore.getEmployee();
};

onMounted(() => {
  getData();
});

const itemsPerPage = 5; // Jumlah item yang ingin ditampilkan per halaman
const currentPage = ref(1); // Halaman saat ini yang ditampilkan

const totalItems = computed(() => listProject.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const sortedProject = computed(() => {
  return listProject.value
    .slice()
    .sort((a: { id_project: number }, b: { id_project: number }) => a.id_project - b.id_project);
});

const paginatedData = computed(() => {
  const filteredData = searchQuery.value
    ? sortedProject.value.filter((item: { name_project: string }) =>
        item.name_project.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : sortedProject.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredData.slice(startIndex, startIndex + itemsPerPage);
});

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  formMode.value = mode;
  if (mode === 'edit') {
    editedIndex.value = index;
    const selectedItem = paginatedData.value[index];
    formItem.value = {
      name_project: selectedItem.name_project,
      id_employee: selectedItem.id_employee
    };
  } else {
    editedIndex.value = -1;
    formItem.value = {
      name_project: '',
      id_employee: ''
    };
  }
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const deleteData = async () => {
  const id = paginatedData.value[deletedIndex.value].id_project;
  await apiProjectStore.deleteProject(id);
  getData();
};

const saveData = async () => {
  if (formMode.value === 'add') {
    await apiProjectStore.postProject(formItem.value);
  } else if (formMode.value === 'edit') {
    const id = paginatedData.value[editedIndex.value].id_project;
    await apiProjectStore.patchProject(formItem.value, id);
  }
  getData();
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Master /</span> Data Project</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-search-alt"></i></span>
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Project..." />
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

    <!-- Table -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th style="width: 10%">No</th>
              <th style="padding-right: 20px; width: 60%">Project Manager</th>
              <th style="padding-right: 20px; width: 60%">Project</th>
              <th style="width: 30%">Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ getEmployeeName(item.id_employee) }}</td>
              <td>{{ item.name_project }}</td>
              <td>
                <div>
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
      <nav aria-label="Page navigation">
        <ul class="pagination pagination-sm justify-content-center mt-3">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" @click="currentPage > 1 && (currentPage -= 1)">
              <i class="tf-icon bx bx-chevrons-left"></i>
            </a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <a class="page-link" @click="currentPage = page">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" @click="currentPage < totalPages && (currentPage += 1)">
              <i class="tf-icon bx bx-chevrons-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <!-- Table -->

    <!-- Modal Form -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">{{ formMode === 'edit' ? 'Edit' : 'Tambah' }} Project</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="mb-3">
                <label for="project_manager" class="form-label select-label">Project Manager</label>
                <select class="form-select" id="project_manager" v-model="formItem.id_employee">
                  <option v-for="employee in selectedEmployee" :key="employee.value" :value="employee.value">
                    {{ employee.label }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="project" class="form-label">Project</label>
                <input class="form-control" id="project-name" v-model="formItem.name_project" />
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
