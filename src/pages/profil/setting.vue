<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useApiEmployeeStore } from '@/stores/api/master/karyawan';
import { useApiJabatanStore } from '@/stores/api/master/jabatan';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/api/authStore';

interface FormItem {
  name: string;
  email: string;
  password: string;
  id_jabatan: number | string;
  alamat: string;
  keterangan: string;
  gender: string;
  pendidikan: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  start_working: string;
}

const formItem = ref<FormItem>({
  name: '',
  email: '',
  password: '',
  id_jabatan: '',
  alamat: '',
  keterangan: '',
  gender: '',
  pendidikan: '',
  tanggal_lahir: '',
  tempat_lahir: '',
  start_working: ''
});

const apiAuthStore = useAuthStore();
const { employee } = storeToRefs(apiAuthStore);
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

watch(
  employee,
  newEmployee => {
    if (newEmployee) {
      formItem.value.id_jabatan = newEmployee.jabatan || '';
      formItem.value.email = newEmployee.email || '';
      formItem.value.name = newEmployee.name || '';
      formItem.value.keterangan = newEmployee.keterangan || '';
      formItem.value.tempat_lahir = newEmployee.tempat_lahir || '';
      formItem.value.pendidikan = newEmployee.pendidikan || '';
    }
  },
  { immediate: true }
);

const router = useRouter();

const saveData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      alert('Token tidak ditemukan. Pastikan Anda sudah login.');
      return;
    }

    const payload = {
      name: formItem.value.name,
      email: formItem.value.email,
      password: formItem.value.password,
      id_jabatan: formItem.value.id_jabatan,
      alamat: formItem.value.alamat,
      keterangan: formItem.value.keterangan,
      gender: formItem.value.gender,
      pendidikan: formItem.value.pendidikan,
      tanggal_lahir: formItem.value.tanggal_lahir,
      tempat_lahir: formItem.value.tempat_lahir,
      start_working: formItem.value.start_working
    };

    const response = await apiEmployeeStore.updateEmployee(payload, { headers: { Authorization: `Bearer ${token}` } });

    if (response.status === 201 || response.status === 200) { // Checking for both 201 and 200 status codes
      console.log('Data berhasil disimpan');
      router.push('/profil'); // Navigasi ke halaman profil setelah berhasil menyimpan
    } else {
      console.error('Gagal menyimpan data:', response.statusText);
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat menyimpan data:', error);
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
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    v-model="formItem.password"
                  />
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
                    <option value="pria">Pria</option>
                    <option value="wanita">Wanita</option>
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
                  <input type="date" id="start_working" class="form-control" v-model="formItem.start_working" />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="pendidikan">Pendidikan</label>
                  <select id="pendidikan" class="select2 form-select" v-model="formItem.pendidikan">
                    <option value="SMA">SMA/SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="tempat_lahir" class="form-label">Tempat Lahir</label>
                  <input type="text" id="tempat_lahir" class="form-control" v-model="formItem.tempat_lahir" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="tanggal_lahir" class="form-label">Tanggal Lahir</label>
                  <input type="date" id="tanggal_lahir" class="form-control" v-model="formItem.tanggal_lahir" />
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


