<template>
  <div>
    <ClientOnly>
      <AllFarmsMap class="q-pb-md" :locations="[...events, ...farms]" />
      <h2 class="q-mb-md q-px-lg">Favorite Events</h2>
      <!-- Events Grid -->
      <CardGrid
        :cards="events"
        :loading="eventsLoading"
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
      <div class="column items-center">
        <h3 class="text-center">{{ $t('continue_exploring_events') }}</h3>
        <q-btn
          :label="$t('explore_more_events')"
          color="primary"
          :to="localePath('/event')"
          rounded
          class="q-mb-md"
        />
      </div>
      <h2 class="q-mb-md q-px-lg">Favorite Farms</h2>

      <!-- Farms Grid -->
      <CardGrid :cards="farms" :loading="farmsLoading" :skeletonCount="30" wide>
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
      <div class="column items-center">
        <h3 class="text-center q-px-lg">
          {{ $t('continue_exploring_farms') }}
        </h3>
        <q-btn
          :label="$t('explore_more_farms')"
          color="primary"
          :to="localePath('/farm')"
          rounded
          class="q-mb-md"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, unref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const { status } = useAuth();
const { openModal } = useLoginModal();

const localePath = useLocalePath();

const storedCoords = useLocalStorage('user-coords', {
  latitude: null,
  longitude: null,
});
const locale = ref(useLocale());
const events = ref([]);
const farms = ref([]);
const eventsLoading = ref(true);
const farmsLoading = ref(true);

const fetchEvents = async () => {
  try {
    eventsLoading.value = true;
    const response = await $fetch(`/api/${unref(locale)}/fevent`, {
      query: {
        latitude: unref(storedCoords).latitude,
        longitude: unref(storedCoords).longitude,
        favoritesOnly: true,
      },
    });
    events.value = response?.body?.events || [];
  } catch (error) {
    console.error('Error fetching event data:', error);
  } finally {
    eventsLoading.value = false;
  }
};

const fetchFarms = async () => {
  try {
    farmsLoading.value = true;
    const response = await $fetch(`/api/${unref(locale)}/ffarm`, {
      query: {
        latitude: unref(storedCoords).latitude,
        longitude: unref(storedCoords).longitude,
        favoritesOnly: true,
      },
    });
    farms.value = response?.body?.farms || [];
  } catch (error) {
    console.error('Error fetching farm data:', error);
  } finally {
    farmsLoading.value = false;
  }
};

onMounted(async () => {
  if (status.value !== 'authenticated') {
    openModal();
  } else {
    await fetchEvents();
    await fetchFarms();
  }
});
</script>

<style lang="scss" scoped>
/* No need for additional .container class here */
</style>
