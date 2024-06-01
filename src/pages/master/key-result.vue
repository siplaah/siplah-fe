<script setup lang="ts">
import { computed, ref } from 'vue';
import DeleteModal from '../../components/modal/Delete.vue'; // Import the DeleteModal component
import Pagination from '../../components/pagination/Pagination.vue'; // Import the Pagination component

const data = ref([
  { keyResult: 'Fastrespons terhadap pertanyaan dan diskusi di dalam grup project', target: '80' },
  { keyResult: 'Menunjukkan sikap responsif kepada Leader di dalam team', target: '80' },
  { keyResult: 'Menyelesaikan pekerjaan lebih cepat atau sebelum tenggat waktu yang diberikan', target: '80' },
  { keyResult: 'Menunjukkan kreativitas terhadap setiap task yang diberikan', target: '80' },
  { keyResult: 'Menyelesaikan pekerjaan lebih cepat atau sebelum tenggat waktu yang diberikan', target: '80' },
  { keyResult: 'Menunjukkan kreativitas terhadap setiap task yang diberikan', target: '80' },
]);

const searchQuery = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref('add'); // 'add' or 'edit'
const formItem = ref({ keyResult: '', target: '' });

const itemsPerPage = 5; // Jumlah item yang ingin ditampilkan per halaman
const currentPage = ref(1); // Halaman saat ini yang ditampilkan

const totalItems = computed(() => data.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const sourceData = searchQuery.value ? filteredData.value : data.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sourceData.slice(startIndex, endIndex);
});

const filteredData = computed(() => {
  if (!searchQuery.value) return data.value;
  return data.value.filter(item => item.keyResult.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  formMode.value = mode;
  if (mode === 'edit') {
    editedIndex.value = index;
    formItem.value = { ...data.value[index] };
  } else {
    editedIndex.value = -1;
    formItem.value = { keyResult: '', target: '' };
  }
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const saveData = () => {
  if (formMode.value === 'edit' && editedIndex.value !== -1) {
    data.value.splice(editedIndex.value, 1, formItem.value);
  } else if (formMode.value === 'add') {
    data.value.push({ ...formItem.value });
  }
  formItem.value = { keyResult: '', target: '' };
};

const deleteData = () => {
  if (deletedIndex.value !== -1) {
    data.value.splice(deletedIndex.value, 1);
    deletedIndex.value = -1;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Master /</span> Key Result</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-search-alt"></i></span>
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Key Results..." />
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

    <!-- <Table> -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th style="width: 10%">No KR</th>
              <th style="padding-right: 20px; width: 60%">Key Results</th>
              <th>Target</th>
              <th style="width: 30%">Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>KR {{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.keyResult }}</td>
              <td>{{ item.target }}</td>
              <td>
                <div>
                  <span
                    class="badge bg-label-warning me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#formModal"
                    @click="openModal('edit', (currentPage - 1) * itemsPerPage + index)"
                    ><i class="bx bx-edit-alt me-1"></i> Edit</span
                  >
                  <span
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
    <!-- </Table> -->

    <!-- Modal Form -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">{{ formMode === 'edit' ? 'Edit' : 'Tambah' }} Key Result</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="mb-3">
                <label for="keyResult" class="form-label">Key Result</label>
                <textarea class="form-control" id="keyResult" rows="3" v-model="formItem.keyResult"></textarea>
              </div>
              <div class="mb-3">
                <label for="target" class="form-label">Target</label>
                <input type="number" id="target" class="form-control" v-model="formItem.target" />
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
    <DeleteModal :onDelete="deleteData" />
    <!-- /Modal Hapus -->
  </div>
</template>
