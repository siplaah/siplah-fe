<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
  { nama: 'arila', email: 'arial@gmail.com', alamat: 'bali', pendidikan: 'S2', tempat_lahir: 'jakarta' }
]);
const editedIndex = ref(-1);
const editedItem = ref({ nama: '', email: '', alamat: '', pendidikan: '', tempat_lahir: '' });

const deletedIndex = ref(-1); // Menambahkan deklarasi variabel deletedIndex

const openEditModal = (index: number) => {
  editedIndex.value = index;
  editedItem.value = { ...data.value[index] };
};

const saveEditedData = () => {
  if (editedIndex.value !== -1) {
    data.value.splice(editedIndex.value, 1, editedItem.value);
    editedIndex.value = -1;
  }
};

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const deleteData = () => {
  if (deletedIndex.value !== -1) {
    data.value.splice(deletedIndex.value, 1);
    deletedIndex.value = -1;
  }
};
// const selectedItem = ref({});

// const openViewModal = nama => {
//   selectedItem.value = nama;
// };
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Master /</span> Data Karyawan</h4>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Alamat</th>
              <th>Pendidikan</th>
              <th>Tempat Lahir</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through your data to display each row -->
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.nama }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.alamat }}</td>
              <td>{{ item.pendidikan }}</td>
              <td>{{ item.tempat_lahir }}</td>
              <div>
                <!-- <span
                  class="badge bg-primary me-1"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#modalView"
                  @click="openViewModal(item)"
                  ><i class="bx bx-show-alt text-blue me-1"></i> View
                </span> -->
                <span
                  class="badge bg-label-warning me-1"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#modalCenter"
                  @click="openEditModal(index)"
                  ><i class="bx bx-edit-alt me-1"></i> Edit
                </span>
                <span
                  class="badge bg-label-danger me-1"
                  role="button"
                  data-bs-toggle="modal"
                  data-bs-target="#smallModal"
                  @click="openDeleteModal(index)"
                  ><i class="bx bx-trash-alt me-1"></i> Hapus
                </span>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--/ Striped Rows -->

    <!-- Modal View -->
    <div class="modal fade" id="modalView" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalCenterTitle">Detail Karyawan</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col mb-3">
              <label for="nama" class="form-label">Nama</label>
              <!-- <input type="text" id="nama" class="form-control" :value="selectedItem.nama" readonly /> -->
            </div>
          </div>
          <div class="row">
            <div class="col mb-3">
              <label for="email" class="form-label">Email</label>
              <!-- <input type="text" id="email" class="form-control" :value="selectedItem.email" readonly /> -->
            </div>
          </div>
            <div class="row">
              <div class="col mb-3">
                <label for="alamat" class="form-label">Alamat</label>
                <!-- <input type="text" id="nama" class="form-control" placeholder="" :value="selectedItem.alamat" readonly/> -->
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="name" class="form-label">Pendidikan</label>
                <select id="gender" class="select2 form-select" >
                  <option value="" selected></option>
                  <option value="">SMA/SMK</option>
                  <option value="">D3</option>
                  <option value="">S1</option>
                  <option value="">S2</option>
                  <option value="">S3</option>
                </select>
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="" class="form-label">Tempat Lahir</label>
                <input type="text" id="tempat_lahir" class="form-control" placeholder="" />
              </div>
              <div class="col mb-0">
                <label for="date" class="form-label">Tanggal</label>
                <input type="date" id="date" class="form-control" placeholder="DD /MM / YY" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="name" class="form-label">Keterangan</label>
                <select id="gender" class="select2 form-select">
                  <option value="" selected></option>
                  <option value="">Karyawan</option>
                  <option value="">Freelance</option>
                  <option value="">Partime</option>
                  <option value="">Probation</option>
                </select>
              </div>
              <div class="col mb-0">
                <label for="date" class="form-label">Mulai Bekerja</label>
                <input type="date" id="date" class="form-control" placeholder="DD /MM / YY" />
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

    <!-- Modal Edit -->
    <div class="modal fade" id="modalCenter" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCenterTitle">Edit Data Karyawan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="name" class="form-label">Nama</label>
                <input type="text" id="nama" class="form-control" placeholder="" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" id="nama" class="form-control" placeholder="" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="alamat" class="form-label">Alamat</label>
                <input type="text" id="nama" class="form-control" placeholder="" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="name" class="form-label">Pendidikan</label>
                <select id="gender" class="select2 form-select">
                  <option value="" selected></option>
                  <option value="">SMA/SMK</option>
                  <option value="">D3</option>
                  <option value="">S1</option>
                  <option value="">S2</option>
                  <option value="">S3</option>
                </select>
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="" class="form-label">Tempat Lahir</label>
                <input type="text" id="tempat_lahir" class="form-control" placeholder="" />
              </div>
              <div class="col mb-0">
                <label for="date" class="form-label">Tanggal</label>
                <input type="date" id="date" class="form-control" placeholder="DD /MM / YY" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="name" class="form-label">Keterangan</label>
                <select id="gender" class="select2 form-select">
                  <option value="" selected></option>
                  <option value="">Karyawan</option>
                  <option value="">Freelance</option>
                  <option value="">Partime</option>
                  <option value="">Probation</option>
                </select>
              </div>
              <div class="col mb-0">
                <label for="date" class="form-label">Mulai Bekerja</label>
                <input type="date" id="date" class="form-control" placeholder="DD /MM / YY" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" @click="saveEditedData" data-bs-dismiss="modal">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Edit -->

    <!-- Modal Hapus -->
    <div class="modal fade" id="smallModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-center">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <h5>Apakah anda yakin igin menghapus data ini?</h5>
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
