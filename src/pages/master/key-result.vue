<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import DeleteModal from '../../components/modal/Delete.vue';
import Pagination from '../../components/pagination/Pagination.vue';
import { useApiKeyResultStore } from '@/stores/api/master/keyResult';

const searchQuery = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref<'add' | 'edit'>('add');
const formItem = ref({ key_result: '', target: 80 });

const apiKeyResultStore = useApiKeyResultStore();
const { listKeyResult } = storeToRefs(apiKeyResultStore);

const getData = async () => {
  await apiKeyResultStore.getKeyResult();
};

onMounted(() => {
  getData();
});

const sortedKeyResults = computed(() => {
  return listKeyResult.value
    .slice()
    .sort((a: { id_key_result: number }, b: { id_key_result: number }) => a.id_key_result - b.id_key_result);
});

const itemsPerPage = 10;
const currentPage = ref(1);
const totalItems = computed(() => listKeyResult.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const filteredData = searchQuery.value
    ? sortedKeyResults.value.filter((item: { key_result: string }) =>
        item.key_result.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : sortedKeyResults.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredData.slice(startIndex, startIndex + itemsPerPage);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  formMode.value = mode;
  if (mode === 'edit') {
    editedIndex.value = index;
    formItem.value = { ...paginatedData.value[index] };
  } else {
    editedIndex.value = -1;
    formItem.value = { key_result: '', target: 80 };
  }
};

const formErrors: Ref<{ key_result: string | null; target: string | null }> = ref({
  key_result: null,
  target: null
});

function isNotEmpty() {
  return Object.values(formErrors.value).every(x => x === null || x === '');
}

function onValidate() {
  Object.keys(formErrors.value).forEach(key => {
    formErrors.value[key] = null;
  });
  if (!formItem.value.key_result || formItem.value.key_result.trim() === '') {
    formErrors.value.key_result = 'Key Result harus diisi';
  }
  if (!formItem.value.target || isNaN(Number(formItem.value.target))) {
    formErrors.value.target = 'Target is harus diisi';
  }
  if (isNotEmpty()) {
    saveData();
  }
}

const saveData = async () => {
  if (formMode.value === 'add') {
    await apiKeyResultStore.postKeyResult(formItem.value);
  } else if (formMode.value === 'edit') {
    const id = paginatedData.value[editedIndex.value].id_key_result;
    await apiKeyResultStore.putKeyResult(formItem.value, id);
  }
  getData();
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const deleteData = async () => {
  const id = paginatedData.value[deletedIndex.value].id_key_result;
  await apiKeyResultStore.deleteKeyResult(id);
  getData();
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
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.key_result }}</td>
              <td>{{ item.target }}</td>
              <td>
                <div>
                  <span
                    class="badge bg-label-warning me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#formModal"
                    @click="openModal('edit', index)"
                    ><i class="bx bx-edit-alt me-1"></i> Edit</span
                  >
                  <span
                    class="badge bg-label-danger me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                    @click="openDeleteModal(index)"
                    ><i class="bx bx-trash-alt me-1"></i> Hapus</span
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
                <textarea class="form-control" id="keyResult" rows="3" v-model="formItem.key_result"></textarea>
                <div class="d-block text-danger" v-if="formErrors.key_result">{{ formErrors.key_result }}</div>
              </div>
              <div class="mb-3">
                <label for="target" class="form-label">Target</label>
                <input type="number" id="target" class="form-control" v-model="formItem.target" />
                <div class="d-block text-danger" v-if="formErrors.target">{{ formErrors.target }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="onValidate">Simpan</button>
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
