<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
  { task: 'mengerjakan TA', status: 'DONE', link: 'zxcvbnm' },
  { task: 'nonton', status: 'on progres', link: 'sdfghj' }
]); 
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Master /</span> Daily Report</h4>

    <!-- Striped Rows -->
    <div class="card">
      <div class="table-responsive text-nowrap">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Task</th>
              <th>Status</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.task }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.link }}</td>
              <td>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--/ Striped Rows -->
  </div>
</template>
