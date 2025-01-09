<template>
  <div>
    <q-input
      v-model="editedFarm.name"
      placeholder="Farm Name"
      class="text-h2"
    />

    <h2>Images</h2>

    <ImageUploader
      :entityType="'farm'"
      :entityId="editedFarm.id"
      :mediaFiles="editedFarm.mediaFiles || []"
      @updateMediaFiles="handleMediaFilesUpdate"
    />

    <!-- Edit Location -->
    <q-input
      v-model="editedFarm.location"
      label="Link to Google Maps Location"
    />
    <!-- Location -->
    <q-input v-model="editedFarm.latitude" label="Latitude" />
    <!-- Location -->
    <q-input v-model="editedFarm.longitude" label="Longitude" />

    <!-- Edit Address -->
    <q-input v-model="editedFarm.address" label="Address" />

    <!-- Edit Web -->
    <q-input v-model="editedFarm.web" label="Web Address" />

    <!-- Edit Email -->
    <q-input v-model="editedFarm.email" label="Email" />

    <!-- Edit Phone -->
    <q-input v-model="editedFarm.phone" label="Phone" />
    <!-- Edit Description -->
    <q-input
      v-model="scratchDescription"
      type="textarea"
      label="Short Description"
    />
    <!-- Edit meta escription -->
    <q-input
      v-model="editedFarm.metaDescription"
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

    <tiptap-editor v-model="editedFarm.description" />

    <q-checkbox v-model="translateAll" label="Translate to all languages" />

    <!-- Edit Created Events -->
    <h2>Edit Created Events</h2>

    <!-- Edit Activities -->
    <h2>Edit Activities</h2>
    <q-select
      v-model="editedFarm.activities"
      filled
      use-input
      use-chips
      multiple
      input-debounce="0"
      :options="filterOptions"
      label="Activities"
      @new-value="addNewActivity"
      @filter="filterFn"
    />

    <!-- Edit Products -->
    <h2>Products</h2>

    <div
      v-if="editedFarm && editedFarm.products?.length > 0"
      class="product-grid"
    >
      <div v-for="product in editedFarm.products" :key="product.id">
        <CarouselProductCard :item="product" :editable="isAuthor" />
      </div>
    </div>
    <div v-else>
      <p>No products added.</p>
    </div>
    <nuxt-link :to="localePath(`/farm/${route.params.farmSlug}/product/new`)"
      >New Product</nuxt-link
    >

    <!-- Edit Jobs -->
    <h2>Job Offers</h2>
    <div v-if="editedFarm && editedFarm.jobs?.length > 0">
      <div v-for="job in editedFarm.jobs" :key="job.id">
        <p>
          <strong>{{ job.title }}</strong>
        </p>
        <p>{{ job.description }}</p>
        <nuxt-link
          :to="localePath(`/farm/${route.params.farmSlug}/job/${job.id}`)"
          >Edit</nuxt-link
        >
      </div>
    </div>
    <div v-else>
      <p>No Job offers added.</p>
    </div>
    <nuxt-link :to="localePath(`/farm/${route.params.farmSlug}/job/new`)"
      >New Job Offer</nuxt-link
    >

    <!-- Add more edit fields for other properties as needed -->
    <q-btn
      label="Save"
      color="primary"
      :loading="loading"
      @click="updateFarm"
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

const editedFarm = ref({
  id: '',
  name: '',
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
  createdEvents: [],
  activities: [],
  products: [],
  jobs: [],
  mediaFiles: [],
});
const translateAll = ref(false);
const scratchDescription = ref('');
const activityOptions = ref([]);

const handleMediaFilesUpdate = (updatedFiles, action) => {
  if (['add', 'sort', 'delete'].includes(action)) {
    editedFarm.value.mediaFiles = updatedFiles;
  }
};

const handleChange = async () => {
  // This function is called when the draggable component is reordered
};

const fetchFarmData = async () => {
  try {
    const farmData = await $fetch(
      `/api/${locale}/farm/${route.params.farmSlug}`,
    );

    if (farmData) {
      const transformedActivities =
        farmData.activities?.map((activity) => ({
          value: activity.id,
          label: activity.name,
        })) || [];

      farmData.activities = transformedActivities;
      editedFarm.value = { ...toRaw(farmData) };
    } else {
      console.error('Farm data is missing:', farmData);
    }
  } catch (error) {
    console.error('Error fetching farm data:', error);
  }
};

const fetchActivities = async () => {
  try {
    const activitiesData = await $fetch(`/api/${locale}/activity`);
    activityOptions.value = activitiesData.activities.map((activity) => ({
      label: activity.name,
      value: activity.id,
    }));
  } catch (error) {
    console.error('Failed to fetch activities:', error);
  }
};

const filterOptions = ref([]);

const filterFn = (val, update) => {
  update(() => {
    const searchQuery = val ? val.toString().toLowerCase() : '';

    if (searchQuery === '') {
      filterOptions.value = activityOptions.value;
    } else {
      filterOptions.value = activityOptions.value.filter((option) => {
        const optionLabel = option.label
          ? option.label.toString().toLowerCase()
          : '';
        return optionLabel.includes(searchQuery);
      });
    }
  });
};

const addNewActivity = async (newActivity, done) => {
  try {
    const data = await $fetch(`/api/${locale}/activity/new`, {
      method: 'POST',
      body: {
        name: newActivity,
      },
    });
    const newSavedActivity = data.body.activity;
    if (newSavedActivity) {
      activityOptions.value.push({
        label: newSavedActivity.name[locale],
        value: newSavedActivity.id,
      });
      done(
        {
          label: newSavedActivity.name[locale],
          value: newSavedActivity.id,
        },
        'add',
      );
    } else {
      console.error('Failed to create and fetch the new activity');
    }
  } catch (error) {
    console.error('Error creating and fetching the new activity:', error);
  }
};

const updateFarm = async () => {
  loading.value = true;
  editedFarm.value.translateAll = translateAll.value;
  try {
    await $fetch(`/api/${locale}/farm/${route.params.farmSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: editedFarm.value,
    });
    $q.notify({ type: 'positive', message: 'Content updated successfully' });
    router.push(localePath(`/farm/${route.params.farmSlug}`));
  } catch (error) {
    console.log('Error:', error);
  } finally {
    loading.value = false;
  }
};

const getDescription = async () => {
  if (!editedFarm.value.web && !scratchDescription.value) {
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
        url: editedFarm.value.web,
      },
    });
    editedFarm.value.description = data.rewrittenDescription;

    if (!editedFarm.value.metaDescription && data.metaDescription)
      editedFarm.value.metaDescription = data.metaDescription;

    if (data.valuableData) {
      const valuableData = { ...data.valuableData }; // Spread the valuableData object
      if (!editedFarm.value.name) editedFarm.value.name = valuableData?.name;
      if (!editedFarm.value.email) editedFarm.value.email = valuableData?.email;
      if (!editedFarm.value.address)
        editedFarm.value.address = valuableData?.address;
      if (!editedFarm.value.phone) editedFarm.value.phone = valuableData?.phone;
    }
  } catch (error) {
    console.log('Error:', error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => editedFarm.value.location,
  async (newLocation) => {
    if (isUrl(newLocation)) {
      const { latitude, longitude } =
        await extractCoordinatesFromUrl(newLocation);
      if (latitude && longitude) {
        editedFarm.value.latitude = latitude;
        editedFarm.value.longitude = longitude;
      }
    }
  },
);

onMounted(async () => {
  await fetchFarmData();
  await fetchActivities();
});

const isAuthor = computed(() => {
  if (data.value) {
    return (
      data.value.user?.role.includes('admin') ||
      data.value.user?.id === editedFarm.value?.user?.id
    );
  }
  return false;
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
