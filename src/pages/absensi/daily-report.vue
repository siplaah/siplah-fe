<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApiDailyReportStore } from '@/stores/api/absensi/daily_report';
import { storeToRefs } from 'pinia';

interface Item {
  tanggal: string;
  task: string;
  project: string;
  status: string;
  link: string;
}

// const formItem = ref (
//   {
//     id_employee: '',
//     date:'',
//     task:'',
//     status:'',
//     link:'',
//   }
// )

const data = ref<Item[]>([
  {
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'Pending',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  },
  {
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'Done',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  },
  {
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'In Progress',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  },
  {
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'In Progress',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  },
  {
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'In Progress',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  },
  {
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'In Progress',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  }
]);

const viewItem = ref<Item>({
  tanggal: '',
  task: '',
  project: '',
  status: '',
  link: ''
});

const editItem = ref<Item>({
  tanggal: '',
  task: '',
  project: '',
  status: '',
  link: ''
});

const selectedItem = ref<Item | null>(null);
const isEditModalOpen = ref(false);

const openView = (item: Item) => {
  viewItem.value = { ...item };
};

const openEdit = (item: Item) => {
  editItem.value = { ...item };
  selectedItem.value = item;
  isEditModalOpen.value = true;
};

const saveEdit = () => {
  if (selectedItem.value) {
    Object.assign(selectedItem.value, editItem.value);
    selectedItem.value = null;
    isEditModalOpen.value = false; // Close the modal
  }
};

const addItem = ref<Item>({
  tanggal: '',
  task: '',
  project: '',
  status: 'Pending',
  link: ''
});

const isAddModalOpen = ref(false);

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const saveAdd = () => {
  data.value.push({ ...addItem.value });
  addItem.value = {
    tanggal: '',
    task: '',
    project: '',
    status: 'Pending',
    link: ''
  };
  isAddModalOpen.value = false; // Close the modal
};

const deleteItem = () => {
  if (selectedItem.value) {
    data.value = data.value.filter(item => item !== selectedItem.value);
    selectedItem.value = null;
  }
};

const itemsPerPage = 5;
const currentPage = ref(1);
const searchQuery = ref('');

const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(startIndex, startIndex + itemsPerPage);
});

const filteredData = computed(() => {
  if (!searchQuery.value) return data.value;
  return data.value.filter(
    item =>
      item.tanggal.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.task.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.link.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
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
          data-bs-target="#addModal"
          @click="openAddModal"
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
              <td class="text-center">{{ item.tanggal }}</td>
              <td class="text-center">{{ item.task }}</td>
              <td class="text-center">{{ item.project }}</td>
              <td>
                <span
                  :class="{
                    'badge bg-label-warning': item.status === 'In Progress',
                    'badge bg-label-success': item.status === 'Done',
                    'badge bg-label-danger': item.status === 'Pending'
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
                    data-bs-target="#editModal"
                    @click="openEdit(item)"
                  >
                    <i class="bx bx-edit-alt me-1"></i> Edit
                  </span>
                  <span
                    class="badge bg-label-danger"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#smallModal"
                    @click="selectedItem = item"
                  >
                    <i class="bx bx-trash-alt me-1"></i> Delete
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
    <!--/ Striped Rows -->

    <!-- Modal Tambah -->
    <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true" :class="{'show d-block': isAddModalOpen, 'fade': !isAddModalOpen}" style="display: none;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addModalLabel">Tambah Daily Report</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="isAddModalOpen = false"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="addTanggalMulai" class="form-label">Tanggal</label>
                <input type="text" id="addTanggalMulai" class="form-control" v-model="addItem.tanggal" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="addTipe" class="form-label">Task</label>
                <input type="text" id="addTipe" class="form-control" v-model="addItem.task" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="addProject" class="form-label">Project</label>
                <input type="text" id="addProject" class="form-control" v-model="addItem.project" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="addLink" class="form-label">Link</label>
                <input type="text" id="addLink" class="form-control" v-model="addItem.link" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-0">
                <label for="addStatus" class="form-label">Status</label>
                <select id="addStatus" class="form-select" v-model="addItem.status">
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="isAddModalOpen = false">Tutup</button>
            <button type="button" class="btn btn-primary" @click="saveAdd">Simpan</button>
          </div>
        </div>
      </div>
    </div>
    <!--/ Modal Tambah -->


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
                <label for="tanggalMulai" class="form-label">Tanggal</label>
                <input type="text" id="tanggalMulai" class="form-control" v-model="viewItem.tanggal" disabled />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="tipe" class="form-label">Task</label>
                <input type="text" id="tipe" class="form-control" v-model="viewItem.task" disabled />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="project" class="form-label">Project</label>
                <input type="text" id="project" class="form-control" v-model="viewItem.project" disabled />
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
                      'badge bg-label-warning': viewItem.status === 'In Progress',
                      'badge bg-label-success': viewItem.status === 'Done',
                      'badge bg-label-danger': viewItem.status === 'Pending'
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

    <!-- Modal Edit -->
    <div
      v-if="isEditModalOpen"
      class="modal fade show d-block"
      id="editModal"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Edit Daily Report</h5>
            <button type="button" class="btn-close" @click="isEditModalOpen = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row"></div>
            <div class="row">
              <div class="col mb-3">
                <label for="editTanggalMulai" class="form-label">Tanggal</label>
                <input type="text" id="editTanggalMulai" class="form-control" v-model="editItem.tanggal" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editTipe" class="form-label">Task</label>
                <input type="text" id="editTipe" class="form-control" v-model="editItem.task" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editProject" class="form-label">Project</label>
                <input type="text" id="editProject" class="form-control" v-model="editItem.project" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editLink" class="form-label">Link</label>
                <input type="text" id="editLink" class="form-control" v-model="editItem.link" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-0">
                <label for="editStatus" class="form-label">Status</label>
                <select id="editStatus" class="form-select" v-model="editItem.status">
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="isEditModalOpen = false">Tutup</button>
            <button type="button" class="btn btn-primary" @click="saveEdit">Simpan</button>
          </div>
        </div>
      </div>
    </div>
    <!--/ Modal Edit -->

    <!-- Modal Delete -->
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
            <button type="button" class="btn btn-primary" @click="deleteItem" data-bs-dismiss="modal">Ya</button>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tidak</button>
          </div>
        </div>
      </div>
    </div>
    <!--/ Modal Delete -->
  </div>
</template>
