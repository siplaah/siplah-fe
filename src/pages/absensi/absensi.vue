<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApiPresensiStore } from '@/stores/api/absensi/presensi';

const hoverLeft = ref(false);
const hoverRight = ref(false);
const isRightColumnDisabled = ref(true);

const formItem = ref({ id_presensi: '', date: '', start_time: '', end_time: '', latitude: '', longitude: '' });
const currentPresensi = ref<any>(null);

const apiPresensiStore = useApiPresensiStore();

const getData = async () => {
  try {
    await apiPresensiStore.getPresensi();
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const presensiData = apiPresensiStore.presensi || [];
    currentPresensi.value = presensiData.find((item: any) => item.date.split('T')[0] === today);

    if (currentPresensi.value) {
      formItem.value.id_presensi = currentPresensi.value.id_presensi;
      formItem.value.date = currentPresensi.value.date.split('T')[0];
      isRightColumnDisabled.value = currentPresensi.value.end_time !== null;
    } else {
      formItem.value = { id_presensi: '', date: today, start_time: '', end_time: '', latitude: '', longitude: '' };
      isRightColumnDisabled.value = true;
    }
  } catch (error) {
    console.error('Failed to fetch presensi data:', error);
  }
};

onMounted(() => {
  getData();
});

const handlePresensiMasuk = async () => {
  if (formItem.value.date === '' || formItem.value.start_time === '') {
    alert('Harap isi tanggal dan waktu terlebih dahulu!');
    return;
  }

  // Request location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        formItem.value.latitude = position.coords.latitude.toString();
        formItem.value.longitude = position.coords.longitude.toString();

        try {
          const response = await apiPresensiStore.postPresensi(formItem.value);
          alert('Anda telah melakukan presensi masuk!');
          formItem.value.id_presensi = response.id_presensi; // Update formItem with the ID from the response
          isRightColumnDisabled.value = false;
        } catch (error) {
          console.error('Terjadi kesalahan saat melakukan presensi masuk:', error);
          alert('Terjadi kesalahan saat melakukan presensi masuk.');
        }
      },
      error => {
        console.error('Error getting location:', error);
        alert('Gagal mendapatkan lokasi. Pastikan izin lokasi telah diberikan.');
      }
    );
  } else {
    alert('Geolocation tidak didukung oleh browser ini.');
  }
};

const handlePresensiKeluar = async () => {
  if (!formItem.value.date || !formItem.value.end_time) {
    alert('Harap isi tanggal dan waktu terlebih dahulu!');
    return;
  }

  try {
    const presensiId = formItem.value.id_presensi; // Use the ID from currentPresensi
    await apiPresensiStore.patchPresensi(formItem.value, presensiId);
    alert('Anda telah melakukan presensi keluar!');
  } catch (error) {
    console.error('Terjadi kesalahan saat melakukan presensi keluar:', error);
    alert('Terjadi kesalahan saat melakukan presensi keluar.');
  }
};
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Daily Report</h4>
    <div style="display: flex; justify-content: center; align-items: center; height: 50vh; padding-top: 20px">
      <div style="display: flex; width: 100%; max-width: 1000px">
        <!-- Left Column -->
        <div
          style="
            flex: 1;
            max-width: 50%;
            height: auto;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            background-color: #ffffff;
            margin-right: 10px;
          "
        >
          <div style="padding: 20px">
            <h5 style="margin-bottom: 25px; text-align: center">Presensi Masuk</h5>
            <div class="row g-2" style="margin-bottom: 20px">
              <div class="col mb-0">
                <label for="date" class="form-label">Tanggal</label>
                <input type="date" id="date" class="form-control" placeholder="DD / MM / YY" v-model="formItem.date" />
              </div>
              <div class="col mb-0">
                <label for="start_time" class="form-label">Waktu Masuk</label>
                <input
                  type="time"
                  id="start_time"
                  class="form-control"
                  placeholder="HH : MM"
                  v-model="formItem.start_time"
                />
              </div>
            </div>
            <div style="margin-top: 20px">
              <button
                style="
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-align: center;
                  text-decoration: none;
                  border: none;
                  border-radius: 5px;
                  transition: background-color 0.3s;
                  cursor: pointer;
                "
                @mouseover="hoverLeft = true"
                @mouseleave="hoverLeft = false"
                @click="handlePresensiMasuk"
                :style="{
                  backgroundColor: hoverLeft ? '#0056b3' : '#007bff',
                  pointerEvents: formItem.date === '' || formItem.start_time === '' ? 'none' : 'auto'
                }"
                :disabled="formItem.date === '' || formItem.start_time === ''"
              >
                Presensi disini
              </button>
            </div>
          </div>
        </div>
        <!-- /Left Column -->

        <!-- Right Column -->
        <div
          :style="{
            flex: 1,
            maxWidth: '50%',
            height: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: isRightColumnDisabled ? '#e9ecef' : '#ffffff',
            marginLeft: '10px',
            pointerEvents: isRightColumnDisabled ? 'none' : 'auto'
          }"
        >
          <div style="padding: 20px">
            <h5 style="margin-bottom: 25px; text-align: center">Presensi Keluar</h5>
            <div class="row g-2" style="margin-bottom: 20px">
              <div class="col mb-0">
                <label for="end_date" class="form-label">Tanggal</label>
                <input
                  type="date"
                  id="end_date"
                  class="form-control"
                  placeholder="DD / MM / YY"
                  v-model="formItem.date"
                  :disabled="isRightColumnDisabled"
                />
              </div>
              <div class="col mb-0">
                <label for="end_time" class="form-label">Waktu Pulang</label>
                <input
                  type="time"
                  id="end_time"
                  class="form-control"
                  placeholder="HH : MM"
                  v-model="formItem.end_time"
                  :disabled="isRightColumnDisabled"
                />
              </div>
            </div>
            <div style="margin-top: 20px">
              <button
                style="
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-align: center;
                  text-decoration: none;
                  border: none;
                  border-radius: 5px;
                  transition: background-color 0.3s;
                  cursor: pointer;
                "
                @mouseover="hoverRight = true"
                @mouseleave="hoverRight = false"
                @click="handlePresensiKeluar"
                :style="{
                  backgroundColor: hoverRight && !isRightColumnDisabled ? '#0056b3' : '#007bff'
                }"
                :disabled="isRightColumnDisabled"
              >
                Presensi disini
              </button>
            </div>
          </div>
        </div>
        <!-- /Right Column -->
      </div>
    </div>
  </div>
</template>
