<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { format, isValid, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Pagination from '@/components/pagination/Pagination2.vue';
import { useApiOvertimeStrore } from '@/stores/api/ajuan/overtime';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { storeToRefs } from 'pinia';

const searchMonthYear = ref('');
const searchQuery = ref('');
const selectedItem = ref<Overtime | null>(null);
const description = ref<string>('');
const actionType = ref('');
const paramsOvertime = ref({ page: 1, pageSize: 10 });
const attachmentUrl = computed(() => apiOvertimeStore.overtimeAttachment);

const apiOvertimeStore = useApiOvertimeStrore();
const { listOvertime, totalData } = storeToRefs(apiOvertimeStore);
const apiEmployeeStore = useApiEmployeeStore();
const { listEmployee } = storeToRefs(apiEmployeeStore);

const getData = async () => {
  await apiOvertimeStore.getOvertime({ ...paramsOvertime.value, q: searchQuery.value, date: searchMonthYear.value });
  await apiEmployeeStore.getEmployee();
};

onMounted(() => {
  getData();
});

interface Overtime {
  id_employee: string;
  id_overtime: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  attachment: string;
  status: string;
  description: string;
}

const getEmployeeName = (id_employee: string) => {
  const employee = listEmployee.value.find((employee: { id_employee: string }) => employee.id_employee === id_employee);
  return employee ? employee.name : 'Unknown';
};

const formatTanggal = (tanggal: string) => {
  if (!tanggal) {
    return 'Invalid Date'; // Atau pesan default lainnya
  }
  const date = parseISO(tanggal);
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  return format(date, 'dd MMMM yyyy', { locale: id });
};

const openModal = (item: Overtime | null, type: string) => {
  selectedItem.value = item;
  actionType.value = type;
};

const updateStatus = async () => {
  if (selectedItem.value && actionType.value) {
    const id = selectedItem.value.id_overtime;
    const descriptionValue = description.value;

    try {
      if (actionType.value === 'approve') {
        await apiOvertimeStore.approvedOvertime(id);
      } else {
        await apiOvertimeStore.rejectOvertime(id, descriptionValue);
      }

      const newStatus = actionType.value === 'approve' ? 'approved' : 'rejected';
      const index = listOvertime.value.findIndex((item: { id_overtime: string }) => item.id_overtime === id);
      if (index !== -1) {
        listOvertime.value[index].status = newStatus;
        if (newStatus === 'rejected') {
          listOvertime.value[index].description = 'Alasan penolakan: ' + descriptionValue;
        } else {
          listOvertime.value[index].description = '';
        }
      }
      description.value = '';
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }
};

const viewItem = ref<Overtime>({
  id_employee: '',
  id_overtime: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  attachment: '',
  status: '',
  description: ''
});

const openView = (item: Overtime) => {
  viewItem.value = { ...item };
  selectedItem.value = item; // Make sure selectedItem is set for the action buttons in the view modal
};

const isImage = (url: string) => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
};

const id_overtime = ref(null);
const fetchAttachment = async () => {
  try {
    console.log('overtimeId:', id_overtime, 'Type:', typeof id_overtime);
    if (!Number.isInteger(id_overtime)) {
      throw new Error('Invalid ID format');
    }
    await apiOvertimeStore.fetchOvertimeAttachment(id_overtime);
  } catch (error) {
    console.error('Error fetching attachment:', error);
  }
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Lembur</h4>
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
    </div>

    <!-- Table -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Karyawan</th>
              <th>Tanggal Mulai</th>
              <th>Waktu Mulai</th>
              <th>Waktu Selesai</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-if="listOvertime.length === 0">
              <td colspan="7" class="text-center">Pengajuan lembur masih kosong</td>
            </tr>

            <tr v-for="(item, index) in listOvertime" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ getEmployeeName(item.id_employee) }}</td>
              <td>{{ formatTanggal(item.start_date) }}</td>
              <td>{{ item.start_time }}</td>
              <td>{{ item.end_time }}</td>
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
      <div>
        <Pagination :params="paramsOvertime" :data="listOvertime" :total-data="totalData" @update:page="getData" />
      </div>
    </div>
    <!--/ Striped Rows -->

    <!-- Modal Action -->
    <div class="modal fade" id="actionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="actionModalTitle">
              {{ actionType === 'approve' ? 'Setujui' : 'Tolak' }} Pengajuan Lembur
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>
              Apakah Anda yakin ingin {{ actionType === 'approve' ? 'menyetujui' : 'menolak' }} pengajuan lembur oleh
              <b>{{ getEmployeeName(selectedItem?.id_employee ?? '') }}</b> pada tanggal
              <b>{{ formatTanggal(selectedItem?.start_date ?? '') }}</b
              >?
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
            <h5 class="modal-title" id="formModalTitle">Detail Pengajuan Lembur</h5>
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
                  disabled
                />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="start_time" class="form-label">Waktu Mulai</label>
                <input
                  type="time"
                  id="start_time"
                  class="form-control"
                  v-model="viewItem.start_time"
                  placeholder="HH : MM"
                  disabled
                />
              </div>
              <div class="col mb-0">
                <label for="end_time" class="form-label">Waktu Selesai</label>
                <input
                  type="time"
                  id="end_time"
                  class="form-control"
                  v-model="viewItem.end_time"
                  placeholder="HH : MM"
                  disabled
                />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mt-3">
                <label for="attachment" class="form-label mb-2">Attachment</label>
                <div v-if="viewItem.attachment">
                  <template v-if="isImage(viewItem.attachment)">
                    <img
                      :src="viewItem.attachment"
                      alt="Attachment Preview"
                      style="max-width: 100%; max-height: 400px"
                    />
                  </template>
                  <template v-else>
                    <button type="button" class="btn btn-outline-primary" @click="fetchAttachment">
                      Download Attachment
                    </button>
                    <a v-if="attachmentUrl" :href="attachmentUrl" download>Download Here</a>
                  </template>
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
