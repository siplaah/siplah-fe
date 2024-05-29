<route lang="yaml">
meta:
  layout: auth
  requiresAuth: false
</route>
<script setup lang="ts">
import { ref } from 'vue';
import '@/assets/vendor/css/pages/page-auth.css';
import router from '../../router';

const email = ref('');
const password = ref('');
const isPasswordVisible = ref(false);
const emailError = ref('');
const passwordError = ref('');

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const validateForm = () => {
  emailError.value = '';
  passwordError.value = '';

  if (!email.value) {
    emailError.value = 'Email is required';
  }
  if (!password.value) {
    passwordError.value = 'Password is required';
  }

  if (!emailError.value && !passwordError.value) {
    console.log('Form submitted:', { email: email.value, password: password.value });
    router.push('/');
  }
};
</script>
<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-2">Welcome to SIPLAH!</h4>
            <p class="mb-4">Please sign-in to your account</p>

            <form id="formAuthentication" class="mb-3" @submit.prevent="validateForm">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  placeholder="Masukkan email anda"
                  v-model="email"
                  required
                />
                <div v-if="emailError" class="text-danger">{{ emailError }}</div>
              </div>
              <div class="mb-3 form-password-toggle">
                <div class="d-flex justify-content-between">
                  <label class="form-label" for="password">Password</label>
                  <!-- <a href="#">
                    <small>Forgot Password?</small>
                  </a> -->
                  <router-link to="/auth/forgot-password">
                    <small>Forgot Password?</small>
                  </router-link>
                </div>
                <div class="input-group input-group-merge">
                  <input
                    :type="isPasswordVisible ? 'text' : 'password'"
                    id="password"
                    class="form-control"
                    placeholder="Masukkan password anda"
                    aria-describedby="password"
                    v-model="password"
                    required
                  />
                  <span class="input-group-text cursor-pointer" @click="togglePasswordVisibility">
                    <i :class="isPasswordVisible ? 'bx bx-show' : 'bx bx-hide'"></i>
                  </span>
                </div>
                <div v-if="passwordError" class="text-danger">{{ passwordError }}</div>
              </div>
              <div class="mb-3">
                <button class="btn btn-primary d-grid w-100" type="submit">Sign in</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
