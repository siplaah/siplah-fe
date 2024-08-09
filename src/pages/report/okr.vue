<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import DeleteModal from '@/components/modal/Delete.vue';
import Pagination from '@/components/pagination/Pagination2.vue';
import { useApiAssessmentStore } from '@/stores/api/report/assessment';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { useApiKeyResultStore } from '@/stores/api/master/keyResult';
import { storeToRefs } from 'pinia';
import { formatTanggal, getAvgTarget, getKeyResultName, formatType, getKeyResultTarget, formatDateForInput } from './helper/okr'
import { useAuthStore } from '@/stores/api/authStore';

const searchQuery = ref('');
const searchMonthYear = ref('');
const formMode = ref<'add' | 'edit'>('add');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const paramsKeyResult = ref({ page: 1, pageSize: 10 });
const paramsAssessment = ref({ page: 1, pageSize: 10 });
const errorMessage = ref('');
const keyResultErrors = ref<string[]>([]);
const formErrors = ref<string[]>([]);

const apiAssessmentStore = useApiAssessmentStore();
const { listAssessment, totalData } = storeToRefs(apiAssessmentStore);
const apiEmployeeStore = useApiEmployeeStore();
const { selectedEmployee } = storeToRefs(apiEmployeeStore);
const apiKeyResultStore = useApiKeyResultStore();
const { listKeyResult, selectKeyResult } = storeToRefs(apiKeyResultStore);
const auth = useAuthStore();

const getData = async () => {
  await apiAssessmentStore.getAssessment({ ...paramsAssessment.value, q: searchQuery.value, date: searchMonthYear.value});
  await apiEmployeeStore.getEmployee();
  await apiKeyResultStore.getKeyResult({ ...paramsKeyResult.value });
};

onMounted(() => {
  getData();
});

const addKeyResult = () => {
  formItem.value.assessments.push({ id_key_result: 0, type: 'should_increase_to', realisasi: null, target: 0 });
  keyResultErrors.value.push('');
  formErrors.value.push('');
};
const removeKeyResult = (index: number) => {
  formItem.value.assessments.splice(index, 1);
  keyResultErrors.value.splice(index, 1);
  formErrors.value.splice(index, 1);
};

const formItem = ref({
  id_employee: 0,
  date: '',
  assessments: [
    {
      id_key_result: 0,
      type: 'should_increase_to',
      realisasi: null,
      target: 0
    }
  ]
});


const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  formMode.value = mode;
  errorMessage.value = ''; 
  keyResultErrors.value = [];
  formErrors.value = [];
  if (mode === 'edit') {
    editedIndex.value = index;
    const selectedItem = listAssessment.value[index];
    formItem.value = {
      id_employee: selectedItem.employee.id_employee,
      date: formatDateForInput(selectedItem.date),
      assessments: selectedItem.assessment.map((a: any) => ({
        id_key_result: a.id_key_result,
        type: a.type,
        realisasi: a.realisasi,
        target: a.target,
      }))
    };
    keyResultErrors.value = selectedItem.assessment.map(() => '');
    formErrors.value = selectedItem.assessment.map(() => '');
  } else {
    editedIndex.value = -1;
    formItem.value = {
      id_employee: 0,
      date: '',
      assessments: [{ id_key_result: 0, type: 'should_increase_to', realisasi: null, target: 0 }]
    };
    keyResultErrors.value = [''];
    formErrors.value = [''];
  }
};

const isKeyResultUsed = (id_key_result: number, index: number) => {
  return formItem.value.assessments.some((a: { id_key_result: number; }, i: number) => a.id_key_result === id_key_result && i !== index);
};

const filteredKeyResults = (index: string|number) => {
  const selectedKeyResults = formItem.value.assessments.map((a: { id_key_result: any; }) => a.id_key_result);
  return selectKeyResult.value.filter((kr: { value: any; }) => !selectedKeyResults.includes(kr.value) || kr.value === formItem.value.assessments[index].id_key_result);
};

watch(
  () => formItem.value.assessments,
  (newAssessments: any[]) => {
    keyResultErrors.value = newAssessments.map((assessment: { id_key_result: number; }, index: number) =>
      isKeyResultUsed(assessment.id_key_result, index) ? 'Key result sudah digunakan.' : ''
    );
  },
  { deep: true }
);

const validateForm = () => {
  formErrors.value = [];
  if (!formItem.value.id_employee) {
    formErrors.value.push('Karyawan harus dipilih.');
  } else {
    formErrors.value.push('');
  }
  if (!formItem.value.date) {
    formErrors.value.push('Bulan harus dipilih.');
  } else {
    formErrors.value.push('');
  }
  formItem.value.assessments.forEach((assessment: { id_key_result: any; realisasi: number; }) => {
    if (!assessment.id_key_result) {
      formErrors.value.push('Key Result harus dipilih.');
    } else if (!assessment.realisasi && assessment.realisasi !== 0) {
      formErrors.value.push('Realisasi tidak boleh kosong.');
    } else {
      formErrors.value.push('');
    }
  });

  return !formErrors.value.some((error: string) => error !== '');
};

const saveData = async () => {
  const hasErrors = keyResultErrors.value.some((error: string) => error !== '') || !validateForm();
  if (hasErrors) {
    errorMessage.value = 'Harap isi semua form';
    return;
  }

  const expectedCount = listKeyResult.value.length; // Jumlah assessment yang diharapkan

  if (formItem.value.assessments.length !== expectedCount) {
    errorMessage.value = `Jumlah assessments harus ${expectedCount}`;
    return;
  }

  const payload = {
    id_employee: formItem.value.id_employee,
    date: formItem.value.date,
    assessment: formItem.value.assessments.map(({ id_key_result, type, realisasi }) => ({
      id_key_result,
      type,
      realisasi
    }))
  };
  if (formMode.value === 'add') {
    await apiAssessmentStore.postAssessment(payload);
  } else if (formMode.value === 'edit') {
    const id = listAssessment.value[editedIndex.value].employee.id_employee;
    await apiAssessmentStore.putAssessment(payload, id);
  }
  getData();
};

type SelectedItem = {
  employee: {
    nama: string;
  };
  date: string;
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
    date: item.date,
    assessment: item.assessment,
    total_nilai: item.total_nilai
  };
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const deleteData = async () => {
  const id = listAssessment.value[deletedIndex.value].employee.id_employee;
  await apiAssessmentStore.deleteAssessment(id);
  getData();
};

const handleExportToExcel = async () => {
  await apiAssessmentStore.exportToExcel();
};

const id_jabatan = [1, 2, 4];
const filteredEmployees = computed(() => {
  return selectedEmployee.value.filter((employee: { detail: { id_jabatan: number; }; }) => !id_jabatan.includes(employee.detail.id_jabatan));
});
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Report /</span> OKR</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-3 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-search-alt"></i></span>
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Karyawan..." @input="getData"/>
        </div>
      </div>
      <div class="col-md-3 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-calendar"></i></span>
          <input type="month" class="form-control" v-model="searchMonthYear" placeholder="Pilih Bulan dan Tahun" @input="getData"/>
        </div>
      </div>
      <div v-if="auth.employee?.jabatan !== 'CTO'" class="col-md-6 d-flex justify-content-end align-items-center">
        <button class="btn btn-success" @click="handleExportToExcel">Export to Excel</button>
        <button
          class="btn btn-primary ms-2"
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
              <th>No</th>
              <th>Bulan</th>
              <th>Karyawan</th>
              <th>Target</th>
              <th>Total Nilai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-if="listAssessment.length === 0">
              <td colspan="6" class="text-center">Penilaian Karyawan masih kosong</td>
            </tr>

            <tr v-else v-for="(item, index) in listAssessment" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ formatTanggal(item.date) }}</td>
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
                    ><i class="bx bx-show-alt me-1"></i> View</span
                  >
                  <span
                    v-if="auth.employee?.jabatan !== 'CTO'"
                    class="badge bg-label-warning me-1"
                    role="button"
                    @click="openModal('edit', index)"
                    data-bs-toggle="modal"
                    data-bs-target="#formModal"
                    ><i class="bx bx-edit-alt me-1"></i> Edit
                  </span>
                  <span
                    v-if="auth.employee?.jabatan !== 'CTO'"
                    class="badge bg-label-danger me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                    @click="openDeleteModal(index)"
                    ><i class="bx bx-trash-alt me-1"></i> Hapus
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <Pagination :params="paramsAssessment" :data="listAssessment" :total-data="totalData"  @update:page="getData" />
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
          <div class="modal-body" v-if="selectedItem">
            <div class="row align-items-start mb-3">
              <div class="col-md-4 d-flex justify-content-start align-items-center">
                <h6>{{ selectedItem.employee.nama }}</h6>
              </div>
              <div class="col-md-8 d-flex justify-content-end align-items-center">
                <h6>{{ formatTanggal(selectedItem.date) }}</h6>
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

    <!-- Modal Form -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">
              {{ formMode === 'edit' ? 'Edit' : 'Tambah' }} Data Penilaian Karyawan
            </h5>
            <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div class="mb-3">
              <label for="employee" class="form-label">Karyawan</label>
              <select v-model="formItem.id_employee" id="employee" class="form-select">
                <option value="0" disabled>Pilih Karyawan</option>
                <option v-for="employee in filteredEmployees" :key="employee.value" :value="employee.value">
                  {{ employee.label }}
                </option>
              </select>
              <div v-if="formErrors[0]" class="text-danger">{{ formErrors[0] }}</div>
            </div>
            <div class="mb-3">
              <label for="date" class="form-label">Bulan</label>
              <input type="month" class="form-control" v-model="formItem.date" placeholder="Pilih Bulan dan Tahun" />
              <div v-if="formErrors[1]" class="text-danger">{{ formErrors[1] }}</div>
            </div>
            <div v-for="(keyResult, index) in formItem.assessments" :key="index" class="mb-3">
              <div class="row">
                <div class="col-md-6">
                  <label for="keyResult" class="form-label">Key Result</label>
                  <select v-model="keyResult.id_key_result" class="form-select" @change="keyResult.target = getKeyResultTarget(keyResult.id_key_result)">
                    <option value="0" disabled>Pilih Key Result</option>
                    <option v-for="kr in filteredKeyResults(index)" :key="kr.value" :value="kr.value">
                      {{ kr.label }}
                    </option>
                  </select>
                  <div v-if="keyResultErrors[index]" class="text-danger">{{ keyResultErrors[index] }}</div>
                  <div v-if="formErrors[2]" class="text-danger">{{ formErrors[2] }}</div>
                  <div v-if="formErrors[3]" class="text-danger">{{ formErrors[3] }}</div>
                </div>
                <div class="col-md-2">
                  <label for="type" class="form-label">Type</label>
                  <select v-model="keyResult.type" class="form-select">
                    <option value="should_increase_to">should increase to</option>
                    <option value="should_decrease_to">should decrease to</option>
                    <option value="should_stay_above">should stay above</option>
                    <option value="shoud_stay_below">should stay below</option>
                    <option value="achieve_or_not">achive or not</option>
                  </select>
                </div>
                <div class="col-md-1">
                  <label for="target" class="form-label">Target</label>
                  <input type="number" v-model="keyResult.target" class="form-control" readonly />
                </div>
                <div class="col-md-1">
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
            <button type="button" class="btn btn-primary" @click="saveData" data-bs-dismiss="modal" >Save</button>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
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
