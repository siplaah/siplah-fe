<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Account Settings /</span> Account</h4>

    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <h5 class="card-header">Profile Details</h5>
          <!-- Account -->
          <div class="card-body">
            <div class="d-flex align-items-start align-items-sm-center gap-4">
              <img
                src="../../assets/img/avatars/1.png"
                alt="user-avatar"
                class="d-block rounded"
                height="100"
                width="100"
                id="uploadedAvatar"
              />
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

                <!-- <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p> -->
              </div>
            </div>
          </div>
          <hr class="my-0" />
          <div class="card-body">
            <form id="formAccountSettings" action="/profil">
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="nama" class="form-label">Nama</label>
                  <input type="text" class="form-control" id="nama" name="nama" value="" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="email" class="form-label">Email</label>
                  <input class="form-control" type="text" id="email" name="email" value="" placeholder="" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="address" class="form-label">Alamat</label>
                  <textarea class="form-control" id="address" name="address" placeholder="Address"></textarea>
                </div>
                <div class="mb-3 col-md-6">
                  <label class="form-label" for="gender">Gender</label>
                  <select id="gender" class="select2 form-select">
                    <option value="" selected></option>
                    <option value="">Perempuan</option>
                    <option value="">Laki-laki</option>
                  </select>
                </div>
                <div class="mb-3 col-md-6">
                  <label class="form-label" for="gender">Status</label>
                  <select id="gender" class="select2 form-select">
                    <option value="" selected></option>
                    <option value="">Karyawan</option>
                    <option value="">Freelance</option>
                    <option value="">Partime</option>
                    <option value="">Probition</option>
                  </select>
                </div>
                <div class="mb-3 col-md-6">
                  <label class="form-label" for="gender">Pendidikan</label>
                  <select id="gender" class="select2 form-select">
                    <option value="" selected></option>
                    <option value="">SMA/SMK</option>
                    <option value="">D3</option>
                    <option value="">S1</option>
                    <option value="">S2</option>
                    <option value="">S3</option>
                  </select>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="nama" class="form-label">Tempat Lahir</label>
                  <input type="text" class="form-control" id="tempatlahir" name="tempatlahir" value="" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="tanggal_lahir" class="form-label">Tanggal Lahir</label>
                  <input type="date" class="form-control" id="tanggal_lahir" name="tanggal_lahir" value="" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="formFile" class="form-label">KTP</label>
                  <input class="form-control mb-2" type="file" id="formFile" name="images" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="formFile" class="form-label">NPWP</label>
                  <input class="form-control mb-2" type="file" id="formFile" name="images" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="password" class="form-label">Password Baru</label>
                  <input type="password" class="form-control" id="password" name="password" value="" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="password" class="form-label">Konfirmasi Password Baru</label>
                  <input type="password" class="form-control" id="password" name="password" value="" />
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-primary me-2">Save changes</button>
                <button type="reset" class="btn btn-outline-secondary">Cancel</button>
              </div>
            </form>
          </div>
          <!-- /Account -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import '../assets/vendor/css/core.css';
// import '../assets/vendor/css/theme-default.css';
// import '../assets/js/pages-account-settings-account.js';
// import '../assets/css/demo.css';
</script>

<style scoped>
/* Gaya untuk halaman utama */
</style>
