<template>
  <q-form @submit="submitForm">
    <div class="row no-wrap justify-around content-container">
      <!-- Profile Picture and buttons -->
      <div class="column items-center avatar q-pb-md q-mr-md">
        <!-- Profile Picture -->
        <NuxtImg
          class="q-mb-md"
          v-if="currentUser?.profileImage"
          :src="currentUser?.profileImage"
          width="215"
          height="215"
          style="border-radius: 50%"
        />
        <q-uploader
          class="q-mb-md"
          url="/api/cloud/upload"
          label="Profile picture"
          auto-upload
          style="max-width: 215px"
          @uploaded="onUploaded"
          @remove="onFileRemoved"
          @failed="onUploadFailed"
        />
        <!-- Buttons below avatar -->
        <ClientOnly>
          <q-btn
            outline
            rounded
            color="dark-olive"
            v-if="currentUser.farmSlug"
            style="height: 3rem; width: 215px"
            :to="localePath(`/farm/${currentUser.farmSlug}`)"
            >{{ $t('view_my_farm_page') }}
          </q-btn>
          <q-btn
            outline
            rounded
            color="dark-olive"
            style="height: 3rem; width: 215px"
            v-else-if="currentUser.type && currentUser.type.includes('farmer')"
            :to="localePath('/farm/new-farm')"
            >{{ $t('create_my_farm_page') }}
          </q-btn>
        </ClientOnly>
      </div>

      <q-card flat class="q-mb-xl">
        <q-card-section class="q-px-lg">
          <h2 class="q-my-md q-mx-sm">{{ $t('your_profile') }}</h2>
          <p class="text-body1 q-ml-sm">{{ $t('the_information') }}</p>

          <div class="row q-pb-md items-center justify-between">
            <div class="row items-center">
              <p class="text-body1 q-mb-none q-ml-sm">{{ $t('i_am_a') }}</p>
              <q-checkbox
                v-model="currentUser.type"
                val="visitor"
                :label="$t('visitor')"
                disable
              />
              <q-checkbox
                v-model="currentUser.type"
                val="worker"
                :label="$t('worker')"
              />
              <q-checkbox
                v-model="currentUser.type"
                val="farmer"
                :label="$t('farmer')"
                :disable="!!currentUser.farmSlug"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-px-lg">
          <!-- General Inputs -->
          <q-input
            class="q-pb-md"
            outlined
            v-model="currentUser.name"
            :label="$t('name')"
            :placeholder="$t('enter_your_name')"
          />
          <q-input
            class="q-pb-md"
            outlined
            v-model="currentUser.email"
            :label="$t('email')"
            readonly
          />
          <input-phone v-model="currentUser.phone" />

          <q-select
            v-model="currentUser.languages"
            outlined
            use-input
            use-chips
            multiple
            input-debounce="0"
            :options="languageFilterOptions"
            :label="$t('languages_you_speak')"
            @filter="(val, update) => filterFnLangs(val, update)"
            class="q-pb-md"
          />

          <q-input
            outlined
            class="q-pb-md"
            type="textarea"
            v-model="currentUser.description"
            :label="$t('about_me')"
            :placeholder="$t('tell_something_about_yourself')"
          />

          <template
            v-if="currentUser.type && currentUser.type.includes('worker')"
          >
            <q-input
              outlined
              class="q-pb-md"
              type="textarea"
              v-model="currentUser.workerExperience"
              :label="$t('your_experience')"
            />
            <q-select
              v-model="currentUser.specialties"
              outlined
              use-input
              use-chips
              multiple
              input-debounce="0"
              :options="specialtyFilterOptions"
              :label="$t('specialties')"
              @new-value="addNewSpecialty"
              @filter="(val, update) => filterFnSpecs(val, update)"
              class="q-pb-md"
            />

            <p class="q-mb-none q-pl-sm">{{ $t('schedule') }}:</p>
            <div>
              <q-checkbox
                v-model="currentUser.schedule"
                val="FULL_TIME"
                :label="$t('full_time')"
              />
              <q-checkbox
                v-model="currentUser.schedule"
                val="PART_TIME"
                :label="$t('part_time')"
              />
              <q-checkbox
                v-model="currentUser.schedule"
                val="SEASONAL"
                :label="$t('seasonal')"
              />
            </div>
          </template>
        </q-card-section>
        <q-card-actions align="right" class="q-px-lg q-pb-lg">
          <q-btn
            rounded
            :label="$t('save_profile')"
            type="submit"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-form>
</template>

<script setup>
definePageMeta({
  layout: 'limited',
});

import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
// User Data
const currentUser = ref({
  name: '',
  email: '',
  phone: '',
  profileImage: '',
  type: [],
  languages: [],
  description: '',
  workerExperience: '',
  specialties: [],
  schedule: [],
});
const route = useRoute();
const router = useRouter();
const locale = useLocale();
const localePath = useLocalePath();

const onUploaded = (event) => {
  const uploadedFilesDetails = JSON.parse(event.xhr.response).body
    .uploadedFiles;
  if (uploadedFilesDetails.length > 0) {
    const firstFileUrl = uploadedFilesDetails[0].url;
    currentUser.value.profileImage = firstFileUrl;

    $q.notify({
      type: 'positive',
      message: 'Profile picture uploaded successfully!',
    });
  } else {
    $q.notify({
      type: 'negative',
      message: 'No files were uploaded.',
    });
  }
};

// Handle profile image upload failure
const onUploadFailed = (error) => {
  console.error('Upload failed:', error);
  $q.notify({
    type: 'negative',
    message: 'File upload failed. Please try again.',
  });
};

// Fetch user data from the backend
const fetchUser = async () => {
  try {
    const { user } = await useFetchApi(
      `/api/${locale}/user/${route.params.userId}`,
    );
    currentUser.value = user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch user data.',
    });
  }
};

// Handle form submission
const submitForm = async () => {
  try {
    await useFetchApi(`/api/${locale}/user/${route.params.userId}`, {
      method: 'PUT',
      body: currentUser.value,
    });

    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully!',
    });

    router.push(localePath(`/user/${route.params.userId}`));
  } catch (error) {
    console.error('Error updating user profile:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile.',
    });
  }
};

// Reactive variables for dropdown options
const languageOptions = ref([]);
const specialtyOptions = ref([]);

// Individual filterOptions for each dropdown
const languageFilterOptions = ref([]);
const specialtyFilterOptions = ref([]);

const filterFnLangs = (val, update) => {
  update(() => {
    const searchQuery = val ? val.toString().toLowerCase() : '';

    if (searchQuery === '') {
      languageFilterOptions.value = languageOptions.value;
    } else {
      languageFilterOptions.value = languageOptions.value.filter((option) => {
        const optionLabel = option.label
          ? option.label.toString().toLowerCase()
          : '';
        return optionLabel.includes(searchQuery);
      });
    }
  });
};

const filterFnSpecs = (val, update) => {
  update(() => {
    const searchQuery = val ? val.toString().toLowerCase() : '';

    if (searchQuery === '') {
      specialtyFilterOptions.value = specialtyOptions.value;
    } else {
      specialtyFilterOptions.value = specialtyOptions.value.filter((option) => {
        const optionLabel = option.label
          ? option.label.toString().toLowerCase()
          : '';
        return optionLabel.includes(searchQuery);
      });
    }
  });
};

// Fetch available languages and specialties from the backend
const fetchOptions = async () => {
  try {
    const { data: languagesResponse } = await useFetch(
      `/api/${locale}/languages`,
    );
    const { data: specialtiesResponse } = await useFetch(
      `/api/${locale}/specialties`,
    );

    languageOptions.value =
      languagesResponse.value?.languages.map((lang) => ({
        label: lang.name,
        value: lang.id,
      })) || [];

    specialtyOptions.value =
      specialtiesResponse.value?.specialties.map((spec) => ({
        label: spec.name,
        value: spec.id,
      })) || [];

    // Initialize filterOptions with full options at the beginning
    languageFilterOptions.value = languageOptions.value;
    specialtyFilterOptions.value = specialtyOptions.value;
  } catch (error) {
    console.error('Error fetching dropdown options:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch dropdown options.',
    });
  }
};

// Add new specialty (create a new entry in the backend)
const addNewSpecialty = async (newSpecialty, done) => {
  try {
    const data = await $fetch(`/api/${locale}/specialties/new`, {
      method: 'POST',
      body: {
        name: newSpecialty,
      },
    });

    const newSavedSpecialty = data.body.specialty;
    if (newSavedSpecialty) {
      specialtyOptions.value.push({
        label: newSavedSpecialty.name,
        value: newSavedSpecialty.id,
      });
      done(
        {
          label: newSavedSpecialty.name,
          value: newSavedSpecialty.id,
        },
        'add',
      );
    }
  } catch (error) {
    console.error('Error creating a new specialty:', error);
  }
};

// Lifecycle Hook

await fetchOptions();
await fetchUser();
</script>

<style lang="scss" scoped>
// Hiding .q-uploader__subtitle
:deep(.q-uploader__subtitle) {
  display: none;
}

// Hiding .q-uploader__list.scroll
:deep(.q-uploader__list.scroll) {
  display: none;
}

:deep(.q-uploader__header) {
  border-radius: 100px;
}

:deep(.q-uploader__title) {
  padding-left: 10px;
}

:deep(.q-uploader) {
  box-shadow: none;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 16px;
}
@media screen and (max-width: 1150px) {
  .content-container {
    flex-direction: column;
    align-items: center; /* Centers children vertically if they wrap */
  }
  .q-scrollarea .q-form {
    height: 100%;
  }
}
</style>
