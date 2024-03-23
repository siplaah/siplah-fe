<template>
  <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">
      <router-view name="sidebar" />
      <div class="layout-page">
        <router-view name="header" />
        <div class="content-wrapper">
          <router-view />
          <router-view name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
