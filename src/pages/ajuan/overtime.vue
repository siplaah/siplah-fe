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
import { useAuthStore } from '@/stores/api/authStore';
import DeleteModal from '../../components/modal/Delete.vue';
import Pagination from '../../components/pagination/Pagination.vue';
import { storeToRefs } from 'pinia';

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
const apiAuthStore = useAuthStore();
const { employee } = storeToRefs(apiAuthStore);

const getData = async () => {
  await apiOvertimeStore.getOvertime();
};

onMounted(() => {
  getData();
});

const filteredData = computed(() => {
  return listOvertime.value.filter((overtime: { id_employee: any; }) => overtime.id_employee === employee.value.id);
});

const itemsPerPage = 10; 
const currentPage = ref(1);
const totalItems = computed(() => filteredData.value.length);
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
  return filteredData.value.filter((item: { start_date: string | number | Date }) => {
    const itemDate = new Date(item.start_date);
    return itemDate.getFullYear() === searchYear && itemDate.getMonth() + 1 === searchMonth;
  });
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const formatTanggal = (tanggal: string) => {
  const date = parseISO(tanggal);
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  return format(date, 'dd MMMM yyyy', { locale: id });
};

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  if (mode === 'edit') {
    if (paginatedData.value[index].status !== 'rejected') {
      return;   
    }
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

const formErrors: Ref<{ start_date: null; end_date: null; start_time: null; end_time: null; attachment: null; }> = ref({
  start_date: null,
  end_date: null,
  start_time: null,
  end_time: null,
  attachment: null,
});

function isNotEmpty() {
  return Object.values(formErrors.value).every(x => x === null || x === '');
}

function onValidate() {
  Object.keys(formErrors.value).forEach(key => {
    formErrors.value[key] = null;
  });
  if (!formItem.value.start_date || formItem.value.start_date.trim() === '') {
    formErrors.value.start_date = 'Tanggal Mulai harus diisi';
  }
  if (!formItem.value.end_date || formItem.value.end_date.trim() === '') {
    formErrors.value.end_date = 'Tanggal Selesai harus diisi';
  }
  if (!formItem.value.start_time || formItem.value.start_time.trim() === '') {
    formErrors.value.start_time = 'Waktu Mulai harus diisi';
  }
  if (!formItem.value.end_time || formItem.value.end_time.trim() === '') {
    formErrors.value.end_time = 'Waktu Selesai harus diisi';
  }
  if (!formItem.value.attachment || formItem.value.attachment.trim() === '') {
    formErrors.value.attachment = 'Attachment harus diisi';
  }

  if (isNotEmpty()) {
    saveData();
  }
}

const saveData = async () => {
  if (formMode.value === 'add') {
    await apiOvertimeStore.postOvertime(formItem.value);
  } else if (formMode.value === 'edit') {
    const id = paginatedData.value[editedIndex.value].id_overtime;
    await apiOvertimeStore.putOvertime(formItem.value, id);
  }
  await getData();  
};

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formItem.value.attachment = file.name;
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

const deleteData = async () => {
  const id = paginatedData.value[deletedIndex.value].id_overtime;
  await apiOvertimeStore.deleteOvertime(id);
  getData();
};

const getPdfPath = (filename: string) => {
  return `/assets/file/${filename}`;
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
            <tr v-if="paginatedData.length === 0">
              <td colspan="6" class="text-center">Anda belum memiliki pengajuan</td>
            </tr>
            <tr v-else v-for="(item, index) in paginatedData" :key="index">
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
                    @click="openModal('edit', index)"
                    ><i class="bx bx-edit-alt me-1"></i> Edit</span
                  >
                  <span
                    class="badge bg-label-danger me-1"
                    role="button"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                    @click="openDeleteModal(index)"
                    ><i class="bx bx-trash me-1"></i> Delete</span
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
                <input type="date" id="start_date" class="form-control" v-model="formItem.start_date" />
                <div class="d-block text-danger" v-if="formErrors.start_date">{{ formErrors.start_date }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="end_date" class="form-label">Tanggal Selesai</label>
                <input type="date" id="end_date" class="form-control" v-model="formItem.end_date" />
                <div class="d-block text-danger" v-if="formErrors.end_date">{{ formErrors.end_date }}</div>
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
                <div class="d-block text-danger" v-if="formErrors.start_time">{{ formErrors.start_time }}</div>
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
                <div class="d-block text-danger" v-if="formErrors.end_time">{{ formErrors.end_time }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col mt-3">
                <label for="attachment" class="form-label">Attachment</label>
                <input class="form-control" type="file" id="attachment" @change="handleFileUpload" />
                <div class="d-block text-danger" v-if="formErrors.attachment">{{ formErrors.attachment }}</div>
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
