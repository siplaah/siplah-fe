<route lang="yaml">
meta:
  layout: auth
  requiresAuth: true
</route>
<template>
  <div class="container-xxl container-p-y d-flex justify-content-center align-items-center min-vh-100 text-center">
    <div class="misc-wrapper">
      <h2 class="mb-2 mx-2">Unauthorized!</h2>
      <p class="mb-4 mx-2">Oops! 😖 kamu tidak memiliki akses untuk halaman ini</p>
      <router-link to="/">
        <button type="button" class="btn btn-primary">Kembali ke Dashboard</button>
      </router-link>
      <div class="mt-4">
        <img
          src="../../assets/img/illustrations/girl-doing-yoga-light.png"
          alt="girl-doing-yoga-light"
          width="500"
          class="img-fluid"
          data-app-dark-img="illustrations/girl-doing-yoga-dark.png"
          data-app-light-img="illustrations/girl-doing-yoga-light.png"
        />
      </div>
    </div>
  </div>
</template>
