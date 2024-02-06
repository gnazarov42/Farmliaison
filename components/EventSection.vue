<template>
  <div class="row">
    <div v-for="event in events" :key="event" class="column" cols="12" sm="6">
      <q-card :to="'/events/' + event" clickable>
        <q-card-section>
          {{ event }}
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const events = ref([]);
// const events = ref(['Weekend Market', 'Holiday Fest']);
</script>
