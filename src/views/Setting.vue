<template>
  <div class="card mb-4">
    <h5 class="card-header">Detail Profil</h5>
    <div class="card-body">
      <div class="d-flex align-items-start align-items-sm-center gap-4">
        <img
          src="../assets/img/avatars/1.png"
          alt="user-avatar"
          class="d-block rounded"
          height="100"
          width="100"
          id="uploadedAvatar"
        />
        <div class="button-wrapper">
          <label for="upload" class="btn btn-primary me-2 mb-4" tabindex="0">
            <span class="d-none d-sm-block">Upload Foto</span>
            <i class="bx bx-upload d-block d-sm-none"></i>
            <input type="file" id="upload" class="account-file-input" hidden accept="image/png, image/jpeg" />
          </label>
          <button type="button" class="btn btn-outline-secondary account-image-reset mb-4">
            <i class="bx bx-reset d-block d-sm-none"></i>
            <span class="d-none d-sm-block">Hapus</span>
          </button>

          <!-- <p class="text-muted mb-0"></p> -->
        </div>
      </div>
    </div>
    <hr class="my-0" />
    <div class="card-body">
      <form id="formAccountSettings" method="POST" onsubmit="return false">
        <div class="row">
          <div class="mb-3 col-md-15">
            <label for="nama" class="form-label">Nama</label>
            <input class="form-control" type="text" id="nama" name="nama" value="" autofocus />
          </div>
          <div class="mb-3 col-md-6">
            <label for="password" class="form-label">Password Baru</label>
            <input class="form-control" type="password" name="password" id="password" value="" />
          </div>
          <div class="mb-3 col-md-6">
            <label for="password" class="form-label">Konfirmasi Password Baru</label>
            <input
              class="form-control"
              type="password"
              id="password"
              name="password"
              value=""
              placeholder=""
            />
          </div>
          <!-- <div class="mb-3 col-md-6">
            <label for="organization" class="form-label">Organization</label>
            <input type="text" class="form-control" id="organization" name="organization" value="ThemeSelection" />
          </div> -->
          <div class="mt-2">
            <button type="submit" class="btn btn-primary me-2">Save changes</button>
            <button type="reset" class="btn btn-outline-secondary">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import '../assets/vendor/css/core.css';
import '../assets/vendor/css/theme-default.css';
import '../assets/js/pages-account-settings-account.js';
import '../assets/css/demo.css';
</script>

<style scoped>
/* Gaya untuk halaman utama */
</style>
