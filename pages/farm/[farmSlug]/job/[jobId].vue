<template>
  <div>
    <h1>Edit Job Offer</h1>
    <q-form @submit="updateJob">
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
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const locale = useLocale();

const jobId = route.params.jobId;

const jobTitle = ref('');
const jobDescription = ref('');

const fetchJobData = async () => {
  try {
    const { data: job } = await useFetch(
      `/api/${locale}/farm/${route.params.farmSlug}/job/${jobId}`,
      {
        // Add the transform function to rename keys
        transform: (_job) => {
          // You can apply any necessary transformations here
          return _job;
        },
      },
    );

    // Initialize the job data
    jobTitle.value = job.value.body.job.title;
    jobDescription.value = job.value.body.job.description;
    // Set other job properties as needed
  } catch (error) {
    console.error('Error fetching job data:', error);
  }
};

fetchJobData();

const updateJob = async () => {
  try {
    // Make API request to update job
    const response = await useFetch(
      `/api/${locale}/farm/${route.params.farmSlug}/job/${jobId}`,
      {
        method: 'PUT',
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
      // Job updated successfully, redirect to farm profile page
      // Replace '/farm-profile' with the appropriate path to the farm profile page
      router.push(`/farm/${route.params.farmSlug}`);
    } else {
      // Handle error
      console.error('Failed to update job');
    }
  } catch (error) {
    console.error('Error updating job:', error);
  }
};
</script>
