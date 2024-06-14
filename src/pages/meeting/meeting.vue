<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { parseISO, format, compareDesc } from 'date-fns';
import { id } from 'date-fns/locale';
import DeleteModal from '../../components/modal/Delete.vue';
import Pagination from '../../components/pagination/Pagination.vue';
import { useApiMeetingStrore } from '@/stores/api/meeting/meeting';
import { storeToRefs } from 'pinia';

const searchQuery = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref<'add' | 'edit'>('add');
const formItem = ref({
  id_employee: '',
  date: '',
  start_time: '',
  end_time: '',
  link_meeting: '',
  description: ''
});

const apiMeetingStore = useApiMeetingStrore();
const { listMeeting } = storeToRefs(apiMeetingStore);

const getData = async () => {
  await apiMeetingStore.getMeeting();
};

onMounted(() => {
  getData();
});

const itemsPerPage = 5; // Jumlah item yang ingin ditampilkan per halaman
const currentPage = ref(1); // Halaman saat ini yang ditampilkan

const totalItems = computed(() => sortedData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const sortedData = computed(() => {
  return [...listMeeting.value].sort((a, b) => {
    const dateA = parseISO(a.date + 'T' + a.start_time);
    const dateB = parseISO(b.date + 'T' + b.start_time);
    return compareDesc(dateA, dateB);
  });
});

const paginatedData = computed(() => {
  const sourceData = searchQuery.value ? filteredData.value : sortedData.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sourceData.slice(startIndex, endIndex);
});

const filteredData = computed(() => {
  if (!searchQuery.value) return sortedData.value;
  return sortedData.value.filter(item => item.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const formatTanggal = (tanggal: string) => {
  return format(parseISO(tanggal), 'dd MMMM yyyy', { locale: id });
};

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  formMode.value = mode;
  if (mode === 'edit') {
    editedIndex.value = index;
    formItem.value = { ...listMeeting.value[index] };
  } else {
    editedIndex.value = -1;
    formItem.value = {
      id_employee: '',
      date: '',
      start_time: '',
      end_time: '',
      link_meeting: '',
      description: ''
    };
  }
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const saveData = async () => {
  if (formMode.value === 'add') {
    await apiMeetingStore.postMeeting(formItem.value);
  } else if (formMode.value === 'edit') {
    const id = paginatedData.value[editedIndex.value].id_meeting;
    await apiMeetingStore.putMeeting(formItem.value, id);
  }
  getData();
};

const deleteData = async () => {
  const id = paginatedData.value[deletedIndex.value].id_meeting;
  await apiMeetingStore.deleteMeeting(id);
  getData();
};

const viewItem = ref({
  id_employee: '',
  date: '',
  start_time: '',
  end_time: '',
  link_meeting: '',
  description: ''
});

const openView = (item: {
  id_employee: string;
  date: string;
  start_time: string;
  end_time: string;
  link_meeting: string;
  description: string;
}) => {
  viewItem.value = { ...item };
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Reminder Meeting</span></h4>
    <div class="row align-items-start mb-3">
      <div class="col-md-4 d-flex justify-content-start align-items-center">
        <div class="input-group">
          <span class="input-group-text"><i class="bx bx-search-alt"></i></span>
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Meeting..." />
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
              <th>No</th>
              <th>Karyawan</th>
              <th>Tanggal</th>
              <th>Waktu Mulai</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.id_employee }}</td>
              <td>{{ formatTanggal(item.date) }}</td>
              <td>{{ item.start_time }}</td>
              <td>{{ item.description }}</td>
              <td>
                <span
                  class="badge bg-label-info me-1"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#viewModal"
                  @click="openView(item)"
                  ><i class="bx bx-edit-alt me-1"></i> View</span
                >
                <span
                  class="badge bg-label-warning me-1"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#formModal"
                  @click="openModal('edit', (currentPage - 1) * itemsPerPage + index)"
                  ><i class="bx bx-edit-alt me-1"></i> Edit</span
                >
                <span
                  class="badge bg-label-danger me-1"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  @click="openDeleteModal((currentPage - 1) * itemsPerPage + index)"
                  ><i class="bx bx-trash-alt me-1"></i> Hapus
                </span>
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
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">{{ formMode === 'edit' ? 'Edit' : 'Tambah' }} Meeting</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="karyawan" class="form-label">Siapa saja diundang</label>
              <input
                type="text"
                class="form-control"
                id="karyawan"
                v-model="formItem.id_employee"
                placeholder="John Doe, Jane Smith"
              />
            </div>
            <div class="mb-3">
              <label for="tanggal" class="form-label">Tanggal</label>
              <input type="date" class="form-control" id="tanggal" v-model="formItem.date" />
            </div>
            <div class="row g-2">
              <div class="col mb-3">
                <label for="waktuMulai" class="form-label">Waktu Mulai</label>
                <input type="time" class="form-control" id="waktuMulai" v-model="formItem.start_time" />
              </div>
              <div class="col mb-3">
                <label for="waktuSelesai" class="form-label">Waktu Selesai</label>
                <input type="time" class="form-control" id="waktuSelesai" v-model="formItem.end_time" />
              </div>
            </div>
            <div class="mb-3">
              <label for="linkMeeting" class="form-label">Link Meeting</label>
              <input
                type="text"
                class="form-control"
                id="linkMeeting"
                v-model="formItem.link_meeting"
                placeholder="https://example.com/meeting1"
              />
            </div>
            <div class="mb-3">
              <label for="deskripsi" class="form-label">Deskripsi</label>
              <textarea class="form-control" id="deskripsi" rows="3" v-model="formItem.description"></textarea>
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
    <div class="modal fade" id="viewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalTitle">Detail Meeting</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="karyawan" class="form-label">Siapa saja diundang</label>
              <input
                type="text"
                class="form-control"
                id="karyawan"
                v-model="viewItem.id_employee"
                placeholder="John Doe, Jane Smith"
                disabled
              />
            </div>
            <div class="mb-3">
              <label for="tanggal" class="form-label">Tanggal</label>
              <input type="date" class="form-control" id="tanggal" v-model="viewItem.date" disabled />
            </div>
            <div class="row g-2">
              <div class="col mb-3">
                <label for="waktuMulai" class="form-label">Waktu Mulai</label>
                <input type="time" class="form-control" id="waktuMulai" v-model="viewItem.start_time" disabled />
              </div>
              <div class="col mb-3">
                <label for="waktuSelesai" class="form-label">Waktu Selesai</label>
                <input type="time" class="form-control" id="waktuSelesai" v-model="viewItem.end_time" disabled />
              </div>
            </div>
            <div class="mb-3">
              <label for="linkMeeting" class="form-label">Link Meeting</label>
              <input
                type="text"
                class="form-control"
                id="linkMeeting"
                v-model="viewItem.link_meeting"
                placeholder="https://example.com/meeting1"
                disabled
              />
            </div>
            <div class="mb-3">
              <label for="deskripsi" class="form-label">Deskripsi</label>
              <textarea class="form-control" id="deskripsi" rows="3" v-model="viewItem.description" disabled></textarea>
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
