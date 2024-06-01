<script setup lang="ts">
const props = defineProps<{
  onDelete: () => void;
}>();

const confirmDelete = () => {
  props.onDelete();
};
</script>

<template>
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-center">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <h5>Apakah anda yakin ingin menghapus data ini?</h5>
          <i class="bx bx-trash bx-tada" style="color: rgba(255, 0, 0, 0.6); font-size: 150px"></i>
        </div>
        <div class="modal-footer d-flex justify-content-center">
          <button type="button" class="btn btn-primary" @click="confirmDelete" data-bs-dismiss="modal">Ya</button>
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Tidak</button>
        </div>
      </div>
    </div>
  </div>
</template>



