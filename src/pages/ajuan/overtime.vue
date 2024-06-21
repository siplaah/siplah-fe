<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { format, parseISO, isValid, formatISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useApiOvertimeStrore } from '@/stores/api/ajuan/overtime';
import DeleteModal from '../../components/modal/Delete.vue';
import Pagination from '../../components/pagination/Pagination.vue';
import { storeToRefs } from 'pinia';

const getPdfPath = (filename: string) => {
  return `/assets/file/${filename}`;
};

const searchMonthYear = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref<'add' | 'edit'>('add'); // 'add' or 'edit'
const formItem = ref({
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  attachment: '',
  status: '',
  description: ''
});

const apiOvertimeStore = useApiOvertimeStrore();
const { listOvertime } = storeToRefs(apiOvertimeStore);

const itemsPerPage = 10; // Jumlah item yang ingin ditampilkan per halaman
const currentPage = ref(1); // Halaman saat ini yang ditampilkan

const totalItems = computed(() => listOvertime.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const sourceData = searchMonthYear.value ? filteredData.value : listOvertime.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sourceData.slice(startIndex, endIndex);
});

const filteredData = computed(() => {
  if (!searchMonthYear.value) {
    return listOvertime.value;
  }
  const [searchYear, searchMonth] = searchMonthYear.value.split('-').map(Number);
  return listOvertime.value.filter((item: { start_date: string | number | Date }) => {
    const itemDate = new Date(item.start_date);
    return itemDate.getFullYear() === searchYear && itemDate.getMonth() + 1 === searchMonth;
  });
});

const getData = async () => {
  await apiOvertimeStore.getOvertime();
};

onMounted(() => {
  getData();
});

const formatTanggal = (tanggal: string) => {
  const date = parseISO(tanggal);
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  return format(date, 'dd MMMM yyyy', { locale: id });
};

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  if (mode === 'edit' && listOvertime.value[index].status !== 'rejected') {
    return;
  }
  formMode.value = mode;
  if (mode === 'edit') {
    editedIndex.value = index;
    const selectedItem = paginatedData.value[index];
    formItem.value = {
      start_date: formatISO(parseISO(selectedItem.start_date), { representation: 'date' }), // Adjust format as needed
      end_date: formatISO(parseISO(selectedItem.end_date), { representation: 'date' }), // Adjust format as needed
      start_time: selectedItem.start_time,
      end_time: selectedItem.end_time,
      attachment: selectedItem.attachment,
      status: selectedItem.status,
      description: selectedItem.description
    };
  } else {
    editedIndex.value = -1;
    formItem.value = {
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      attachment: '',
      status: 'pending',
      description: ''
    };
  }
};

const viewItem = ref({
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  attachment: '',
  status: '',
  description: ''
});

const openView = (item: {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  attachment: string;
  status: string;
  description: string;
}) => {
  viewItem.value = { ...item };
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const saveData = async () => {
  const formData = new FormData();
  formData.append('start_date', formItem.value.start_date);
  formData.append('end_date', formItem.value.end_date);
  formData.append('start_time', formItem.value.start_time);
  formData.append('end_time', formItem.value.end_time);
  formData.append('status', formItem.value.status);
  formData.append('description', formItem.value.description);
  if (formItem.value.attachment) {
    formData.append('attachment', formItem.value.attachment);
  }

  if (formMode.value === 'add') {
    await apiOvertimeStore.postOvertime(formData);
  } else if (formMode.value === 'edit') {
    const id = paginatedData.value[editedIndex.value].id_overtime;
    await apiOvertimeStore.putOvertime(formData, id);
  }
  getData();
};

const deleteData = async () => {
  const id = paginatedData.value[deletedIndex.value].id_overtime;
  await apiOvertimeStore.deleteOvertime(id);
  getData();
};

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formItem.value.attachment = file.name;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
const isImage = (url: string) => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Pengajuan Lembur</h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-calendar"></i></span>
          <input type="month" class="form-control" v-model="searchMonthYear" placeholder="Pilih Bulan dan Tahun" />
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

    <!-- table -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal Mulai</th>
              <th>Waktu Mulai</th>
              <th>Waktu Selesai</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
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
                    ><i class="bx bx-edit-alt me-1"></i> View</span
                  >
                  <span
                    v-if="item.status === 'rejected'"
                    class="badge bg-label-warning me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#formModal"
                    @click="openModal('edit', (currentPage - 1) * itemsPerPage + index)"
                    ><i class="bx bx-edit-alt me-1"></i> Edit</span
                  >
                  <span
                    v-if="item.status !== 'approved'"
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
    <!--/ table -->

    <!-- Modal Form -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">
              {{ formMode === 'edit' ? 'Edit' : 'Tambah' }} Pengajuan Lembur
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="start_date" class="form-label">Tanggal Mulai</label>
                <input
                  type="date"
                  id="start_date"
                  class="form-control"
                  v-model="formItem.start_date"
                  placeholder="DD / MM / YY"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="end_date" class="form-label">Tanggal Selesai</label>
                <input
                  type="date"
                  id="end_date"
                  class="form-control"
                  v-model="formItem.end_date"
                  placeholder="DD / MM / YY"
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
                  v-model="formItem.start_time"
                  placeholder="HH : MM"
                />
              </div>
              <div class="col mb-0">
                <label for="end_time" class="form-label">Waktu Selesai</label>
                <input
                  type="time"
                  id="end_time"
                  class="form-control"
                  v-model="formItem.end_time"
                  placeholder="HH : MM"
                />
              </div>
            </div>
            <div class="row">
              <div class="col mt-3">
                <label for="attachment" class="form-label">Attachment</label>
                <input class="form-control" type="file" id="attachment" @change="handleFileUpload" />
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
                <label for="start_date" class="form-label">Tanggal Mulai</label>
                <input
                  type="text"
                  id="start_date"
                  class="form-control"
                  :value="formatTanggal(viewItem.start_date)"
                  disabled
                />
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
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal View -->

    <!-- Modal Hapus -->
    <DeleteModal :onDelete="deleteData" />
    <!-- /Modal Hapus -->
  </div>
</template>
