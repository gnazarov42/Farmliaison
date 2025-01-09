<template>
  <div>
    <ClientOnly>
      <AllFarmsMap class="q-pb-md" :locations="events" />
      <CardGrid
        :cards="events"
        :loading="loading"
        :skeletonCount="30"
        :wide="false"
      >
        <template #default="{ card }">
          <EventCard :event="card" class="block" />
        </template>
        <template #skeleton>
          <div>
            <q-skeleton
              width="100%"
              style="aspect-ratio: 1; border-radius: 16px"
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
const events = ref([]);
const loading = ref(true);

const fetchEvents = async () => {
  try {
    loading.value = true;
    const response = await $fetch(`/api/${unref(locale)}/event`, {
      query: {
        latitude: unref(storedCoords).latitude,
        longitude: unref(storedCoords).longitude,
      },
    });
    events.value = response?.body?.events || [];
  } catch (error) {
    console.error('Error fetching event data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEvents);
watch([storedCoords, locale], fetchEvents);
</script>

<style lang="scss" scoped>
/* No need for additional .container class here */
</style>
