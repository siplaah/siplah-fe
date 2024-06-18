<route lang="yaml">
meta:
  layout: auth
  requiresAuth: false
</route>
<script setup lang="ts">
import { useAuthStore } from '@/stores/api/authStore'
import '@/assets/vendor/css/pages/page-auth.css';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore()
const isAuthenticated = computed(() => auth.isAuthenticated)
const messageError = ref('')
const router = useRouter()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const loginFailed = ref(false);
const isPasswordVisible = ref(false)

const validateForm = () => {
  let valid = true
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) {
    emailError.value = 'Email is required'
    valid = false
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
    valid = false
  }

  return valid
}

const onLogin = async () => {
  if (!validateForm()) return

  messageError.value = ''
  try {
    await auth.login(email.value, password.value)
    if (isAuthenticated.value) {
      router.push('/')
    }
  } catch (error) {
    loginFailed.value = true;
    messageError.value = 'Failed to login. Please check your credentials.'
  }
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-2">Welcome to SIPLAH!</h4>
            <p class="mb-4">Please sign-in to your account</p>

            <form id="formAuthentication" class="mb-3" @submit.prevent="onLogin">
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
              <div v-if="messageError" class="mb-3 text-danger">{{ messageError }}</div>
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

