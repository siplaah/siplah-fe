<script setup lang="ts">

// import { onMounted, ref , computed} from 'vue';
// import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
// import { useApiJabatanStore } from '@/stores/api/master/jabatan';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/api/authStore';


const apiAuthStore = useAuthStore();
const { employee } = storeToRefs(apiAuthStore);
// // Define form item with TypeScript type
// interface employee {
//   name: string;
//   email: string;
//   password: string;
//   alamat: string;
//   keterangan: string;
//   gender: string;
//   pendidikan: string;
//   tanggal_lahir: string;
//   tempat_lahir: string;
//   start_working: string;
//   id_jabatan: string;
//   id_employee?: string; // Add optional id_employee property
// }

// const employee = ref<employee>({
//   name: '',
//   email: '',
//   password: '',
//   alamat: '',
//   keterangan: '',
//   gender: '',
//   pendidikan: '',
//   tanggal_lahir: '',
//   tempat_lahir: '',
//   start_working: '',
//   id_jabatan: ''
// });

// const apiEmployeeStore = useApiEmployeeStore();
// const apiJabatanStore = useApiJabatanStore();
// const { selectJabatan } = storeToRefs(apiJabatanStore);

// const getData = async () => {
//   await apiEmployeeStore.getEmployee();
//   await apiJabatanStore.getJabatan();
//   // Assuming there is a way to set employee data from the store
//   // You might need to set employee data manually here if it's not done automatically
//   employee.value = apiEmployeeStore.employeeDetails;
// };

// onMounted(() => {
//   getData();
// });

// const selectedJabatanLabel = computed(() => {
//   const jabatan = selectJabatan.value.find(j => j.value === employee.value.id_jabatan);
//   return jabatan ? jabatan.label : '';
// });
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Account /</span> Profile User</h4>

    <!-- Basic Bootstrap Table -->
    <div class="card">
  <br />
  <div class="row">
    <!-- Basic -->
    <div class="col-md-6">
      <div class="card mb-4">
        <h5 class="card-header">Profile</h5>
        <!-- <img src="" alt class="rounded-circle mx-auto" height="160px" width="160px" /> -->
        <div class="card-body demo-vertical-spacing demo-only-element">
          <div class="form-Username-toggle">
            <h6>Nama</h6>
            <div class="input-group text-primary fs-5">
              {{ employee?.name }}
            </div>
          </div>
          <div class="form-Username-toggle">
            <h6>Jabatan</h6>
            <div class="input-group text-primary fs-5">
              <p>{{ employee?.jabatan }}</p>
            </div>
          </div>
          <div class="form-Email-toggle">
            <h6>Keterangan</h6>
            <div class="input-group text-primary fs-5">
              <p>{{ employee?.keterangan }}</p>
            </div>
          </div>
          <div class="form-Nama-toggle">
            <h6>Tempat Lahir</h6>
            <div class="input-group text-primary fs-5">
              <p>{{ employee?.tempat_lahir }}</p>
            </div>
          </div>
          <div class="form-Username-toggle">
            <h6>Pendidikan</h6>
            <div class="input-group text-primary fs-5">
              <p>{{ employee?.pendidikan }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Merged -->
    <div class="col-md-6">
      <div class="card mb-4">
        <div class="card-body demo-vertical-spacing demo-only-element">
          <div class="form-gender-toggle">
            <h6>Email</h6>
            <div class="input-group text-primary fs-5">
              <p>{{ employee?.email }}</p>
            </div>
          </div>
          <div class="form-Username-toggle">
            <h6>Gender</h6>
            <div class="input-group text-primary fs-5">
              <p>{{ employee?.gender }}</p>
            </div>
          </div>
          <div class="form-Username-toggle">
            <h6>Mulai Bekerja</h6>
            <div class="input-group text-primary fs-5">
              <p>{{ employee?.start_working }}</p>
            </div>
          </div>
          <div class="form-posisi-toggle">
            <h6>Tanggal Lahir</h6>
            <div class="input-group text-primary fs-5">
              <p>{{ employee?.tanggal_lahir }}</p>
            </div>
          </div>
          <div class="form-Username-toggle">
            <h6>Alamat</h6>
            <div class="input-group text-primary fs-5">
              <p>{{ employee?.alamat }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row justify-content-center mb-4">
      <a type="button" class="btn rounded-pill btn-primary" href="/profileEdit">
        <span class="tf-icons bx bx-edit"></span> Perbarui Profile
      </a>
    </div>
  </div>
</div>

    <br />
  </div>
</template>
