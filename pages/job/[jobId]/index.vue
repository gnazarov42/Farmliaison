<template>
  <div
    v-if="!currentJob"
    class="row justify-center items-center"
    style="min-height: 100vh"
  >
    <q-spinner color="primary" size="3em" />
  </div>
  <div v-else>
    <h1>{{ currentJob.title }}</h1>
    <p>{{ currentJob.description }}</p>
    <!-- Render other currentJob details as needed -->
    <q-btn @click="$router.go(-1)"> Back </q-btn>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const locale = useLocale();
const currentJob = ref(null);
const fetchJobData = async () => {
  const { data: job } = await useFetch(
    `/api/${locale}/job/${route.params.jobId}`,
  );
  // Initialize the currentJob with a copy of currentJob data
  currentJob.value = { ...toRaw(job.value).body.job };
};
fetchJobData();
</script>
