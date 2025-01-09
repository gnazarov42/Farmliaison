<template>
  <div>
    <h1>Create Farm Profile</h1>
    <!-- Web -->
    <div class="text-h5 q-mt-sm q-mb-md q-ml-xs">
      {{ $t('provide_webaddress') }}
    </div>
    <q-input
      outlined
      class="q-pb-md"
      v-model="newFarm.web"
      label="Website Address"
    />
    <q-btn
      class="q-mb-md"
      :disabled="!newFarm.web"
      label="Get Description"
      :loading="loading"
      color="primary"
      @click="getDescription"
    />
    <!-- Name -->
    <q-input outlined class="q-pb-md" v-model="newFarm.name" label="Name" />
    <!-- Farm Slug -->
    <q-input outlined class="q-pb-md" v-model="newFarm.farmSlug" label="Slug" />
    <!-- Location -->
    <q-input
      outlined
      class="q-pb-md"
      v-model="newFarm.location"
      label="Link to Google Maps Location"
    />
    <!-- Latitude -->
    <q-input
      outlined
      class="q-pb-md"
      v-model="newFarm.latitude"
      label="Latitude"
    />
    <!-- Longitude -->
    <q-input
      outlined
      class="q-pb-md"
      v-model="newFarm.longitude"
      label="Longitude"
    />
    <!-- Address -->
    <q-input
      outlined
      class="q-pb-md"
      v-model="newFarm.address"
      label="Address"
    />
    <!-- Email -->
    <q-input outlined class="q-pb-md" v-model="newFarm.email" label="Email" />
    <!-- Phone -->
    <q-input outlined class="q-pb-md" v-model="newFarm.phone" label="Phone" />
    <!-- MetaDescription -->
    <q-input
      outlined
      class="q-pb-md"
      v-model="newFarm.metaDescription"
      type="textarea"
      label="Meta Description"
    />
    <!-- Description -->
    <tiptap-editor class="q-pb-md" v-model="newFarm.description" />
    <!-- Add more edit fields for other properties as needed -->
    <q-btn
      class="q-mb-xl"
      label="Create New Farm"
      color="primary"
      @click="createFarm"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import slugify from 'slugify';

definePageMeta({ middleware: 'auth', layout: 'limited' });

const locale = useLocale();
const { data } = useAuth();

const authorId = data.value.user?.id;

const loading = ref(false);

const newFarm = ref({
  name: '',
  location: '',
  address: '',
  web: '',
  email: '',
  phone: '',
  latitude: 0,
  longitude: 0,
  farmSlug: '',
  description: '',
});

const createFarm = async () => {
  try {
    newFarm.value.userId = authorId;
    newFarm.value.latitude = parseFloat(newFarm.value.latitude);
    newFarm.value.longitude = parseFloat(newFarm.value.longitude);
    await $fetch(`/api/${locale}/farm/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFarm.value),
    });
  } catch (error) {
    console.log('🚀 ~ file: edit.vue:202 ~ createFarm ~ error:', error);
    // Handle error
  }
};

const getDescription = async () => {
  if (!newFarm.value.web && !newFarm.value.description) {
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
        description: newFarm.value.description,
        url: newFarm.value.web,
      }),
    });
    newFarm.value.description = data.rewrittenDescription;
    if (!newFarm.value.metaDescription && data.metaDescription)
      newFarm.value.metaDescription = data.metaDescription;

    if (!data.valuableData) {
      return;
    }
    const valuableData = { ...data.valuableData }; // Spread the valuableData object
    if (!newFarm.value.name) newFarm.value.name = valuableData?.name;
    if (!newFarm.value.email) newFarm.value.email = valuableData?.email;
    if (!newFarm.value.address) newFarm.value.address = valuableData?.address;
    if (!newFarm.value.phone) newFarm.value.phone = valuableData?.phone;
  } catch (error) {
    console.log('🚀 ~ file: edit.vue:202 ~ getDescription ~ error:', error);
    // Handle error
  } finally {
    loading.value = false; // Re-enable the button by setting loading to false
  }
};

watch(
  () => newFarm.value.name,
  (newName, oldName) => {
    if (newName !== oldName) {
      newFarm.value.farmSlug = slugify(newName, { lower: true, strict: true });
    }
  },
);

watch(
  () => newFarm.value.location,
  async (newLocation) => {
    if (isUrl(newLocation)) {
      const { latitude, longitude } =
        await extractCoordinatesFromUrl(newLocation);
      if (latitude && longitude) {
        newFarm.value.latitude = latitude;
        newFarm.value.longitude = longitude;
      }
    }
  },
);

onMounted(() => {});
</script>
<style lang="scss" scoped>
:deep(.q-field--outlined .q-field__control) {
  border-radius: 16px;
}
.q-btn {
  border-radius: 16px;
}
</style>
