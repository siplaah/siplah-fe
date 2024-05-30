<template>
  <nav aria-label="Page navigation">
    <ul class="pagination pagination-sm justify-content-center mt-3">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" @click="currentPage > 1 && changePage(currentPage - 1)">
          <i class="tf-icon bx bx-chevrons-left"></i>
        </a>
      </li>
      <li
        class="page-item"
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
      >
        <a class="page-link" @click="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" @click="currentPage < totalPages && changePage(currentPage + 1)">
          <i class="tf-icon bx bx-chevrons-right"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits(['pageChange']);

const changePage = (page: number) => {
  emit('pageChange', page);
};
</script>

<style scoped>
/* Add any specific styles for the pagination component if needed */
</style>
