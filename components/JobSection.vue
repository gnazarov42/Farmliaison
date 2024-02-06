<template>
  <div class="row">
    <div v-for="job in jobs" :key="job" class="column" cols="12" sm="6">
      <q-card :to="'/jobs/' + job" clickable>
        <q-card-section>
          {{ job }}
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const jobs = ref([]);
// const jobs = ref(['Seasonal Harvest', 'Tractor Operator']);
</script>
