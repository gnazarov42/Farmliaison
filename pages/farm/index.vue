<template>
  <div>
    <ClientOnly>
      <AllFarmsMap class="q-pb-md" :locations="farms" />
      <CardGrid
        :cards="farms"
        :loading="loading"
        :skeletonCount="30"
        :wide="false"
      >
        <template #default="{ card }">
          <FarmCard :farm="card" class="block" />
        </template>
        <template #skeleton>
          <div>
            <q-skeleton
              width="100%"
              style="aspect-ratio: 360 / 264; border-radius: 16px"
              square
            />
            <q-skeleton width="100%" class="q-mt-md" square />
            <q-skeleton width="40%" class="q-mt-md" square />
          </div>
        </template>
      </CardGrid>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, unref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const storedCoords = useLocalStorage('user-coords', {
  latitude: null,
  longitude: null,
});
const locale = ref(useLocale());
const farms = ref([]);
const loading = ref(true);

const fetchFarms = async () => {
  try {
    loading.value = true;
    const response = await $fetch(`/api/${unref(locale)}/farm`, {
      query: {
        latitude: unref(storedCoords).latitude,
        longitude: unref(storedCoords).longitude,
      },
    });
    farms.value = response?.body?.farms || [];
  } catch (error) {
    console.error('Error fetching farm data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFarms);
watch([storedCoords, locale], fetchFarms);
</script>
<style lang="scss" scoped>
/* No need for additional .container class here */
</style>
