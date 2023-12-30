<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
  <main id="home-container">
    <nav>
      <RouterLink to="/customer">Customer</RouterLink><br>
    </nav>
  </main>
</template>

<style>
#home-container {
  position: relative;
  top: 150px;
  display: grid;
  place-content: center;
}
</style>
