<script setup lang="ts">
import { ref } from 'vue';

const hoverLeft = ref(false);
const hoverRight = ref(false);
const isRightColumnDisabled = ref(true);
const date = ref('');
const startTime = ref('');

function showAlert() {
  if (date.value === '' || startTime.value === '') {
    alert('Harap isi tanggal dan waktu terlebih dahulu!');
  } else {
    alert('Anda telah melakukan presensi!');
    isRightColumnDisabled.value = false;
  }
}
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
                <input type="date" id="date" class="form-control" placeholder="DD / MM / YY" v-model="date" />
              </div>
              <div class="col mb-0">
                <label for="start_time" class="form-label">Waktu Masuk</label>
                <input type="time" id="start_time" class="form-control" placeholder="HH : MM" v-model="startTime" />
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
                @click="showAlert"
                :style="{
                  backgroundColor: hoverLeft ? '#0056b3' : '#007bff',
                  pointerEvents: date === '' || startTime === '' ? 'none' : 'auto'
                }"
                :disabled="date === '' || startTime === ''"
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
                :style="{ backgroundColor: hoverRight && !isRightColumnDisabled ? '#0056b3' : '#007bff' }"
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
