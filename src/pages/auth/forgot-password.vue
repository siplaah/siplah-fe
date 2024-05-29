<route lang="yaml">
  meta:
    layout: auth
    requiresAuth: false
  </route>
<script setup lang="ts"></script>
<template>
  <div class="container-xxl">
      <div class="authentication-wrapper authentication-basic container-p-y">
        <div class="authentication-inner py-4">
          <!-- Forgot Password -->
          <div class="card">
            <div class="card-body">
              <h4 class="mb-2">Forgot Password? 🔒</h4>
              <p class="mb-4">Masukkan email Anda untuk mengatur ulang kata sandi Anda</p>
              <form id="formAuthentication" class="mb-3" action="/" method="POST">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="text"
                    class="form-control"
                    id="email"
                    name="email"
                    placeholder="Masukkan email anda"
                    autofocus
                    required
                  />
                </div>
                <button class="btn btn-primary d-grid w-100">Send Reset Link</button>
              </form>
              <div class="text-center">
                <router-link to="/auth/login" class="d-flex align-items-center justify-content-center">
                  <i class="bx bx-chevron-left scaleX-n1-rtl bx-sm"></i>
                  Back to login
                </router-link>
              </div>
            </div>
          </div>
          <!-- /Forgot Password -->
        </div>
      </div>
    </div>
</template>
