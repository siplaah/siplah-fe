<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useApiDailyReportStore } from '@/stores/api/absensi/daily_report';
import { useAuthStore } from '@/stores/api/authStore';
import { useApiProjectStore } from '@/stores/api/master/project';
import Pagination from '../../components/pagination/Pagination.vue';
import DeleteModal from '../../components/modal/Delete.vue';
import { storeToRefs } from 'pinia';
import { format, parseISO, isValid, formatISO } from 'date-fns';
import { id } from 'date-fns/locale';

const searchMonthYear = ref('');
const searchQuery = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);

const apiDailyReportStore = useApiDailyReportStore();
const { listDailyReport } = storeToRefs(apiDailyReportStore);
const apiProjectStore = useApiProjectStore();
const { selectProject } = storeToRefs(apiProjectStore);
const apiAuthStore = useAuthStore();
const { employee } = storeToRefs(apiAuthStore);

const getData = async () => {
  await apiDailyReportStore.getDailyReport();
  await apiProjectStore.getProject();
};

onMounted(() => {
  getData();
});

const getProjectName = (id_project: number) => {
  const project = selectProject.value.find((emp: { value: number }) => emp.value === id_project);
  return project ? project.label : 'Unknown';
};

const formMode = ref<'add' | 'edit'>('add');
const formItem = ref({
  date: '',
  task: '',
  status: 'Todo',
  link: '',
  id_project: ''
});

const itemsPerPage = 10;
const currentPage = ref(1);
const totalItems = computed(() => listDailyReport.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const sourceData = searchMonthYear.value ? searchData.value : filteredData.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sourceData.slice(startIndex, endIndex);
});

const searchData = computed(() => {
  if (!searchMonthYear.value) {
    return filteredData.value;
  }
  const [searchYear, searchMonth] = searchMonthYear.value.split('-').map(Number);
  return filteredData.value.filter((item: { date: string | number | Date }) => {
    const itemDate = new Date(item.date);
    return itemDate.getFullYear() === searchYear && itemDate.getMonth() + 1 === searchMonth;
  });
});

const filteredData = computed(() => {
  return listDailyReport.value.filter(
    (daily_report: { id_employee: any }) => daily_report.id_employee === employee.value.id
  );
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
      date: formatISO(parseISO(selectedItem.date), { representation: 'date' }),
      task: selectedItem.task,
      status: selectedItem.status,
      link: selectedItem.link,
      id_project: selectedItem.id_project
    };
  } else {
    editedIndex.value = -1;
    formItem.value = {
      date: '',
      task: '',
      id_project: '',
      status: 'Todo',
      link: ''
    };
  }
};

const viewItem = ref({
  id_employee: '',
  date: '',
  task: '',
  id_project: '',
  status: '',
  link: ''
});

const openView = (item: {
  id_employee: string;
  date: string;
  task: string;
  id_project: string;
  status: string;
  link: string;
}) => {
  viewItem.value = { ...item };
};

const saveData = async () => {
  if (formMode.value === 'add') {
    await apiDailyReportStore.postDailyReport(formItem.value);
  } else if (formMode.value === 'edit') {
    const id = paginatedData.value[editedIndex.value].id_daily_report;
    await apiDailyReportStore.patchDailyReport(formItem.value, id);
  }
  await getData(); // Refresh data after saving
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const deleteData = async () => {
  const id = paginatedData.value[deletedIndex.value].id_daily_report;
  await apiDailyReportStore.deleteDailyReport(id);
  getData();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Daily Report</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center mb-3">
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

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th class="text-center">No</th>
              <th class="text-center">Tanggal</th>
              <th class="text-center">Task</th>
              <th class="text-center">Project</th>
              <th class="text-center">Status</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="text-center">{{ formatTanggal(item.date) }}</td>
              <td class="text-center">{{ item.task }}</td>
              <td class="text-center">{{ getProjectName(item.id_project) }}</td>
              <td>
                <span
                  :class="{
                    'badge bg-label-warning': item.status === 'Doing',
                    'badge bg-label-success': item.status === 'Done',
                    'badge bg-label-danger': item.status === 'Todo'
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
                  >
                    <i class="bx bx-show-alt me-1"></i> View
                  </span>
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
    <!--/ Striped Rows -->

    <!-- Form Modal -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel1">{{ formMode === 'edit' ? 'Edit' : 'Tambah' }} Daily Report</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-2">
              <div class="col mb-3">
                <label for="dateLarge" class="form-label">Tanggal</label>
                <input type="date" id="dateLarge" class="form-control" v-model="formItem.date" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-3">
                <label for="taskLarge" class="form-label">Task</label>
                <input type="text" id="taskLarge" class="form-control" v-model="formItem.task" placeholder="Task" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-3">
                <label for="projectLarge" class="form-label">Project</label>
                <select v-model="formItem.id_project" class="form-control">
                  <option value="">Select Project</option>
                  <option v-for="project in selectProject" :key="project.value" :value="project.value">
                    {{ project.label }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-3">
                <label for="statusLarge" class="form-label">Status</label>
                <select v-model="formItem.status" class="form-control">
                  <option value="Todo">Todo</option>
                  <option value="Doing">Doing</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-3">
                <label for="linkLarge" class="form-label">Link</label>
                <input type="text" id="linkLarge" class="form-control" v-model="formItem.link" placeholder="Link" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="saveData">Simpan</button>
          </div>
        </div>
      </div>
    </div>
    </div>
    <!--/ Form Modal -->



  <!-- Modal View -->
  <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="formModalTitle">Detail Daily Report</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col mb-3">
              <label for="date" class="form-label">Tanggal</label>
              <input type="date" id="date" class="form-control" v-model="viewItem.date" disabled />
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="task" class="form-label">Task</label>
              <input type="text" id="task" class="form-control" v-model="viewItem.task" disabled />
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="project" class="form-label">Project</label>
              <select class="form-select" id="project" v-model="viewItem.id_project" disabled>
                <option v-for="project in selectProject" :key="project.value" :value="project.value">
                  {{ project.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="row g-2">
            <div class="col mb-3 me-3">
              <label for="link" class="form-label">Link</label>
              <input type="text" id="link" class="form-control" v-model="viewItem.link" disabled />
            </div>
            <div class="col mb-0">
              <label for="status" class="form-label">Status</label>
              <div>
                <span
                  :class="{
                    'badge bg-label-warning': viewItem.status === 'Doing',
                    'badge bg-label-success': viewItem.status === 'Done',
                    'badge bg-label-danger': viewItem.status === 'Todo'
                  }"
                >
                  {{ viewItem.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
        </div>
      </div>
    </div>
  </div>

  <!--/ Modal View -->

  <!-- Modal Hapus -->
  <DeleteModal :onDelete="deleteData" />
  <!-- /Modal Hapus -->
</template>
