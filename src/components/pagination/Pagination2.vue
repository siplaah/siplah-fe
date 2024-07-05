<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  totalData: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(['update:page', 'update:params']);

const getLastPage = computed(() => {
  if (!props.totalData || props.totalData <= 0 || props.params.pageSize <= 0) {
    return 1;
  }
  return Math.ceil(props.totalData / props.params.pageSize);
});

const changePage = (page: number) => {
  if (!props.totalData || page < 1 || page > getLastPage.value) return;
  const newParams = { ...props.params, page };
  emits('update:params', newParams);
  emits('update:page');
};

const totalPages = computed(() => {
  return getLastPage.value;
});

const currentPage = computed(() => {
  return props.params.page;
});
</script>

<template>
  <div class="flex justify-between py-4">
    <div class="text-12 py-2 fw-semibold mt-3" style="margin-left: 20px">
      Menampilkan {{ (params.page - 1) * params.pageSize + 1 }} sampai
      {{ Math.min(params.page * params.pageSize, totalData) }} dari {{ totalData }} data.
    </div>
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
  </div>
</template>
