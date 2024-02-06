<template>
  <div class="row">
    <div
      v-for="experience in experiences"
      :key="experience"
      class="column"
      cols="12"
      sm="4"
    >
      <q-card :to="'/experience/' + experience" clickable>
        <q-card-section>
          {{ experience }}
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const experiences = ref([]);
// const experiences = ref(['Farm Visits', 'Room Rentals', 'Masterclasses']);
</script>
