<template>
  <div
    v-if="!editedFarm"
    class="row justify-center items-center"
    style="min-height: 100vh"
  >
    <q-spinner color="primary" size="3em" />
  </div>
  <div v-else>
    <h1>Edit Farm Profile</h1>
    <CldUploadWidget
      v-slot="{ open }"
      upload-preset="pmt2ciw9"
      :on-upload="handleUpload"
    >
      <button type="button" @click="open">Upload an Image</button>
    </CldUploadWidget>

    <h2>Media Files</h2>
    <div v-for="mediaFile in editedFarm.mediaFiles" :key="mediaFile.id">
      <CldImage
        v-if="mediaFile.url"
        :src="mediaFile.url"
        width="600"
        height="400"
        alt="Media File"
      />
    </div>

    <!-- Edit Name -->
    <q-input v-model="editedFarm.name" label="Name" />

    <!-- Edit Location -->
    <q-input v-model="editedFarm.location" label="Location" />

    <!-- Edit Email -->
    <q-input v-model="editedFarm.user.email" label="Email" />

    <!-- Edit Phone -->
    <q-input v-model="editedFarm.user.phone" label="Phone" />

    <!-- Edit Description -->
    <q-input
      v-model="editedFarm.description.en"
      label="Description (English)"
    />
    <q-input
      v-model="editedFarm.description.es"
      label="Description (Spanish)"
    />

    <!-- Edit Created Events -->
    <h2>Edit Created Events</h2>
    <q-input
      v-for="event in editedFarm.createdEvents"
      :key="event.id"
      v-model="event.name.en"
      label="Event Name (English)"
    />
    <q-input
      v-for="event in editedFarm.createdEvents"
      :key="event.id"
      v-model="event.name.es"
      label="Event Name (Spanish)"
    />

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

    <!-- Edit Jobs -->
    <h2>Edit Jobs</h2>
    <q-input
      v-for="job in editedFarm.jobs"
      :key="job.id"
      v-model="job.title.en"
      label="Job Title (English)"
    />
    <q-input
      v-for="job in editedFarm.jobs"
      :key="job.id"
      v-model="job.title.es"
      label="Job Title (Spanish)"
    />

    <!-- Edit Products -->
    <h2>Edit Products</h2>
    <q-input
      v-for="product in editedFarm.products"
      :key="product.id"
      v-model="product.name.en"
      label="Product Name (English)"
    />
    <q-input
      v-for="product in editedFarm.products"
      :key="product.id"
      v-model="product.name.es"
      label="Product Name (Spanish)"
    />

    <!-- Add more edit fields for other properties as needed -->

    <q-btn label="Save" color="primary" @click="updateFarm" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

const route = useRoute();
const locale = useLocale();
const { data } = useAuth();

const authorId = data.value.user?.id;

const editedFarm = ref(null);
const activityOptions = ref([]); // Initialize as an empty array
const resource = ref(null);

const handleUpload = (result, widget) => {
  resource.value = result.value.info;
  widget.close();

  updateMediaFiles(result.value.info, (newSavedImage, action) => {
    console.log(`Media file ${action}:`, newSavedImage);
  });
};

const updateMediaFiles = async (newImage, done) => {
  try {
    // Make a request to save the new image on the server

    const { data } = await useFetch(`/api/${locale}/media/new`, {
      method: 'POST',
      body: {
        url: newImage.path,
        propertyId: editedFarm.value.id,
        providerPublicId: newImage.public_id,
        authorId,
      },
    });

    console.log('🚀 ~ file: edit.vue:148 ~ updateMediaFiles ~ data:', data);
    const newSavedImage = toRaw(data.value).body.mediaFile;
    console.log(
      '🚀 ~ file: edit.vue:157 ~ updateMediaFiles ~ newSavedImage:',
      newSavedImage,
    );

    if (newSavedImage) {
      editedFarm.value.mediaFiles.push(newSavedImage); // Add the new image to mediaFiles array
      done(newSavedImage, 'add');
      // You can also update any other relevant properties of editedFarm as needed
    } else {
      console.error('Failed to create and fetch the new image');
    }
  } catch (error) {
    console.error('Error creating and fetching the new image:', error);
  }
};

const fetchFarmData = async () => {
  const { data: farm } = await useFetch(
    `/api/${locale}/farm/${route.params.farmSlug}`,
    {
      // Add the transform function to rename keys
      transform: (_farm) => {
        const transformedActivities = _farm.farm.activities.map((activity) => ({
          value: activity.activity.id,
          label: activity.activity.name[locale],
        }));

        // Replace the original activities key with the transformed _farm
        _farm.farm.activities = transformedActivities;
        return _farm.farm;
      },
    },
  );

  // Initialize the editedFarm with a copy of currentFarm data
  editedFarm.value = { ...toRaw(farm.value) };
};

const fetchActivities = async () => {
  // Fetch all available activities and populate activityOptions
  const { data: activities, error } = await useFetch(`/api/${locale}/activity`);

  console.log('🚀 ~ file: edit.vue:121 ~ fetchActivities ~ error:', error);
  activityOptions.value = toRaw(activities.value).activities.map(
    (activity) => ({
      label: activity.name,
      value: activity.id,
    }),
  );
};

const filterOptions = ref([]); // Initialize as an empty array

// Implement filterFn to handle filtering
const filterFn = (val, update) => {
  update(() => {
    // If the filter text is empty, show all options
    if (val === '') {
      filterOptions.value = activityOptions.value;
    } else {
      // Filter the options based on the query
      filterOptions.value = activityOptions.value.filter((option) =>
        option.label.toLowerCase().includes(val.toLowerCase()),
      );
    }
  });
};
fetchFarmData();
fetchActivities();

const addNewActivity = async (newActivity, done) => {
  try {
    // Make a request to save the new activity on the server
    const { data } = await useFetch(`/api/${locale}/activity/new`, {
      method: 'POST',
      body: {
        name: newActivity,
      },
    });
    const newSavedActivity = toRaw(data.value).body.activity;

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

      // You can also update any other relevant properties of editedFarm as needed
    } else {
      console.error('Failed to create and fetch the new activity');
    }
  } catch (error) {
    console.error('Error creating and fetching the new activity:', error);
  }
};

const updateFarm = async () => {
  try {
    await useFetch(`/api/${locale}/farm/${route.params.farmSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: editedFarm,
    });
  } catch (error) {
    console.log('🚀 ~ file: edit.vue:202 ~ updateFarm ~ error:', error);
    // Handle error
  }
};

onMounted(() => {});
</script>
