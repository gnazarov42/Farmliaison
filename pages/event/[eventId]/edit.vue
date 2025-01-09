<template>
  <div>
    <q-input
      v-model="editedEvent.title"
      placeholder="Event Title"
      class="text-h2"
    />

    <h2>Images</h2>

    <ImageUploader
      :entityType="'event'"
      :entityId="editedEvent.id"
      :mediaFiles="editedEvent.mediaFiles || []"
      @updateMediaFiles="handleMediaFilesUpdate"
    />

    <!-- Edit Location -->
    <q-input
      v-model="editedEvent.location"
      label="Link to Google Maps Location"
    />
    <!-- Location -->
    <q-input v-model="editedEvent.latitude" label="Latitude" />
    <!-- Location -->
    <q-input v-model="editedEvent.longitude" label="Longitude" />

    <!-- Edit Address -->
    <q-input v-model="editedEvent.address" label="Address" />

    <!-- Edit Web -->
    <q-input v-model="editedEvent.web" label="Web Address" />

    <!-- Edit Email -->
    <q-input v-model="editedEvent.email" label="Email" />

    <!-- Edit Phone -->
    <q-input v-model="editedEvent.phone" label="Phone" />
    <!-- Edit Description -->
    <q-input
      v-model="scratchDescription"
      type="textarea"
      label="Short Description"
    />
    <!-- Edit meta escription -->
    <q-input
      v-model="editedEvent.metaDescription"
      type="textarea"
      label="meta  Description"
    />

    <q-btn
      color="primary"
      :loading="loading"
      label="Compose Description"
      @click="getDescription"
    />
    <!-- Edit Description -->

    <tiptap-editor v-model="editedEvent.description" />

    <q-checkbox v-model="translateAll" label="Translate to all languages" />

    <!-- Add more edit fields for other properties as needed -->
    <q-btn
      label="Save"
      color="primary"
      :loading="loading"
      @click="updateEvent"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, reactive, computed, watch, toRaw } from 'vue';
import { useQuasar } from 'quasar';

// Access Quasar's instance
const $q = useQuasar();
const loading = ref(false);

definePageMeta({ middleware: 'auth' });

const route = useRoute();
const router = useRouter();
const locale = useLocale();
const localePath = useLocalePath();

const { data } = useAuth();

const emit = defineEmits(['delete']);

const editedEvent = ref({
  id: '',
  title: '',
  location: '',
  latitude: '',
  longitude: '',
  address: '',
  web: '',
  email: '',
  phone: '',
  description: '',
  metaDescription: '',
  translateAll: false,
  mediaFiles: [],
});
const translateAll = ref(false);
const scratchDescription = ref('');

const handleMediaFilesUpdate = (updatedFiles, action) => {
  if (['add', 'sort', 'delete'].includes(action)) {
    editedEvent.value.mediaFiles = updatedFiles;
  }
};

const handleChange = async () => {
  // This function is called when the draggable component is reordered
};

const fetchEventData = async () => {
  try {
    const eventData = await $fetch(
      `/api/${locale}/event/${route.params.eventId}`,
    );

    editedEvent.value = { ...toRaw(eventData) };
  } catch (error) {
    console.error('Error fetching event data:', error);
  }
};

const updateEvent = async () => {
  loading.value = true;
  editedEvent.value.translateAll = translateAll.value;
  try {
    await $fetch(`/api/${locale}/event/${route.params.eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: editedEvent.value,
    });
    $q.notify({ type: 'positive', message: 'Content updated successfully' });
    router.push(localePath(`/event/${route.params.eventId}`));
  } catch (error) {
    console.log('Error:', error);
  } finally {
    loading.value = false;
  }
};

const getDescription = async () => {
  if (!editedEvent.value.web && !scratchDescription.value) {
    $q.notify({
      type: 'negative',
      message: 'Please provide a web address or some short description',
    });
    return;
  }
  loading.value = true;
  try {
    const data = await $fetch(`/api/${locale}/ai/describe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        description: scratchDescription.value,
        url: editedEvent.value.web,
      },
    });
    editedEvent.value.description = data.rewrittenDescription;

    if (!editedEvent.value.metaDescription && data.metaDescription)
      editedEvent.value.metaDescription = data.metaDescription;

    if (data.valuableData) {
      const valuableData = { ...data.valuableData }; // Spread the valuableData object
      if (!editedEvent.value.title)
        editedEvent.value.title = valuableData?.title;
      if (!editedEvent.value.email)
        editedEvent.value.email = valuableData?.email;
      if (!editedEvent.value.address)
        editedEvent.value.address = valuableData?.address;
      if (!editedEvent.value.phone)
        editedEvent.value.phone = valuableData?.phone;
    }
  } catch (error) {
    console.log('Error:', error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => editedEvent.value.location,
  async (newLocation) => {
    if (isUrl(newLocation)) {
      const { latitude, longitude } =
        await extractCoordinatesFromUrl(newLocation);
      if (latitude && longitude) {
        editedEvent.value.latitude = latitude;
        editedEvent.value.longitude = longitude;
      }
    }
  },
);

onMounted(async () => {
  await fetchEventData();
});
</script>

<style lang="scss" scoped>
:deep(.gallery) {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: minmax(100px, 150px);
  @media screen and (max-width: 1023px) {
    display: flex;
  }
}

:deep(.big) {
  grid-column: span 2 / auto;
  grid-row: span 2 / auto;
}

:deep(.tall) {
  grid-column: span 1;
  grid-row: span 2;
}

:deep(.wide) {
  grid-column: span 2;
  grid-row: span 1;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
  grid-template-rows: auto auto 1fr;
  gap: 1rem;
}
</style>
