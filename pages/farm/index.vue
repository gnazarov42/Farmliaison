<template>
  <q-page-container>
    <!-- Farm List -->
    <div class="row">
      <FarmCard
        v-for="(farm, index) in farms"
        :key="index"
        v-model:stars="stars"
        :farm="farm"
      />
    </div>
  </q-page-container>
</template>

<script setup>
const locale = useLocale();
const farms = ref([]);
const stars = ref(0);

try {
  // Fetch farm data using useFetch
  const { data: farmData } = await useFetch(`/api/${locale}/farm`); // Replace with your actual API endpoint
  farms.value = farmData.value.farms;
} catch (error) {
  console.error('Error fetching farm data:', error);
}

// Update the stars prop with the emitted value
// const updateStars = (value) => {
//   stars.value = value;
// };
</script>
