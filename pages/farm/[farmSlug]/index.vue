<template>
  <div
    v-if="!currentFarm"
    class="row justify-center items-center"
    style="min-height: 100vh"
  >
    <q-spinner color="primary" size="3em" />
  </div>
  <div v-else>
    <h1>{{ currentFarm.name }}</h1>
    <nuxt-link v-if="isAuthor" :to="`/farm/${route.params.farmSlug}/edit`"
      >Edit Farm</nuxt-link
    >
    <p>{{ currentFarm.location }}</p>
    <p>{{ useTranslated(currentFarm.description) }}</p>
    <!-- Render other currentFarm details as needed -->
    <FarmMap
      :latitude="currentFarm.latitude"
      :longitude="currentFarm.longitude"
    />

    <h2>Bookings</h2>
    <ul>
      <li v-for="booking in currentFarm.bookings" :key="booking.id">
        {{ booking.date }}
      </li>
    </ul>

    <h2>Created Events</h2>
    <ul>
      <li v-for="event in currentFarm.createdEvents" :key="event.id">
        {{ event.name }}
      </li>
    </ul>

    <h2>Activities</h2>
    <ul>
      <li v-for="activity in currentFarm.activities" :key="activity.id">
        {{ activity.name }}
      </li>
    </ul>

    <h2>Favorites</h2>
    <ul>
      <li v-for="favorite in currentFarm.favorites" :key="favorite.id">
        {{ favorite.name }}
      </li>
    </ul>

    <h2>Jobs</h2>
    <ul>
      <li v-for="job in currentFarm.jobs" :key="job.id">{{ job.title }}</li>
    </ul>

    <h2>Products</h2>
    <ul>
      <li v-for="product in currentFarm.products" :key="product.id">
        {{ product.name }}
      </li>
    </ul>

    <h2>User</h2>
    <p>Email: {{ currentFarm.user.email }}</p>
    <p>Name: {{ currentFarm.user.name }}</p>
    <!-- Render other user details as needed -->
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const { data } = useAuth();

const route = useRoute();
const locale = useLocale();
const currentFarm = ref(null);
const fetchFarmData = async () => {
  const { data: farm } = await useFetch(
    `/api/${locale}/farm/${route.params.farmSlug}`,
    {
      // Add the transform function to rename keys
      transform: (_farm) => {
        const transformedActivities = _farm.farm.activities.map((activity) => ({
          id: activity.activity.id,
          name: activity.activity.name[locale],
        }));
        // Replace the original activities key with the transformed _farm
        _farm.farm.activities = transformedActivities;
        return _farm.farm;
      },
    },
  );
  // Initialize the currentFarm with a copy of currentFarm data
  currentFarm.value = { ...toRaw(farm.value) };
};
fetchFarmData();

const isAuthor = computed(() => {
  if (data.value) {
    return (
      data.value.user.role.includes('admin') ||
      data.value.user?.id === currentFarm.value.user.id
    );
  }
  return false;
});
</script>
