<script setup lang="ts">
import { ref, computed } from 'vue';

interface Item {
  nama: string;
  tanggal: string;
  task: string;
  project: string;
  status: string;
  link: string;
}

const data = ref<Item[]>([
  {
    nama: 'Arila',
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'Pending',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  },
  {
    nama: 'Nia',
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'Done',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  },
  {
    nama: 'Asih',
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'In Progress',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  }
  // Data dummy Anda di sini
]);

const viewItem = ref<Item>({
  nama: '',
  tanggal: '',
  task: '',
  project: '',
  status: '',
  link: ''
});

const openView = (item: Item) => {
  viewItem.value = { ...item };
  selectedItem.value = item; // Make sure selectedItem is set for the action buttons in the view modal
};

const selectedItem = ref<Item | null>(null);
const itemsPerPage = 5;
const currentPage = ref(1);
const searchQuery = ref(''); // State untuk query pencarian

const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(startIndex, startIndex + itemsPerPage);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const shortenLink = (link: string, length: number = 30) => {
  if (link.length <= length) return link;
  return link.substring(0, length) + '...';
};

// Computed property untuk memfilter data berdasarkan query pencarian
const filteredData = computed(() => {
  if (!searchQuery.value) return data.value;
  return data.value.filter(
    item =>
      item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
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

    <div class="col-md-4 d-flex justify-content-start align-items-center mb-3">
      <div class="input-group">
        <span class="input-group-text"><i class="bx bx-search-alt"></i></span>
        <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Daily Report..." />
      </div>
    </div>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th class="text-center">No</th>
              <th class="text-center">Nama</th>
              <th class="text-center">Tanggal</th>
              <th class="text-center">Task</th>
              <th class="text-center">Project</th>
              <th class="text-center">Status</th>
              <th class="text-center">Link</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through paginated data to display each row -->
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="text-center">{{ item.nama }}</td>
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
              <td class="text-center" v-if="item.link">
                <a :href="item.link" target="_blank">{{ shortenLink(item.link) }}</a>
              </td>
              <td class="text-center" v-else>-</td>
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination pagination-sm justify-content-center mt-3">
          <li class="page-item prev" :class="{ disabled: currentPage === 1 }" @click="changePage(currentPage - 1)">
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
          <li
            class="page-item next"
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            <a class="page-link" role="button"><i class="tf-icon bx bx-chevrons-right"></i></a>
          </li>
        </ul>
      </nav>
    </div>
    <!--/ Striped Rows -->

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
                <label for="karyawan" class="form-label">Nama</label>
                <input type="text" id="karyawan" class="form-control" v-model="viewItem.nama" disabled />
              </div>
            </div>
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
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!--/ Modal View -->
  </div>
</template>
