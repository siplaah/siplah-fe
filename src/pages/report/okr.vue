<script setup lang="ts">
import { ref } from 'vue';

interface KeyResult {
  key_result: string;
  type: string;
  target: string;
  realisasi: string;
  nilai_akhir: string;
}

interface OkrItem {
  month: string;
  karyawan: string;
  key_results: KeyResult[];
}

const data = ref<OkrItem[]>([
  {
    month: 'Juni',
    karyawan: 'Emily Wilson',
    key_results: [
      {
        key_result: 'Fastrespon terhadap pertanyaan dan diskusi di dalam grup project',
        type: 'should stay above',
        target: '80',
        realisasi: '81',
        nilai_akhir: '100'
      },
      {
        key_result: 'Menunjukkan sikap responsif kepada Leader di dalam team',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      },
      {
        key_result: 'Menyelesaikan pekerjaan lebih cepat atau sebelum tenggat waktu yang diberikan',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      },
      {
        key_result: 'Menunjukkan kreativitas terhadap setiap task yang diberikan',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      }
    ]
  },
  {
    month: 'Juni',
    karyawan: 'David',
    key_results: [
      {
        key_result: 'Fastrespon terhadap pertanyaan dan diskusi di dalam grup project',
        type: 'should stay above',
        target: '80',
        realisasi: '81',
        nilai_akhir: '100'
      },
      {
        key_result: 'Menunjukkan sikap responsif kepada Leader di dalam team',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      },
      {
        key_result: 'Menyelesaikan pekerjaan lebih cepat atau sebelum tenggat waktu yang diberikan',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      },
      {
        key_result: 'Menunjukkan kreativitas terhadap setiap task yang diberikan',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      }
    ]
  },
  {
    month: 'Mei',
    karyawan: 'Rian',
    key_results: [
      {
        key_result: 'Fastrespon terhadap pertanyaan dan diskusi di dalam grup project',
        type: 'should stay above',
        target: '80',
        realisasi: '81',
        nilai_akhir: '100'
      },
      {
        key_result: 'Menunjukkan sikap responsif kepada Leader di dalam team',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      },
      {
        key_result: 'Menyelesaikan pekerjaan lebih cepat atau sebelum tenggat waktu yang diberikan',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      },
      {
        key_result: 'Menunjukkan kreativitas terhadap setiap task yang diberikan',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      }
    ]
  },
  {
    month: 'Maret',
    karyawan: 'Ahmeng',
    key_results: [
      {
        key_result: 'Fastrespon terhadap pertanyaan dan diskusi di dalam grup project',
        type: 'should stay above',
        target: '80',
        realisasi: '81',
        nilai_akhir: '100'
      },
      {
        key_result: 'Menunjukkan sikap responsif kepada Leader di dalam team',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      },
      {
        key_result: 'Menyelesaikan pekerjaan lebih cepat atau sebelum tenggat waktu yang diberikan',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      },
      {
        key_result: 'Menunjukkan kreativitas terhadap setiap task yang diberikan',
        type: 'should stay above',
        target: '80',
        realisasi: '0',
        nilai_akhir: '0'
      }
    ]
  }
]);

const selectedEmployee = ref<OkrItem | null>(null);

const openView = (employee: OkrItem) => {
  selectedEmployee.value = employee;
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
              <th>Bulan</th>
              <th>Karyawan</th>
              <th>Target</th>
              <th>Total Nilai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.month }}</td>
              <td>{{ item.karyawan }}</td>
              <td>{{ item.key_results[0].target }}</td>
              <td>
                <span class="badge rounded-pill bg-success">
                  {{ item.key_results.reduce((acc, kr) => acc + parseInt(kr.nilai_akhir), 0) }}
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
                  <td>{{ selectedEmployee?.key_results.reduce((acc, kr) => acc + parseInt(kr.nilai_akhir), 0) }}</td>
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
  </div>
</template>
