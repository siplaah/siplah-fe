<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
  </route>
<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="row">
      <div class="col-lg-8 mb-4 order-0">
        <div class="card">
          <div class="d-flex align-items-end row">
            <div class="col-sm-7">
              <div class="card-body">
                <h5 class="card-title text-primary">Hai Admin! 👋</h5>
                <p class="mb-4">
                  Waktunya untuk memulai hari dengan semangat! Ayo mulai hari ini dengan penuh energi dan produktivitas.
                </p>
                <!-- Tombol untuk melakukan presensi -->
                <router-link to="/absensi/absensi">
                  <button type="button" class="btn btn-primary">Presensi Sekarang</button>
                </router-link>
              </div>
            </div>
            <div class="col-sm-5 text-center text-sm-left">
              <div class="card-body pb-0 px-0 px-md-4">
                <img
                  src="../assets/img/illustrations/man-with-laptop-light.png"
                  height="140"
                  alt="View Badge User"
                  data-app-dark-img="illustrations/man-with-laptop-dark.png"
                  data-app-light-img="illustrations/man-with-laptop-light.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-4 mb-4">
        <div class="card">
          <div class="card-body">
            <div class="d-flex flex-column align-items-center justify-content-center text-center">
              <div class="card-title">
                <h5 class="text-nowrap text-primary mb-2">Congratulations Admin! 🎉</h5>
                <span class="badge bg-label-warning rounded-pill">Mei 2024</span>
              </div>
              <div class="mt-auto">
                <h5 class="mb-0 display-1">92</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-12 col-md-4 order-1">
        <div class="row">
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bx-user me-4" style="font-size: 2rem; color: green"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Karyawan</span>
                    <h3 class="card-title fw-bold mb-2">50</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bxl-codepen me-4" style="font-size: 2rem; color: orange"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Jabatan</span>
                    <h3 class="card-title fw-bold mb-2">15</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bx-task me-4" style="font-size: 2rem; color: red"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Project</span>
                    <h3 class="card-title fw-bold mb-2">10</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bx-time me-4" style="font-size: 2rem; color: black"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Presensi</span>
                    <h3 class="card-title fw-bold mb-2">30</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bx-sun me-4" style="font-size: 2rem; color: yellow"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Cuti</span>
                    <h3 class="card-title fw-bold mb-2">2</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <i class="menu-icon tf-icons bx bxs-hourglass me-4" style="font-size: 2rem; color: green"></i>
                  <div>
                    <span class="fw-semibold d-block mb-1">Lembur</span>
                    <h3 class="card-title fw-bold mb-2">0</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6 col-lg-6 col-xl-6 order-0 mb-4">
        <div class="card">
          <h5 class="card-header">Meeting hari ini</h5>
          <div class="table-responsive text-nowrap">
            <table class="table table-striped table-borderless">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Deskripsi</th>
                </tr>
              </thead>
              <tbody class="table-border-bottom-0">
                <tr>
                  <td colspan="2">Tidak ada meeting hari ini</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-lg-6 col-xl-6 order-0 mb-4">
        <div class="card">
          <h5 class="card-header">Cuti Selama 7 hari kedepan</h5>
          <div class="table-responsive text-nowrap">
            <table class="table table-striped table-borderless">
              <thead>
                <tr>
                  <th>Karyawan Cuti</th>
                  <th>Tgl. Cuti</th>
                </tr>
              </thead>
              <tbody class="table-border-bottom-0">
                <tr>
                  <td colspan="2">Tidak ada yang Cuti selama 7 hari kedepan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
