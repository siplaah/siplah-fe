<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
  { nama: 'arila', email: 'arial@gmail.com', alamat: 'bali', pendidikan: 'S2', tempat_lahir: 'jakarta' },
  { nama: 'awjeng', email: 'aw@gmail.com', alamat: 'mgt', pendidikan: 'S1', tempat_lahir: 'solo' }
]);
const editedIndex = ref(-1);
const editedItem = ref({ nama: '', email: '', alamat: '', pendidikan: '', tempat_lahir: '' });

const newKaryawan = ref({ nama: '', email: '', alamat: '', pendidikan: '', tempat_lahir: '' });

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

const openCreateModal = () => {
  newKaryawan.value = { nama: '', email: '', alamat: '', pendidikan: '', tempat_lahir: '' };
};

const createNewKaryawan = () => {
  if (newKaryawan.value.nama.trim() !== '') {
    data.value.push({ ...newKaryawan.value });
    newKaryawan.value = { nama: '', email: '', alamat: '', pendidikan: '', tempat_lahir: '' };
  }
};

const deletedIndex = ref(-1);

const openDeleteModal = (index: number) => {
  deletedIndex.value = index;
};

const deleteData = () => {
  if (deletedIndex.value !== -1) {
    data.value.splice(deletedIndex.value, 1);
    deletedIndex.value = -1;
  }
};

const viewItem = ref({ nama: '', email: '', alamat: '', pendidikan: '', tempat_lahir: '' });

const openViewModal = (item: { nama: string, email: string, alamat: string, pendidikan: string, tempat_lahir: string }) => {
  viewItem.value = { ...item };
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Master /</span> Data Karyawan</h4>
    <div class="row align-items-start">
      <div class="mb-3 text-end">
        <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#createModal" @click="openCreateModal">
          Tambah Karyawan
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
              <th>Nama</th>
              <th>Email</th>
              <th>Alamat</th>
              <th>Pendidikan</th>
              <th>Tempat Lahir</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.nama }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.alamat }}</td>
              <td>{{ item.pendidikan }}</td>
              <td>{{ item.tempat_lahir }}</td>
              <td>
                <span class="badge bg-label-info me-1" role="button" data-bs-toggle="modal" data-bs-target="#viewModal" @click="openViewModal(item)">
                  <i class="bx bx-show-alt me-1"></i> View
                </span>
                <span class="badge bg-label-warning me-1" role="button" data-bs-toggle="modal" data-bs-target="#editModal" @click="openEditModal(index)">
                  <i class="bx bx-edit-alt me-1"></i> Edit
                </span>
                <span class="badge bg-label-danger me-1" role="button" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="openDeleteModal(index)">
                  <i class="bx bx-trash-alt me-1"></i> Hapus
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--/ Striped Rows -->

    <!-- Modal Create -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createModalTitle">Tambah Karyawan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="newNama" class="form-label">Nama</label>
                <input type="text" id="newNama" class="form-control" v-model="newKaryawan.nama" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newEmail" class="form-label">Email</label>
                <input type="text" id="newEmail" class="form-control" v-model="newKaryawan.email" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newAlamat" class="form-label">Alamat</label>
                <input type="text" id="newAlamat" class="form-control" v-model="newKaryawan.alamat" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newPendidikan" class="form-label">Pendidikan</label>
                <select id="newPendidikan" class="select2 form-select" v-model="newKaryawan.pendidikan">
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="newTempatLahir" class="form-label">Tempat Lahir</label>
                <input type="text" id="newTempatLahir" class="form-control" v-model="newKaryawan.tempat_lahir" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="createNewKaryawan">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Create -->

    <!-- Modal Edit -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalTitle">Edit Data Karyawan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="editNama" class="form-label">Nama</label>
                <input type="text" id="editNama" class="form-control" v-model="editedItem.nama" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editEmail" class="form-label">Email</label>
                <input type="text" id="editEmail" class="form-control" v-model="editedItem.email" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editAlamat" class="form-label">Alamat</label>
                <input type="text" id="editAlamat" class="form-control" v-model="editedItem.alamat" />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editPendidikan" class="form-label">Pendidikan</label>
                <select id="editPendidikan" class="select2 form-select" v-model="editedItem.pendidikan">
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="editTempatLahir" class="form-label">Tempat Lahir</label>
                <input type="text" id="editTempatLahir" class="form-control" v-model="editedItem.tempat_lahir" />
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

    <!-- Modal Delete -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalTitle">Hapus Data Karyawan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Apakah anda yakin ingin menghapus data ini?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-danger" @click="deleteData" data-bs-dismiss="modal">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Delete -->

    <!-- Modal View -->
    <div class="modal fade" id="viewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewModalTitle">Detail Data Karyawan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="viewNama" class="form-label">Nama</label>
                <input type="text" id="viewNama" class="form-control" v-model="viewItem.nama" disabled />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewEmail" class="form-label">Email</label>
                <input type="text" id="viewEmail" class="form-control" v-model="viewItem.email" disabled />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewAlamat" class="form-label">Alamat</label>
                <input type="text" id="viewAlamat" class="form-control" v-model="viewItem.alamat" disabled />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewPendidikan" class="form-label">Pendidikan</label>
                <input type="text" id="viewPendidikan" class="form-control" v-model="viewItem.pendidikan" disabled />
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="viewTempatLahir" class="form-label">Tempat Lahir</label>
                <input type="text" id="viewTempatLahir" class="form-control" v-model="viewItem.tempat_lahir" disabled />
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

  </div>
</template>
