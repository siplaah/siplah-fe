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
    status: 'DONE',
    link: 'https://www.notion.so/05ba812200874f7a9825d28d519e2325?v=3d27b728f7c540b491ca44a8c725a2cb'
  },
  {
    nama: 'Arila',
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'DONE',
    link: 'https://github.com/siplaah/siplah-fe/commits/main/'
  },
  {
    nama: 'Ajeng',
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'DONE',
    link: ''
  },
  {
    nama: 'Nia',
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'DONE',
    link: ''
  },
  {
    nama: 'Asih',
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'DONE',
    link: ''
  },
  {
    nama: 'Wahyu',
    tanggal: '1 Maret 2024',
    task: 'mengerjakan slicing',
    project: 'SIPLAH',
    status: 'DONE',
    link: ''
  }
]);

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
  return data.value.filter(item => 
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
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Key Results..." />
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
              <td class="text-center">{{ item.status }}</td>
              <td class="text-center" v-if="item.link">
                <a :href="item.link" target="_blank">{{ shortenLink(item.link) }}</a>
              </td>
              <td class="text-center" v-else>-</td>
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
  </div>
</template>
