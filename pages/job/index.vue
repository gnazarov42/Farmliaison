<template>
  <!-- Job List -->
  <div class="q-px-xl q-pt-lg" style="min-height: 100vh">
    <h1>{{ $t('job_offers') }}</h1>
    <div class="container q-px-xl q-pt-lg">
      <q-list padding class="q-pt-lg">
        <q-item
          v-for="(job, index) in jobs"
          :key="index"
          v-ripple
          :to="localePath(`/job/${job.id}`)"
          clickable
        >
          <q-item-section>
            <q-item-label>
              {{ job.title }}
            </q-item-label>
            <q-item-label>
              {{ job.description }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
const locale = useLocale();
const jobs = ref([]);

try {
  // Fetch job data using useFetch
  const { data: jobData } = await useFetch(`/api/${locale}/job`); // Replace with your actual API endpoint
  jobs.value = jobData.value.body.jobs;
} catch (error) {
  console.error('Error fetching job data:', error);
}

// Update the stars prop with the emitted value
// const updateStars = (value) => {
//   stars.value = value;
// };
</script>
<style lang="scss" scoped>
.container {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-items: center;
}
</style>
