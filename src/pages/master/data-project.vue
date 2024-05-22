<script setup lang="ts">
import { ref } from 'vue';

const data = ref([{ project: 'SIPLAH' }, { project: 'Xignature' }]);
const editedIndex = ref(-1);
const editedItem = ref({ project: '' });

const deletedIndex = ref(-1);

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
const newProject = ref('');

const createNewProject = () => {
  if (newProject.value.trim() !== '') {
    data.value.push({ project: newProject.value });
    newProject.value = '';
  }
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Master /</span> Data Project</h4>
    <div class="row align-items-start">
      <div class="mb-3 text-end">
        <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#create">
          Create New
        </button>
      </div>
    </div>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th style="padding-right: 20px; width: 30%">No</th>
              <th style="padding-right: 20px; width: 40%">Project</th>
              <th style="width: 30%">Aksi</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <!-- Loop through your data to display each row -->
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.project }}</td>
              <td>
                <div>
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <nav aria-label="Page navigation">
        <ul class="pagination pagination-sm justify-content-center mt-3">
          <li class="page-item prev">
            <a class="page-link"  ><i class="tf-icon bx bx-chevrons-left"></i></a>
          </li>
          <li class="page-item">
            <a class="page-link"  >1</a>
          </li>
          <li class="page-item">
            <a class="page-link"  >2</a>
          </li>
          <li class="page-item active">
            <a class="page-link"  >3</a>
          </li>
          <li class="page-item">
            <a class="page-link"  >4</a>
          </li>
          <li class="page-item">
            <a class="page-link"  >5</a>
          </li>
          <li class="page-item next">
            <a class="page-link"  ><i class="tf-icon bx bx-chevrons-right"></i></a>
          </li>
        </ul>
      </nav> -->
      
    </div>
    <!--/ Striped Rows -->

    <!-- Modal Create -->
    <div class="modal fade" id="create" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createModalTitle">Create New Project</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="newJabatan" class="form-label">Project</label>
                <input type="text" id="newJabatan" class="form-control" v-model="newProject" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="createNewProject">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal Create -->

    <!-- Modal View -->
    
<!-- /Modal View -->


    <!-- Modal Edit -->
    <div class="modal fade" id="modalCenter" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCenterTitle">Edit Project</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col mb-3">
                <label for="jabatan" class="form-label">Project</label>
                <input type="text" id="jabatan" class="form-control" v-model="editedItem.project" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="saveEditedData">
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
