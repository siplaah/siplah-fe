<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
  </route>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format, isValid, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Pagination from '../../components/pagination/Pagination.vue';
import { useApiTimeOffStrore } from '@/stores/api/ajuan/time-off';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { storeToRefs } from 'pinia';


const apiTimeOffStore = useApiTimeOffStrore();
const { listTimeOff } = storeToRefs(apiTimeOffStore);
const apiEmployeeStore = useApiEmployeeStore();
const { listEmployee } = storeToRefs(apiEmployeeStore);

const getData = async () => {
  await apiTimeOffStore.getTimeOff();
  await apiEmployeeStore.getEmployee();
};

onMounted(() => {
  getData();
});

interface TimeOff {
  id_employee: string;
  id_time_off: string;
  start_date: string;
  end_date: string;
  type: string;
  attachment: string;
  status: string;
  description: string;
  jumlah_cuti: string;
}

const selectedItem = ref<TimeOff | null>(null);
const description = ref<string>('');
const actionType = ref('');
const searchMonthYear = ref('');

const itemsPerPage = 10;
const currentPage = ref(1);
const totalItems = computed(() => listTimeOff.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const sourceData = searchMonthYear.value ? filteredData.value : listTimeOff.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sourceData.slice(startIndex, endIndex);
});

const filteredData = computed(() => {
  if (!searchMonthYear.value) {
    return listTimeOff.value;
  }
  const [searchYear, searchMonth] = searchMonthYear.value.split('-').map(Number);
  return listTimeOff.value.filter((item: { start_date: string | number | Date; }) => {
    const itemDate = new Date(item.start_date);
    return itemDate.getFullYear() === searchYear && itemDate.getMonth() + 1 === searchMonth;
  });
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const getEmployeeName = (id_employee: string) => {
  const employee = listEmployee.value.find((employee: { id_employee: string; }) => employee.id_employee === id_employee);
  return employee ? employee.name : 'Unknown';
};

const formatTanggal = (tanggal: string) => {
  const date = parseISO(tanggal);
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  return format(date, 'dd MMMM yyyy', { locale: id });
};

const openModal = (item: TimeOff | null, type: string) => {
  selectedItem.value = item;
  actionType.value = type;
};

const updateStatus = async () => {
  if (selectedItem.value && actionType.value) {
    const id = selectedItem.value.id_time_off;
    const descriptionValue = description.value;

    try {
      if (actionType.value === 'approve') {
        await apiTimeOffStore.approvedTimeOff(id);
      } else {
        await apiTimeOffStore.rejectTimeOff(id, descriptionValue);
      }

      const newStatus = actionType.value === 'approve' ? 'approved' : 'rejected';
      const index = listTimeOff.value.findIndex((item: { id_time_off: string; }) => item.id_time_off === id);
      if (index !== -1) {
        listTimeOff.value[index].status = newStatus;
        if (newStatus === 'rejected') {
          listTimeOff.value[index].description = 'Alasan penolakan: ' + descriptionValue;
        } else {
          listTimeOff.value[index].description = ''; 
        }
      }
      description.value = '';
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }
};

const viewItem = ref<TimeOff>({
  id_employee: '',
  id_time_off: '',
  start_date: '',
  end_date: '',
  type: '',
  jumlah_cuti: '',
  attachment: '',
  status: '',
  description: ''
});

const openView = (item: TimeOff) => {
  viewItem.value = { ...item };
  selectedItem.value = item; // Make sure selectedItem is set for the action buttons in the view modal
};

const isImage = (url: string) => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
};

const getPdfPath = (filename: string) => {
  return `/assets/file/${filename}`;
};

</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Cuti</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-calendar"></i></span>
          <input type="month" class="form-control" v-model="searchMonthYear" placeholder="Pilih Bulan dan Tahun" />
        </div>
      </div>
    </div>

    <!-- table -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Karyawan</th>
              <th>Tanggal Mulai</th>
              <th>Tipe Cuti</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ getEmployeeName(item.id_employee) }}</td>
              <td>{{ formatTanggal(item.start_date) }}</td>
              <td>{{ item.type }}</td>
              <td>
                <span
                  :class="{
                    'badge bg-label-warning': item.status === 'pending',
                    'badge bg-label-success': item.status === 'approved',
                    'badge bg-label-danger': item.status === 'rejected'
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
                    ><i class="bx bx-show-alt me-1"></i> View</span
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
    <!--/ table -->

    <!-- Modal Action -->
    <div class="modal fade" id="actionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="actionModalTitle">
              {{ actionType === 'approve' ? 'Setujui' : 'Tolak' }} Pengajuan Cuti
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>
              Apakah Anda yakin ingin {{ actionType === 'approve' ? 'menyetujui' : 'menolak' }} pengajuan cuti oleh
              <b>{{ getEmployeeName(selectedItem?.id_employee ?? '') }}</b> pada tanggal <b>{{ formatTanggal(selectedItem?.start_date ?? '') }}</b>
            </p>
            <!-- Input alasan penolakan -->
            <div v-if="actionType === 'reject'" class="mb-3">
              <label for="description" class="form-label">Alasan Penolakan</label>
              <textarea class="form-control" id="description" v-model="description"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" @click="updateStatus" data-bs-dismiss="modal">
              {{ actionType === 'approve' ? 'Setujui' : 'Tolak' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Action -->

    <!-- Modal View -->
    <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">Detail Pengajuan Cuti</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
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
            <div class="row">
              <div class="col mb-3">
                <label for="start_date" class="form-label">Tanggal Mulai</label>
                <input
                  type="text"
                  id="start_date"
                  class="form-control"
                  :value="formatTanggal(viewItem.start_date)"
                  placeholder="DD / MM / YY"
                  disabled
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="end_date" class="form-label">Tanggal Selesai</label>
                <input
                  type="text"
                  id="end_date"
                  class="form-control"
                  :value="formatTanggal(viewItem.end_date)"
                  placeholder="DD / MM / YY"
                  disabled
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="type" class="form-label">Tipe Cuti</label>
                <input
                  type="text"
                  id="type"
                  class="form-control"
                  v-model="viewItem.type"
                  placeholder="DD / MM / YY"
                  disabled
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label for="type" class="form-label">Jumlah Cuti</label>
                <input type="text" id="type" class="form-control" v-model="viewItem.jumlah_cuti" disabled />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mt-3">
                <label for="attachment" class="form-label mb-2">Attachment</label>
                <div v-if="viewItem.attachment" class="mt-2">
                  <img v-if="isImage(viewItem.attachment)" :src="viewItem.attachment" class="img-fluid" />
                  <a v-else :href="getPdfPath(viewItem.attachment)" target="_blank" rel="noopener noreferrer"
                    ><i class="bx bxs-file"></i> Lihat PDF</a
                  >
                </div>
              </div>
              <div class="col mt-3">
                <label for="status" class="form-label">Status</label>
                <div>
                  <span
                  :class="{
                    'badge bg-label-warning': viewItem.status === 'pending',
                    'badge bg-label-success': viewItem.status === 'approved',
                    'badge bg-label-danger': viewItem.status === 'rejected'
                  }"
                >
                  {{ viewItem.status }}
                </span>
                </div>
              </div>
            </div>
            <div v-if="viewItem.status === 'rejected'" class="row">
              <div class="col mt-3">
                <label for="description" class="form-label">Deskripsi</label>
                <textarea
                  class="form-control"
                  id="description"
                  rows="3"
                  v-model="viewItem.description"
                  disabled
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <div>
              <button
                v-if="viewItem.status === 'pending'"
                type="button"
                class="btn btn-success me-2"
                @click="openModal(viewItem, 'approve')"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#actionModal"
              >
                Setujui
              </button>
              <button
                v-if="viewItem.status === 'pending'"
                type="button"
                class="btn btn-danger"
                @click="openModal(viewItem, 'reject')"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#actionModal"
              >
                Tolak
              </button>
            </div>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal View -->
  </div>
</template>
