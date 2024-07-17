<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useApiPresensiStore } from '@/stores/api/absensi/presensi';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { storeToRefs } from 'pinia';
import { format, parseISO, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

const searchMonthYear = ref('');
const searchQuery = ref('');
const selectedItem = ref<Presensi | null>(null);

const apiPresensiStore = useApiPresensiStore();
const { listPresensi } = storeToRefs(apiPresensiStore);
const apiEmployeeStore = useApiEmployeeStore();
const { listEmployee } = storeToRefs(apiEmployeeStore);

const getData = async () => {
  await apiPresensiStore.getPresensi();
  await apiEmployeeStore.getEmployee();
};

onMounted(() => {
  getData();
});

const getEmployeeName = (id_employee: string) => {
  const employee = listEmployee.value.find((employee: { id_employee: string }) => employee.id_employee === id_employee);
  return employee ? employee.name : 'Unknown';
};

interface Presensi {
  id_employee: string;
  id_presensi: string;
  date: string;
  presensi_masuk: string;
  presensi_keluar: string;
  lokasi: string;
}

const itemsPerPage = 10;
const currentPage = ref(1);

const totalItems = computed(() => listPresensi.value.length);
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
  if (!searchMonthYear.value) {
    return listPresensi.value;
  }
  const [searchYear, searchMonth] = searchMonthYear.value.split('-').map(Number);
  return listPresensi.value.filter((item: { date: string | number | Date }) => {
    const itemDate = new Date(item.date);
    return itemDate.getFullYear() === searchYear && itemDate.getMonth() + 1 === searchMonth;
  });
});

const formatTanggal = (tanggal: string) => {
  const date = parseISO(tanggal);
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  return format(date, 'dd MMMM yyyy', { locale: id });
};

const viewItem = ref<Presensi>({
  id_employee: '',
  id_presensi: '',
  date: '',
  presensi_masuk: '',
  presensi_keluar: '',
  lokasi: ''
});

const openView = (item: Presensi) => {
  viewItem.value = { ...item };
  selectedItem.value = item; // Make sure selectedItem is set for the action buttons in the view modal
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Absensi Karyawan</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center mb-3">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-search-alt"></i></span>
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search" />
        </div>
      </div>
    </div>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Tanggal</th>
              <th>Presensi Masuk</th>
              <th>Presensi Keluar</th>
              <th>Lokasi</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through your data to display each row -->
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ index + 1 }}</td>
              <td>{{ getEmployeeName(item.id_employee) }}</td>
              <td class="text-center">{{ formatTanggal(item.date) }}</td>
              <td>{{ item.presensi_masuk }}</td>
              <td>{{ item.presensi_keluar }}</td>
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
 <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="formModalTitle">Detail Daily Report</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="row">
              <div class="col mb-3">
                <label for="id_employee" class="form-label">Nama Karyawan</label>
                <input
                  type="text"
                  id="id_employee"
                  class="form-control"
                  :value="getEmployeeName(viewItem.id_employee)"
                  disabled
                />
              </div>
            </div>
            <div class="col mb-3">
              <label for="date" class="form-label">Tanggal</label>
              <input type="date" id="date" class="form-control" :value="formatTanggal(viewItem.date)" disabled />
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="task" class="form-label">Presensi Masuk</label>
              <input type="text" id="task" class="form-control" v-model="viewItem.presensi_masuk" disabled />
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="project" class="form-label">Presensi Keluar</label>
              <input type="text" id="project" class="form-control" v-model="viewItem.presensi_keluar" disabled />
            </div>
          </div>
          <div class="row g-2">
            <div class="col mb-3 me-3">
              <label for="link" class="form-label">Lokasi</label>
              <input type="text" id="link" class="form-control" v-model="viewItem.lokasi" disabled />
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

  </div>
</template>
