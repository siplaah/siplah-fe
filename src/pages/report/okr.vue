<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
// import Pagination from '../../components/pagination/Pagination.vue';
import { useApiAssessmentStore } from '@/stores/api/report/assessment';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { useApiKeyResultStore } from '@/stores/api/master/keyResult';
import { storeToRefs } from 'pinia';

const searchQuery = ref('');

const apiAssessmentStore = useApiAssessmentStore();
const { listAssessment } = storeToRefs(apiAssessmentStore);
const apiEmployeeStore = useApiEmployeeStore();
const { selectedEmployee } = storeToRefs(apiEmployeeStore);
const apiKeyResultStore = useApiKeyResultStore();
const { listKeyResult, selectKeyResult } = storeToRefs(apiKeyResultStore);

const getData = async () => {
  await apiAssessmentStore.getAssessment();
  await apiEmployeeStore.getEmployee();
  await apiKeyResultStore.getKeyResult();
};

onMounted(() => {
  getData();
});

const getAvgTarget = () => {
  if (!Array.isArray(listKeyResult.value) || listKeyResult.value.length === 0) return 0;
  const totalTarget = listKeyResult.value.reduce((acc: any, kr: { target: any }) => acc + kr.target, 0);
  return totalTarget / listKeyResult.value.length;
};

const itemsPerPage = 10;
const currentPage = ref(1);
const totalItems = computed(() => listAssessment.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
const paginatedData = computed(() => {
  const sourceData = searchQuery.value ? filteredData.value : listAssessment.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sourceData.slice(startIndex, endIndex);
});

const filteredData = computed(() => {
  if (!searchQuery.value) return listAssessment.value;
  return listAssessment.value.filter((item: { employee: { nama: string } }) =>
    item.employee.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const addKeyResult = () => {
  formItem.value.assessments.push({ id_key_result: null, type: 'should_increase_to', realisasi: 0 });
};
const removeKeyResult = (index: number) => {
  formItem.value.assessments.splice(index, 1);
};

const formItem = ref({
  id_employee: null,
  assessments: [
    {
      id_key_result: null,
      type: 'should_increase_to',
      realisasi: 0
    }
  ]
});

const createAssessment = async () => {
  const payload = {
    id_employee: formItem.value.id_employee,
    assessment: formItem.value.assessments.map(({ id_key_result, type, realisasi }) => ({
      id_key_result,
      type,
      realisasi
    }))
  };

  await apiAssessmentStore.postAssessment(payload);

  formItem.value = {
    id_employee: null,
    assessments: [{ id_key_result: null, type: 'should_increase_to', realisasi: 0 }]
  };
  await getData();
};

const getKeyResultName = (id_key_result: number) => {
  const keyResult = listKeyResult.value.find((kr: { id_key_result: number }) => kr.id_key_result === id_key_result);
  return keyResult ? keyResult.key_result : 'Unknown';
};

const formatType = (type: string) => {
  return type.replace(/_/g, ' ');
};

type SelectedItem = {
  employee: {
    nama: string;
  };
  assessment: {
    id_key_result: number;
    type: string;
    target: number;
    realisasi: number;
    nilai_akhir: number;
  }[];
  total_nilai: number;
};

const selectedItem = ref<SelectedItem | null>(null);

const openView = (item: any) => {
  selectedItem.value = {
    employee: item.employee,
    assessment: item.assessment,
    total_nilai: item.total_nilai
  };
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Report /</span> OKR</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-search-alt"></i></span>
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Key Results..." />
        </div>
      </div>
      <div class="col-md-8 d-flex justify-content-end align-items-center">
        <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#createModal">
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
              <th>No</th>
              <th>Karyawan</th>
              <th>Target</th>
              <th>Total Nilai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-if="paginatedData.length === 0">
              <td colspan="6" class="text-center">Penilaian Karyawan masih kosong</td>
            </tr>

            <tr v-else v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <!-- <td>{{ item.month }}</td> -->
              <td>{{ item.employee.nama }}</td>
              <td>{{ getAvgTarget() }}</td>
              <td>
                <span class="badge rounded-pill bg-success">
                  {{ item.total_nilai }}
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

    <!-- Modal View -->
    <div class="modal fade" id="viewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">Detail Key Results</h5>
            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedItem">
            <div class="row align-items-start mb-3">
              <div class="col-md-4 d-flex justify-content-start align-items-center">
                <h6>{{ selectedItem.employee.nama }}</h6>
              </div>
              <div class="col-md-8 d-flex justify-content-end align-items-center">
                <!-- <h6>{{ selectedItem.month }}</h6> -->
              </div>
            </div>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>No</th>
                  <th class="w-50">Key Results</th>
                  <th>Type</th>
                  <th>Target</th>
                  <th>Realisasi</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody class="table-border-bottom-0">
                <tr v-for="(assessment, index) in selectedItem.assessment" :key="index">
                  <td>{{ `${index + 1}` }}</td>
                  <td>{{ getKeyResultName(assessment.id_key_result) }}</td>
                  <td>{{ formatType(assessment.type) }}</td>
                  <td>{{ assessment.target }}</td>
                  <td>{{ assessment.realisasi }}</td>
                  <td>{{ assessment.nilai_akhir }}</td>
                </tr>
                <tr>
                  <td colspan="5" class="text-end"><strong>Total</strong></td>
                  <td>{{ selectedItem.total_nilai }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal View -->

    <!-- Modal Create -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createModalTitle">Create Assessment</h5>
            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="employee" class="form-label">Employee</label>
              <select v-model="formItem.id_employee" id="employee" class="form-select">
                <option v-for="employee in selectedEmployee" :key="employee.value" :value="employee.value">
                  {{ employee.label }}
                </option>
              </select>
            </div>
            <div v-for="(keyResult, index) in formItem.assessments" :key="index" class="mb-3">
              <div class="row">
                <div class="col-md-3">
                  <label for="keyResult" class="form-label">Key Result</label>
                  <select v-model="keyResult.id_key_result" class="form-select">
                    <option v-for="kr in selectKeyResult" :key="kr.value" :value="kr.value">
                      {{ kr.label }}
                    </option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="type" class="form-label">Type</label>
                  <select v-model="keyResult.type" class="form-select">
                    <option value="should_increase_to">should increase to</option>
                    <option value="should_decrease_to">should decrease to</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="realisasi" class="form-label">Realisasi</label>
                  <input type="number" v-model="keyResult.realisasi" class="form-control" />
                </div>
                <div class="col-md-1 d-flex align-items-end">
                  <button type="button" class="btn btn-danger" @click="removeKeyResult(index)">Remove</button>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-success" @click="addKeyResult">Add Key Result</button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="createAssessment" data-bs-dismiss="modal">
              Save
            </button>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Create -->
  </div>
</template>
