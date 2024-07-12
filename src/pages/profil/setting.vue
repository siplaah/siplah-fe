<route lang="yaml">
meta:
  layout: auth
  requiresAuth: true
</route>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { useApiJabatanStore } from '@/stores/api/master/jabatan';
import { storeToRefs } from 'pinia';

// Define form item with TypeScript type
interface FormItem {
  name: string;
  email: string;
  password: string;
  alamat: string;
  keterangan: string;
  gender: string;
  pendidikan: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  start_working: string;
  id_jabatan: string;
  id_employee?: number; // Change to number type for id_employee
}

const formItem = ref<FormItem>({
  name: '',
  email: '',
  password: '',
  alamat: '',
  keterangan: '',
  gender: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  start_working: '',
  id_jabatan: ''
});

const apiEmployeeStore = useApiEmployeeStore();
const apiJabatanStore = useApiJabatanStore();
const { selectJabatan } = storeToRefs(apiJabatanStore);

const getData = async () => {
  try {
    await apiEmployeeStore.getEmployee();
    await apiJabatanStore.getJabatan();
  } catch (error) {
    console.error('Error getting data:', error);
  }
};

onMounted(() => {
  getData();
});

const router = useRouter(); // Use the Vue Router instance

const saveData = async () => {
  try {
    const token = localStorage.getItem('employee');
    console.log('Token from localStorage:', token); // Log the token

    if (!token) {
      console.error('Token is missing');
      alert('Token tidak ditemukan. Pastikan Anda sudah login.');
      return;
    }

    const parsedToken = JSON.parse(token);
    console.log('Parsed token:', parsedToken); // Log the parsed token

    if (!parsedToken || !parsedToken.id) {
      console.error('id_employee is missing in the token');
      alert('ID Employee tidak ditemukan dalam token. Pastikan Anda sudah login dengan benar.');
      return;
    }

    const id_employee = parsedToken.id; // Assuming the ID is directly under 'id' property
    await apiEmployeeStore.patchEmployee(formItem.value, id_employee);
    await getData();

    console.log('Data saved successfully, navigating to /profil'); // Log before navigation
    router.push('/profil'); // Use router.push to navigate to the profile page
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Terjadi kesalahan saat menyimpan data.');
  }
};
</script>



<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Account Settings /</span> Account</h4>

    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <h5 class="card-header">Profile Details</h5>
          <div class="card-body">
            <div class="d-flex align-items-start align-items-sm-center gap-4">
              <div class="button-wrapper">
                <label for="upload" class="btn btn-primary me-2 mb-4" tabindex="0">
                  <span class="d-none d-sm-block">Upload new photo</span>
                  <i class="bx bx-upload d-block d-sm-none"></i>
                  <input type="file" id="upload" class="account-file-input" hidden accept="image/png, image/jpeg" />
                </label>
                <button type="button" class="btn btn-outline-secondary account-image-reset mb-4">
                  <i class="bx bx-reset d-block d-sm-none"></i>
                  <span class="d-none d-sm-block">Reset</span>
                </button>
              </div>
            </div>
          </div>
          <hr class="my-0" />
          <div class="card-body">
            <form id="formAccountSettings" @submit.prevent="saveData">
              <div class="row">
                <div class="mb-3">
                  <label for="nama" class="form-label">Nama</label>
                  <input type="text" class="form-control" id="nama" name="nama" v-model="formItem.name" />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input class="form-control" type="text" id="email" name="email" v-model="formItem.email" />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" name="password" v-model="formItem.password" />
                </div>
                <div class="mb-3">
                  <label for="jabatan" class="form-label">Jabatan</label>
                  <select class="form-select" id="jabatan" v-model="formItem.id_jabatan">
                    <option v-for="jabatan in selectJabatan" :key="jabatan.value" :value="jabatan.value">
                      {{ jabatan.label }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="gender" class="form-label">Gender</label>
                  <select id="gender" class="select2 form-select" v-model="formItem.gender">
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="keterangan" class="form-label">Keterangan</label>
                  <select id="keterangan" class="select2 form-select" v-model="formItem.keterangan">
                    <option value="Karyawan">Karyawan</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Partime">Partime</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="start_working" class="form-label">Mulai Bekerja</label>
                  <input type="date" id="start_working" class="form-control" v-model="formItem.start_working" placeholder="DD / MM / YY" />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="pendidikan">Pendidikan</label>
                  <select id="pendidikan" class="select2 form-select" v-model="formItem.pendidikan">
                    <option value="" selected></option>
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="tempat_lahir" class="form-label">Tempat Lahir</label>
                  <input type="text" id="tempat_lahir" class="form-control" v-model="formItem.tempat_lahir" placeholder="" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="tanggal_lahir" class="form-label">Tanggal Lahir</label>
                  <input type="date" id="tanggal_lahir" class="form-control" v-model="formItem.tanggal_lahir" placeholder="DD / MM / YY" />
                </div>
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">Alamat</label>
                <textarea class="form-control" id="address" name="address" v-model="formItem.alamat"></textarea>
              </div>
              <div class="mt-2">
                <button type="button" class="btn btn-primary me-2" @click="saveData">Simpan</button>
                <button type="reset" class="btn btn-outline-secondary">Tutup</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
