<script setup lang="ts">
import { ref, computed } from 'vue';
import { parseISO, format } from 'date-fns';
import { id } from 'date-fns/locale';
import DeleteModal from '../../components/modal/Delete.vue'; 
import Pagination from '../../components/pagination/Pagination.vue';

interface MeetingItem {
  siapaSajaDiundang: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  linkMeeting: string;
  deskripsi: string;
}

const data = ref<MeetingItem[]>([
  {
    siapaSajaDiundang: 'John Doe, Jane Smith',
    tanggal: '2024-06-01',
    waktuMulai: '09:00',
    waktuSelesai: '10:00',
    linkMeeting: 'https://example.com/meeting1',
    deskripsi: 'Pertemuan Bulanan'
  },
  {
    siapaSajaDiundang: 'Alice Johnson, Bob Brown',
    tanggal: '2024-06-05',
    waktuMulai: '14:00',
    waktuSelesai: '15:00',
    linkMeeting: 'https://example.com/meeting2',
    deskripsi: 'Pembahasan Proyek X'
  },
  {
    siapaSajaDiundang: 'Charlie Davis, Emily Wilson',
    tanggal: '2024-06-10',
    waktuMulai: '10:30',
    waktuSelesai: '11:30',
    linkMeeting: 'https://example.com/meeting3',
    deskripsi: 'Evaluasi Kinerja'
  }
]);

const searchQuery = ref('');
const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref('add'); // 'add' or 'edit'
const formItem = ref<MeetingItem>({
  siapaSajaDiundang: '',
  tanggal: '',
  waktuMulai: '',
  waktuSelesai: '',
  linkMeeting: '',
  deskripsi: ''
});

const itemsPerPage = 5; // Jumlah item yang ingin ditampilkan per halaman
const currentPage = ref(1); // Halaman saat ini yang ditampilkan

const totalItems = computed(() => data.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedData = computed(() => {
  const sourceData = searchQuery.value ? filteredData.value : data.value;
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sourceData.slice(startIndex, endIndex);
});

const filteredData = computed(() => {
  if (!searchQuery.value) return data.value;
  return data.value.filter(item => item.deskripsi.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const formatTanggal = (tanggal: string) => {
  return format(parseISO(tanggal), 'dd MMMM yyyy', { locale: id });
};

const openModal = (mode: 'add' | 'edit', index: number = -1) => {
  formMode.value = mode;
  if (mode === 'edit') {
    editedIndex.value = index;
    formItem.value = { ...data.value[index] };
  } else {
    editedIndex.value = -1;
    formItem.value = {
      siapaSajaDiundang: '',
      tanggal: '',
      waktuMulai: '',
      waktuSelesai: '',
      linkMeeting: '',
      deskripsi: ''
    };
  }
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const saveData = () => {
  if (formMode.value === 'edit' && editedIndex.value !== -1) {
    data.value.splice(editedIndex.value, 1, formItem.value);
  } else if (formMode.value === 'add') {
    data.value.push({ ...formItem.value });
  }
  formItem.value = {
    siapaSajaDiundang: '',
    tanggal: '',
    waktuMulai: '',
    waktuSelesai: '',
    linkMeeting: '',
    deskripsi: ''
  };
};

const deleteData = () => {
  if (deletedIndex.value !== -1) {
    data.value.splice(deletedIndex.value, 1);
    deletedIndex.value = -1;
  }
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
              <!-- <th>Waktu Selesai</th> -->
              <!-- <th>Link Meeting</th> -->
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through your data to display each row -->
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.siapaSajaDiundang }}</td>
              <td>{{ formatTanggal(item.tanggal) }}</td>
              <td>{{ item.waktuMulai }}</td>
              <!-- <td>{{ item.waktuSelesai }}</td> -->
              <!-- <td>
                <a :href="item.linkMeeting" target="_blank">{{ item.linkMeeting }}</a>
              </td> -->
              <td>{{ item.deskripsi }}</td>
              <td>
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
              <label for="siapaSajaDiundang" class="form-label">Siapa saja diundang</label>
              <input
                type="text"
                class="form-control"
                id="siapaSajaDiundang"
                v-model="formItem.siapaSajaDiundang"
                placeholder="John Doe, Jane Smith"
              />
            </div>
            <div class="mb-3">
              <label for="tanggal" class="form-label">Tanggal</label>
              <input type="date" class="form-control" id="tanggal" v-model="formItem.tanggal" />
            </div>
            <div class="row g-2">
              <div class="col mb-3">
                <label for="waktuMulai" class="form-label">Waktu Mulai</label>
                <input type="time" class="form-control" id="waktuMulai" v-model="formItem.waktuMulai" />
              </div>
              <div class="col mb-3">
                <label for="waktuSelesai" class="form-label">Waktu Selesai</label>
                <input type="time" class="form-control" id="waktuSelesai" v-model="formItem.waktuSelesai" />
              </div>
            </div>
            <div class="mb-3">
              <label for="linkMeeting" class="form-label">Link Meeting</label>
              <input
                type="text"
                class="form-control"
                id="linkMeeting"
                v-model="formItem.linkMeeting"
                placeholder="https://example.com/meeting1"
              />
            </div>
            <div class="mb-3">
              <label for="deskripsi" class="form-label">Deskripsi</label>
              <textarea class="form-control" id="deskripsi" rows="3" v-model="formItem.deskripsi"></textarea>
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

<!-- Modal Hapus -->
<DeleteModal :onDelete="deleteData" />
    <!-- /Modal Hapus -->
  </div>
</template>

