<template>
  <div>
    <h1>Create Event Page</h1>
    <!-- Web -->
    <q-input v-model="newEvent.web" label="Website Address" />
    <q-btn
      :disabled="!newEvent.web"
      label="Get Description"
      :loading="loading"
      color="primary"
      @click="getDescription"
    />
    <!-- Title -->
    <q-input v-model="newEvent.title" label="Title" />
    <!-- Date -->
    <q-input v-model="newEvent.date" type="date" label="Event Date" />
    <!-- Location -->
    <q-input v-model="newEvent.location" label="Link to Google Maps Location" />
    <!-- Latitude -->
    <q-input v-model="newEvent.latitude" label="Latitude" />
    <!-- Longitude -->
    <q-input v-model="newEvent.longitude" label="Longitude" />
    <!-- Address -->
    <q-input v-model="newEvent.address" label="Address" />
    <!-- Email -->
    <q-input v-model="newEvent.email" label="Email" />
    <!-- Phone -->
    <q-input v-model="newEvent.phone" label="Phone" />
    <!-- MetaDescription -->
    <q-input
      v-model="newEvent.metaDescription"
      type="textarea"
      label="Meta Description"
    />
    <!-- Description -->
    <tiptap-editor v-model="newEvent.description" />
    <!-- Is Public -->
    <q-toggle v-model="newEvent.isPublic" label="Is Public" />
    <!-- Publication Status -->
    <q-select
      v-model="newEvent.publicationStatus"
      :options="publicationStatusOptions"
      label="Publication Status"
    />
    <q-btn label="Create New Event" color="primary" @click="createEvent" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

definePageMeta({ middleware: 'auth' });

const locale = useLocale();
const { data } = useAuth();

const authorId = data.value.user?.id;

const loading = ref(false);

const publicationStatusOptions = ['UNPUBLISHED', 'PUBLISHED', 'DELETED'];

const newEvent = ref({
  title: '',
  date: '',
  location: '',
  address: '',
  web: '',
  email: '',
  phone: '',
  latitude: 0,
  longitude: 0,
  description: '',
  metaDescription: '',
  isPublic: true,
  publicationStatus: 'UNPUBLISHED',
});

const createEvent = async () => {
  try {
    newEvent.value.creatorFarmId = authorId;
    newEvent.value.latitude = parseFloat(newEvent.value.latitude);
    newEvent.value.longitude = parseFloat(newEvent.value.longitude);

    // Ensure date is properly formatted as ISO-8601 DateTime
    if (newEvent.value.date) {
      newEvent.value.date = new Date(newEvent.value.date).toISOString();
    }

    await $fetch(`/api/${locale}/event/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent.value),
    });
  } catch (error) {
    console.log('🚀 ~ file: edit.vue:202 ~ createEvent ~ error:', error);
    // Handle error
  }
};

const getDescription = async () => {
  if (!newEvent.value.web && !newEvent.value.description) {
    $q.notify({
      type: 'negative',
      message: 'Please provide a web address or some short description',
    });
    return;
  }
  loading.value = true; // Disable the button by setting loading to true
  try {
    const data = await $fetch(`/api/${locale}/ai/describe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: newEvent.value.description,
        url: newEvent.value.web,
      }),
    });
    newEvent.value.description = data.rewrittenDescription;
    if (!newEvent.value.metaDescription && data.metaDescription)
      newEvent.value.metaDescription = data.metaDescription;

    if (!data.valuableData) {
      return;
    }
    const valuableData = { ...data.valuableData }; // Spread the valuableData object
    if (!newEvent.value.title) newEvent.value.title = valuableData?.title;
    if (!newEvent.value.email) newEvent.value.email = valuableData?.email;
    if (!newEvent.value.address) newEvent.value.address = valuableData?.address;
    if (!newEvent.value.phone) newEvent.value.phone = valuableData?.phone;
  } catch (error) {
    console.log('🚀 ~ file: edit.vue:202 ~ getDescription ~ error:', error);
    // Handle error
  } finally {
    loading.value = false; // Re-enable the button by setting loading to false
  }
};

watch(
  () => newEvent.value.location,
  async (newLocation) => {
    if (isUrl(newLocation)) {
      const { latitude, longitude } =
        await extractCoordinatesFromUrl(newLocation);
      if (latitude && longitude) {
        newEvent.value.latitude = latitude;
        newEvent.value.longitude = longitude;
      }
    }
  },
);

onMounted(() => {});
</script>
