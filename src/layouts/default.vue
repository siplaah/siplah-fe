<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
  <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">
      <Sidebar></Sidebar>
      <div class="layout-page">
        <Navbar></Navbar>
        <div class="content-wrapper">
          <RouterView />
          <Footer></Footer>
          <div class="content-backdrop fade"></div>
        </div>
      </div>
    </div>
    <div class="layout-overlay layout-menu-toggle"></div>
  </div>
</template>


