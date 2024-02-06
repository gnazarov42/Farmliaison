<template>
  <q-carousel v-model="slide" animated>
    <q-carousel-slide
      v-for="place in places"
      :key="place.name"
      :name="place.name"
    >
      <!-- Add place content -->
    </q-carousel-slide>
  </q-carousel>
</template>

<script setup>
import { ref } from 'vue';

const slide = ref(null);
const places = ref([
  { name: 'New York' },
  { name: 'London' },
  // More places
]);
</script>
