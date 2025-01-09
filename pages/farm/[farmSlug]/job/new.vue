<template>
  <div>
    <h1>Add New Job Offer</h1>
    <q-form @submit="addJob">
      <!-- Job Title -->
      <q-input v-model="jobTitle" label="Job Title" />

      <!-- Job Description -->
      <q-input
        v-model="jobDescription"
        type="textarea"
        label="Job Description"
      />

      <!-- Add more form fields as needed -->

      <q-btn label="Save" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const jobTitle = ref('');
const jobDescription = ref('');
const locale = useLocale();

const addJob = async () => {
  try {
    // Make API request to add new job
    const response = await useFetch(
      `/api/${locale}/farm/${route.params.farmSlug}/job/new`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobTitle.value,
          description: jobDescription.value,
          // Add more properties as needed
        }),
      },
    );

    if (response.ok) {
      // Job added successfully, redirect to farm profile page
      // Replace '/farm-profile' with the appropriate path to the farm profile page
      router.push(`/farm/${route.params.farmSlug}`);
    } else {
      // Handle error
      console.error('Failed to add job');
    }
  } catch (error) {
    console.error('Error adding job:', error);
  }
};
</script>
