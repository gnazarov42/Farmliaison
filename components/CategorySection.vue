<template>
  <div class="row">
    <div
      v-for="category in categories"
      :key="category"
      class="column"
      cols="12"
      sm="4"
    >
      <q-card :to="'/' + category" clickable>
        <q-card-section>
          {{ category }}
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const categories = ref([]);
// const categories = ref(['Experiences', 'Online Experiences', 'Homes']);
</script>
