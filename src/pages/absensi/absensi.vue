<script setup lang="ts">
import { ref } from 'vue';

const hover = ref(false);
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Absensi /</span> Daily Report</h4>
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
        background-color: #f8f9fa;
        padding-top: 20px;
      "
    >
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
            <h5 style="margin-bottom: 10px; text-align: center">Presensi Masuk</h5>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="end_date" class="form-label">Tanggal</label>
                <input type="date" id="end_date" class="form-control" placeholder="DD / MM / YY"/>
                </div>
              <div class="col mb-0">
                <label for="end_time" class="form-label">Waktu Masuk</label>
                <input type="time" id="end_time" class="form-control" placeholder="HH : MM" />
              </div>
            </div>
            <div style="margin-top: 20px;">
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
                @mouseover="hover = true"
                @mouseleave="hover = false"
                :style="{ backgroundColor: hover ? '#0056b3' : '#007bff' }"
              >
                Presensi disini
              </button>
            </div>
          </div>
        </div>
        <!-- /Left Column -->


        <!-- Right Column -->
        <div
          style="
            flex: 1;
            max-width: 50%;
            height: 200px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            background-color: #ffffff;
            margin-left: 10px;
          "
        >
        <div style="padding: 20px">
            <h5 style="margin-bottom: 10px; text-align: center">Presensi Keluar</h5>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="end_date" class="form-label">Tanggal</label>
                <input type="date" id="end_date" class="form-control" placeholder="DD / MM / YY"/>
                </div>
              <div class="col mb-0">
                <label for="end_time" class="form-label">Waktu Pulang</label>
                <input type="time" id="end_time" class="form-control" placeholder="HH : MM" />
              </div>
            </div>
            <div style="margin-top: 20px;">
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
                @mouseover="hover = true"
                @mouseleave="hover = false"
                :style="{ backgroundColor: hover ? '#0056b3' : '#007bff' }"
              >
                Presensi disini
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
