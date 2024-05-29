<script setup lang="ts">
import { ref, computed } from 'vue';
import { parseISO, format } from 'date-fns';
import { id } from 'date-fns/locale';

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

const editedIndex = ref(-1);
const deletedIndex = ref(-1);
const formMode = ref<'add' | 'edit'>('add'); // 'add' or 'edit'
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
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.value.slice(startIndex, endIndex);
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

const validateForm = () => {
  const { siapaSajaDiundang, tanggal, waktuMulai, waktuSelesai, linkMeeting, deskripsi } = formItem.value;
  return siapaSajaDiundang.trim() !== '' && tanggal !== '' && waktuMulai !== '' && waktuSelesai !== '' && linkMeeting.trim() !== '' && deskripsi.trim() !== '';
};


const deleteData = () => {
  if (deletedIndex.value !== -1) {
    data.value.splice(deletedIndex.value, 1);
    deletedIndex.value = -1;
  }
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Reminder Meeting</span></h4>
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Karyawan</th>
              <th>Tanggal</th>
              <th>Waktu Mulai</th>
              <th>Waktu Selesai</th>
              <th>Link Meeting</th>
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
              <td>{{ item.waktuSelesai }}</td>
              <td>
                <a :href="item.linkMeeting" target="_blank">{{ item.linkMeeting }}</a>
              </td>
              <td>{{ item.deskripsi }}</td>
              <td>
                <span
                  class="badge bg-label-warning me-1"
                  role="button"
                  @click="openModal('edit', (currentPage - 1) * itemsPerPage + index)"
                  ><i class="bx bx-edit-alt me-1"></i>Edit</span
                >
                <span
                  class="badge bg-label-danger"
                  role="button"
                  @click="openDeleteModal((currentPage - 1) * itemsPerPage + index)"
                  ><i class="bx bx-trash-alt me-1"></i>Hapus</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="fw-semibold mt-3" style="margin-left: 20px">
        Menampilkan {{ paginatedData.length }} dari {{ totalItems }} total data
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination pagination-sm justify-content-center mt-3">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" @click="currentPage > 1 && (currentPage -= 1)">
              <i class="tf-icon bx bx-chevrons-left"></i>
            </a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <a class="page-link" @click="currentPage = page">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" @click="currentPage < totalPages && (currentPage += 1)">
              <i class="tf-icon bx bx-chevrons-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalTitle" aria-hidden="true">
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
            <button type="button" class="btn btn-primary" @click="saveData" :disabled="!validateForm()">Simpan</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Form -->

    <!-- Modal Hapus -->
    <div class="modal fade" id="smallModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-center">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <h5>Apakah Anda yakin ingin menghapus data ini?</h5>
            <i class="bx bx-trash bx-tada" style="color: rgba(255, 0, 0, 0.6); font-size: 150px"></i>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button type="button" class="btn btn-primary" @click="deleteData" data-bs-dismiss="modal">Ya</button>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tidak</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Hapus -->
  </div>
</template>

<style>
/* Add your custom CSS styles here */
</style>
