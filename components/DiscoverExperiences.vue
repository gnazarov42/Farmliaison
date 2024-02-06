<template>
  <q-carousel v-model="slide" animated>
    <q-carousel-slide
      v-for="experience in experiences"
      :key="experience.name"
      :name="experience.name"
    >
      <!-- Add experience content -->
    </q-carousel-slide>
  </q-carousel>
</template>

<script setup>
import { ref } from 'vue';

const slide = ref(null);
const experiences = ref([
  { name: 'Safari' },
  { name: 'Hot Air Balloon' },
  // More experiences
]);
</script>
