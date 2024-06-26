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
// const { selectedEmployee } = storeToRefs(apiEmployeeStore);
const apiKeyResultStore = useApiKeyResultStore();
// const { selectKeyResult } = storeToRefs(apiKeyResultStore);

const getData = async () => {
  await apiAssessmentStore.getAssessment();
  await apiEmployeeStore.getEmployee();
  await apiKeyResultStore.getKeyResult();
};

onMounted(() => {
  getData();
});

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
  return listAssessment.value.filter((item: { employee: { nama: string; }; }) => item.employee.nama.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Report /</span> OKR</h4>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <!-- <th>Bulan</th> -->
              <th>Karyawan</th>
              <th>Target</th>
              <th>Total Nilai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <!-- <td>{{ item.month }}</td> -->
              <td>{{ item.employee.nama }}</td>
              <td>{{ item.target }}</td>
              <td>
                <span class="badge rounded-pill bg-success">
                  {{ item.total_nilai }}
                </span>
              </td>
              <td>
                <div>
                  <!-- <span
                    class="badge bg-label-info me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#viewModal"
                    @click="openView(item)"
                    ><i class="bx bx-edit-alt me-1"></i> View</span
                  > -->
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
    <!-- <div class="modal fade" id="viewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">Detail Key Results</h5>
            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row align-items-start mb-3">
              <div class="col-md-4 d-flex justify-content-start align-items-center">
                <h6>{{ selectedEmployee?.karyawan }}</h6>
              </div>
              <div class="col-md-8 d-flex justify-content-end align-items-center">
                <h6>{{ selectedEmployee?.month }}</h6>
              </div>
            </div>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Key Results</th>
                  <th>Type</th>
                  <th>Target</th>
                  <th>Realisasi</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody class="table-border-bottom-0">
                <tr v-for="(item, index) in selectedEmployee?.key_results" :key="index">
                  <td>{{ `${index + 1}` }}</td>
                  <td>{{ item.key_result }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.target }}</td>
                  <td>{{ item.realisasi }}</td>
                  <td>{{ item.nilai_akhir }}</td>
                </tr>
                <tr>
                  <td colspan="5" class="text-end"><strong>Total</strong></td>
                  <td>{{ selectedEmployee?.key_results.reduce((acc: number, kr: { nilai_akhir: string; }) => acc + parseInt(kr.nilai_akhir), 0) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div> -->
    <!-- /Modal View -->
  </div>
</template>
