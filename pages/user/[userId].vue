<template>
  <q-form @submit="submitForm">
    <q-input v-model="currentUser.email" label="Email" readonly />

    <!-- Username -->
    <q-input
      v-model="currentUser.username"
      label="Username"
      placeholder="Enter username"
    />

    <!-- Name -->
    <q-input
      v-model="currentUser.name"
      label="Name"
      placeholder="Enter your name"
    />

    <!-- Profile Picture -->
    <q-input
      v-model="currentUser.profileImage"
      label="Profile Picture URL"
      placeholder="Enter profile picture URL"
    />

    <!-- Phone -->
    <q-input
      v-model="currentUser.phone"
      label="Phone"
      placeholder="Enter phone number"
    />

    <!-- Type: Visitor, Farmer, Worker -->
    <q-select
      v-model="currentUser.type"
      :options="['visitor', 'farmer', 'worker']"
      label="Type"
      multiple
      outlined
    />

    <q-btn label="Update Profile" type="submit" color="primary" />
  </q-form>
</template>

<script setup>
import { useRoute } from 'vue-router';

const currentUser = ref({});
const route = useRoute();

onMounted(async () => {
  const { user } = await useFetchApi(`/api/user/${route.params.userId}`);
  currentUser.value = user;
});

const submitForm = async () => {
  try {
    await useFetchApi(`/api/user/${route.params.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        username: currentUser.value.username,
        name: currentUser.value.name,
        profileImage: currentUser.value.profileImage,
        phone: currentUser.value.phone,
        type: currentUser.value.type,
        // Add other properties as needed
      },
    });
  } catch (error) {
    console.log('🚀 ~ file: [userId].vue:95 ~ submitForm ~ error:', error);
    // Handle error
  }
};
</script>
