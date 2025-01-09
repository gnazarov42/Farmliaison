<template>
  <q-page class="welcome-page q-pa-md">
    <q-stepper v-model="currentStepName" vertical color="primary" animated>
      <q-step
        v-for="stepName in stepNames"
        :key="stepName"
        :name="stepName"
        :title="stepTitles[stepName].title"
        :icon="stepTitles[stepName].icon"
        :done="stepNames.indexOf(currentStepName) > stepNames.indexOf(stepName)"
      >
        <template v-if="stepName === 'welcome'">
          <section class="welcome-message">
            <h1>Welcome to FarmLiaison!</h1>
            <p>
              Welcome to FarmLiaison, your gateway to authentic agritourism
              experiences...
            </p>
          </section>

          <section class="terms-conditions">
            <h2>Terms and Conditions</h2>
            <div class="terms-content q-mb-md">
              <q-scroll-area style="height: 300px">
                <div v-html="termsAndConditions"></div>
              </q-scroll-area>
            </div>
            <q-checkbox
              v-model="agreedTermsRef"
              @update:model-value="updateAgreed"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
            >
              I agree to the Terms and Conditions
            </q-checkbox>
            <p v-if="agreedDate">
              You agreed to the Terms and Conditions on: {{ agreedDate }}
            </p>
          </section>

          <q-stepper-navigation>
            <q-btn
              @click="moveToNextStep"
              color="primary"
              label="Continue"
              :disable="!currentUser.agreedTerms || loading"
              :loading="loading"
            />
          </q-stepper-navigation>
        </template>

        <!-- Profile Step -->
        <template v-if="stepName === 'profile'">
          <q-form @submit.prevent="saveProfile">
            <section class="profile-information">
              <h2>Complete Your Profile</h2>
              <div class="row justify-between q-pb-lg content-container">
                <!-- Profile Picture -->
                <div class="column items-center">
                  <q-avatar size="13rem">
                    <q-img
                      :src="
                        useImageOptim(
                          currentUser.profileImage
                            ? currentUser.profileImage
                            : currentUser.image,
                          'q_auto,f_auto,c_auto,g_auto,ar_1:1,w_214',
                        )
                      "
                      :ratio="1"
                    />
                  </q-avatar>
                  <q-uploader
                    url="/api/cloud/upload"
                    :label="$t('edit')"
                    style="max-width: 214px"
                    accept="image/*"
                    auto-upload
                    @uploaded="onUploaded"
                    @remove="onFileRemoved"
                    @failed="onUploadFailed"
                    color="pistachio"
                    text-color="dark"
                    class="q-pt-md"
                  />
                </div>
                <!-- Inputs -->
                <div style="width: 100%; max-width: 762px">
                  <h2 class="q-ma-none q-mb-md">{{ $t('your_profile') }}</h2>
                  <p class="text-body1">{{ $t('the_information') }}</p>

                  <!-- Name -->
                  <q-input
                    class="q-pb-md"
                    outlined
                    v-model="currentUser.name"
                    :label="$t('name')"
                    :placeholder="$t('enter_your_name')"
                  />
                  <!-- Email -->
                  <q-input
                    class="q-pb-md"
                    outlined
                    v-model="currentUser.email"
                    :label="$t('email')"
                    readonly
                  />
                  <!-- Phone -->
                  <input-phone v-model="currentUser.phone" />

                  <!-- Type: Visitor, Farmer, Worker -->
                  <div>
                    <q-checkbox
                      v-model="currentUser.type"
                      val="visitor"
                      label="Visitor"
                      disable
                    />
                    <q-checkbox
                      v-model="currentUser.type"
                      val="worker"
                      label="Worker"
                    />
                    <q-checkbox
                      v-model="currentUser.type"
                      val="farmer"
                      label="Farmer"
                      :disable="!!currentUser.farmSlug"
                    />
                  </div>
                </div>
              </div>
            </section>

            <q-stepper-navigation>
              <q-btn
                flat
                @click="moveToPrevStep"
                color="primary"
                label="Back"
              />
              <q-btn
                type="submit"
                color="primary"
                :loading="loading"
                label="Save and Continue"
              />
            </q-stepper-navigation>
          </q-form>
        </template>

        <!-- Worker Step -->
        <template v-if="stepName === 'worker'">
          <section class="worker-intro">
            <h2>Information for Workers</h2>
            <p>
              Discover opportunities to work on farms and gain valuable
              experience.
            </p>
            <q-form @submit.prevent="workerFormSubmit">
              <q-input
                class="q-pb-sm"
                v-model="workerExperience"
                label="Your Experience"
              />
              <!-- Edit Specialties -->
              <q-select
                v-model="currentWorker.specialties"
                filled
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="filterOptions"
                label="Specialties"
                @new-value="addNewSpecialty"
                @filter="filterFn"
                class="q-pb-sm"
              />
              <p class="q-mb-none q-pl-sm">Schedule:</p>
              <div class="q-pb-xs">
                <q-checkbox
                  v-model="currentWorker.schedule"
                  val="full-time"
                  label="full-time"
                />
                <q-checkbox
                  v-model="currentWorker.schedule"
                  val="part-time"
                  label="part-time"
                />
                <q-checkbox
                  v-model="currentWorker.schedule"
                  val="seasonal"
                  label="seasonal"
                />
              </div>
              <q-btn type="submit" label="Submit" :loading="loading" />
            </q-form>
          </section>

          <q-stepper-navigation>
            <q-btn flat @click="moveToPrevStep" color="primary" label="Back" />
            <q-btn @click="moveToNextStep" color="primary" label="Next" />
          </q-stepper-navigation>
        </template>

        <!-- Farmer Step -->
        <template v-if="stepName === 'farmer'">
          <section class="farmer-intro">
            <h2>Information for Farmers</h2>
            <p v-if="currentUser.farmSlug">
              You already have a farm page.
              <q-btn
                :to="`/farm/${currentUser.farmSlug}`"
                label="View My Farm Page"
                color="primary"
              />
            </p>
            <p v-else>
              Learn how to easily create a page for your farm and start
              attracting visitors for free.
              <q-btn
                :to="'/farm/new-farm'"
                label="Create My Farm Page"
                color="primary"
              />
            </p>
          </section>

          <q-stepper-navigation>
            <q-btn flat @click="moveToPrevStep" color="primary" label="Back" />
            <q-btn @click="moveToNextStep" color="primary" label="Next" />
          </q-stepper-navigation>
        </template>

        <!-- Features Step -->
        <template v-if="stepName === 'features'">
          <section class="features-intro">
            <h2>Discover Our Features</h2>
            <ul>
              <li>Profile Creation for Farmers</li>
              <li>Multilingual Description Assistance</li>
              <li>Events and Activities</li>
              <li>Job Listings</li>
              <li>Review and Rating System</li>
              <li>Networking and Resource Sharing</li>
            </ul>
          </section>

          <q-stepper-navigation>
            <q-btn flat @click="moveToPrevStep" color="primary" label="Back" />
            <q-btn @click="startExploring" color="primary" label="Finish" />
          </q-stepper-navigation>
        </template>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';

definePageMeta({ middleware: 'auth' });

const agreedTermsRef = ref(false);

const $q = useQuasar();
const locale = ref(useLocale());

const { data, signOut, getSession } = useAuth(); // Adjust the import path as necessary
const localePath = useLocalePath();

const stepNames = ref(['welcome', 'profile', 'features']);
const currentStepName = ref(stepNames.value[0]);

const profileSaved = ref(false);
const termsAndConditions = ref('');
const currentUser = ref({
  name: '',
  email: data.value?.user?.email || '',
  phone: '',
  profileImage: '',
  type: ['visitor'],
});
const workerExperience = ref('');
const specialtyOptions = ref([
  'Gardener',
  'Plumber',
  'Groomer',
  'Vet',
  'Driver',
]);

const currentWorker = ref({
  schedule: ['full-time'],
  specialties: [],
});

const fetchSpecialties = async () => {
  try {
    const specialtiesData = await $fetch(`/api/${unref(locale)}/specialty`);
    specialtyOptions.value = specialtiesData.specialties.map((specialty) => ({
      label: specialty.name,
      value: specialty.id,
    }));
  } catch (error) {
    console.error('Failed to fetch specialties:', error);
  }
};

const filterOptions = ref([]);

const filterFn = (val, update) => {
  update(() => {
    const searchQuery = val ? val.toString().toLowerCase() : '';

    if (searchQuery === '') {
      filterOptions.value = specialtyOptions.value;
    } else {
      filterOptions.value = specialtyOptions.value.filter((option) => {
        const optionLabel = option.label
          ? option.label.toString().toLowerCase()
          : '';
        return optionLabel.includes(searchQuery);
      });
    }
  });
};

const addNewSpecialty = async (newSpecialty, done) => {
  try {
    const data = await $fetch(`/api/${unref(locale)}/specialty/new`, {
      method: 'POST',
      body: {
        name: newSpecialty,
      },
    });
    const newSavedSpecialty = data.body.specialty;
    if (newSavedSpecialty) {
      specialtyOptions.value.push({
        label: newSavedSpecialty.name[locale],
        value: newSavedSpecialty.id,
      });
      done(
        {
          label: newSavedSpecialty.name[locale],
          value: newSavedSpecialty.id,
        },
        'add',
      );
    } else {
      console.error('Failed to create and fetch the new specialty');
    }
  } catch (error) {
    console.error('Error creating and fetching the new specialty:', error);
  }
};

onMounted(async () => {
  await fetchSpecialties();
});

const farmName = ref('');
const farmLocation = ref('');
const loading = ref(false);

const stepTitles = {
  welcome: { title: 'Welcome and Agree to Terms', icon: 'settings' },
  profile: { title: 'Complete Your Profile', icon: 'person' },
  worker: { title: 'Information for Workers', icon: 'work' },
  farmer: { title: 'Information for Farmers', icon: 'spa' },
  features: { title: 'Discover Our Features', icon: 'star' },
};

const languageMap = {
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  it: 'Italian',
  tr: 'Turkish',
  ru: 'Russian',
};

const languageOptions = ref(
  Object.keys(languageMap).map((key) => ({
    label: languageMap[key],
    value: key,
  })),
);

onMounted(async () => {
  if (data.value?.user?.id) {
    const { user } = await useFetchApi(
      `/api/${unref(locale)}/user/${data.value.user.id}`,
    );
    currentUser.value = user;
    updateStepNames();
  }
  loadTermsAndConditions();
});

watch(locale, loadTermsAndConditions);

async function loadTermsAndConditions() {
  const lang = locale.value || 'en';
  const response = await fetch(`/terms-${lang}.html`);
  if (response.ok) {
    termsAndConditions.value = await response.text();
  } else {
    // Handle error, e.g., load a default language or show an error message
    const defaultResponse = await fetch(`/terms-en.html`);
    termsAndConditions.value = await defaultResponse.text();
  }
}

watch(
  () => currentUser.value.type,
  () => {
    updateStepNames();
  },
);

function updateStepNames() {
  stepNames.value = ['welcome', 'profile'];
  if (currentUser.value.type.includes('farmer')) {
    stepNames.value.push('farmer');
  }
  if (currentUser.value.type.includes('worker')) {
    stepNames.value.push('worker');
  }
  stepNames.value.push('features');
  if (!stepNames.value.includes(currentStepName.value)) {
    currentStepName.value = stepNames.value[1]; // move to 'profile' if current step is not in updated steps
  }
}

watch(
  () => currentUser.value.agreedTerms,
  (newValue) => {
    agreedTermsRef.value = !!newValue; // Ensure boolean for the checkbox
  },
);

async function updateAgreed(value) {
  loading.value = true;
  try {
    const newValue = value ? new Date().toISOString() : null;
    await updateTermsAgreedInDb(newValue);
    currentUser.value.agreedTerms = newValue;
    // Update session value
    await getSession();
    if (!newValue) {
      await signOutUser();
    }
  } catch (error) {
    console.error('Failed to update terms agreement:', error);
  } finally {
    loading.value = false;
  }
}

const agreedDate = computed(() => {
  return currentUser.value.agreedTerms
    ? new Date(currentUser.value.agreedTerms).toLocaleDateString()
    : null;
});

async function updateTermsAgreedInDb(value) {
  try {
    await useFetchApi(`/api/${unref(locale)}/user/${data.value.user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agreedTerms: value }),
    });
  } catch (error) {
    console.error('Failed to update terms agreement in database:', error);
    throw error;
  }
}

async function signOutUser() {
  try {
    await signOut();
  } catch (error) {
    console.error('Failed to sign out:', error);
  }
}

function onUploaded(event) {
  const uploadedFilesDetails = JSON.parse(event.xhr.response).body
    .uploadedFiles;
  if (uploadedFilesDetails.length > 0) {
    const firstFileUrl = uploadedFilesDetails[0].url;
    currentUser.value.profileImage = firstFileUrl;
    $q.notify({ type: 'positive', message: 'Files uploaded successfully' });
  } else {
    $q.notify({ type: 'negative', message: 'No files were uploaded.' });
  }
}

function onUploadFailed(error) {
  $q.notify({ type: 'negative', message: 'File upload failed' });
}

function onFileRemoved(file) {
  // Optional: Handle file removal, if necessary
}

const saveProfile = async () => {
  if (currentUser.value.agreedTerms) {
    loading.value = true;
    profileSaved.value = true;
    try {
      await useFetchApi(`/api/${unref(locale)}/user/${data.value.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.value.name,
          profileImage: currentUser.value.profileImage,
          phone: currentUser.value.phone,
          type: currentUser.value.type,
          // Add other properties as needed
        }),
      });
      await getSession();
      moveToNextStep();
    } catch (error) {
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'Failed to save profile.',
      });
    } finally {
      loading.value = false;
    }
  } else {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'You must agree to the terms and conditions.',
    });
  }
};

const moveToNextStep = () => {
  const currentIndex = stepNames.value.indexOf(currentStepName.value);
  if (currentIndex < stepNames.value.length - 1) {
    currentStepName.value = stepNames.value[currentIndex + 1];
  }
};

const moveToPrevStep = () => {
  const currentIndex = stepNames.value.indexOf(currentStepName.value);
  if (currentIndex > 0) {
    currentStepName.value = stepNames.value[currentIndex - 1];
  }
};

const workerFormSubmit = async () => {
  loading.value = true;
  try {
    // Perform the worker form submit action
    moveToNextStep();
  } catch (error) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Failed to submit worker form.',
    });
  } finally {
    loading.value = false;
  }
};

const farmerFormSubmit = async () => {
  loading.value = true;
  try {
    // Perform the farmer form submit action
    moveToNextStep();
  } catch (error) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Failed to submit farmer form.',
    });
  } finally {
    loading.value = false;
  }
};

const startExploring = () => {
  // Navigate to the main platform page
  navigateTo(localePath('/'));
};
</script>

<style scoped>
:deep(.q-uploader__subtitle) {
  display: none;
}
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
.terms-content {
  border: 1px solid #ccc;
  padding: 16px;
  background-color: #f9f9f9;
}
</style>
