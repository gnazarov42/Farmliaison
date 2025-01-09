<template>
  <!-- Profile Page -->
  <!-- User Info Section -->
  <div class="row q-pb-lg">
    <div class="column col-md-4 col-xs-12 q-px-md">
      <!-- Profile Card -->
      <q-card class="bg-light-sand q-mb-lg">
        <q-card-section horizontal>
          <q-card-section class="column items-center">
            <q-avatar size="5rem">
              <q-badge v-if="isAuthor" color="primary" floating>{{
                user.credits
              }}</q-badge>
              <q-img
                :src="
                  useImageOptim(
                    user?.profileImage || user?.image,
                    'q_auto,f_auto,c_auto,g_auto,ar_1:1,w_160',
                  )
                "
                :ratio="1"
              />
            </q-avatar>
          </q-card-section>
          <q-card-section class="column items-start">
            <div class="row items-center q-mt-md">
              <q-icon name="star" class="text-primary" size="16px" />
              <div class="text-caption">{{ stars }}</div>
            </div>
            <div class="text-caption q-mb-md">
              {{ $t('rated_by_other_users') }}
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>

    <!-- About Section -->
    <q-card flat class="col-md-8 col-xs-12 q-px-md">
      <div class="column">
        <div class="text-h2 q-mb-sm">
          {{ $t('about_user_name', [user.name]) }}
        </div>
        <ClientOnly>
          <q-card-actions v-if="isAuthor" class="q-pa-none q-mb-lg">
            <q-btn
              v-if="isAuthor"
              rounded
              color="pistachio"
              text-color="dark-green"
              icon="edit"
              class="q-pr-sm"
              :label="$t('edit_profile')"
              :to="`${route.params.userId}/edit`"
            />
          </q-card-actions>
        </ClientOnly>
        <div class="text-subtitle1 q-mb-md">
          {{ user.type.map((type) => $t(type)).join(', ') }}
        </div>
        <div class="text-subtitle2">
          {{ $t('speaks_user_languageslabel', [user.languagesLabel]) }}
        </div>

        <div class="text-body1">{{ user.description }}</div>
        <div v-if="user.workerExperience">
          <h3 class="q-mb-sm">{{ $t('worker_experience') }}</h3>
          <div class="text-subtitle1">{{ user.specialtiesLabel }}</div>
          <div class="text-body1">{{ user.workerExperience }}</div>
        </div>
      </div>
    </q-card>
  </div>
  <q-separator v-if="reviews.body?.length" />

  <!-- Reviews Section -->
  <div v-if="reviews.body?.length" class="q-pb-lg">
    <h2 class="text-h2 q-pb-md">
      {{ $t('what_others_say_about_user_name', [user.name]) }}
    </h2>
    <div class="review-grid q-mb-md">
      <div v-for="review in reviews.body" :key="review.id">
        <ReviewCard :review="review" :ownerId="user.id" />
      </div>
    </div>
  </div>
  <div class="row q-pb-lg items-center justify-center">
    <WriteReviewButton reviewType="user" :entityId="user.id" />
  </div>
  <q-separator v-if="user.farmSlug" />

  <!-- Events Section -->
  <div v-if="user.farmSlug">
    <h2 class="text-h2 q-pb-md">
      {{ $t('events_at_user_farmslug', [user.farmName]) }}
    </h2>
    <ClientOnly>
      <CardGrid
        :cards="events"
        :loading="loading"
        :skeletonCount="6"
        :wide="false"
      >
        <template #default="{ card }">
          <EventCard :event="card" class="block" />
        </template>
        <template #skeleton>
          <div>
            <q-skeleton
              width="100%"
              style="aspect-ratio: 1; border-radius: 16px"
              square
            />
            <q-skeleton width="100%" class="q-mt-md" square />
            <q-skeleton width="40%" class="q-mt-md" square />
          </div>
        </template>
      </CardGrid>
    </ClientOnly>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'limited',
});

const route = useRoute();
const locale = useLocale(); // Dynamically get current locale

// Reactive data
const user = ref({});
const events = ref([]);
const reviews = ref({}); // Store reviews
const stars = ref(4.6);
const loading = ref(false);

// Fetch user data
const fetchUser = async () => {
  try {
    const { data } = await useFetch(
      `/api/${locale}/user/${route.params.userId}`,
    );
    user.value = data.value?.user || {};
    // Generate labels for languages and specialties
    user.value.languagesLabel = user.value.languages
      ?.map((lang) => lang.label)
      .join(', ');
    user.value.specialtiesLabel = user.value.specialties
      ?.map((spec) => spec.label)
      .join(', ');
    // Only fetch events if the user has a farm
    if (user.value.farmSlug) {
      await fetchEvents(user.value.farmSlug);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

// Fetch reviews
const fetchReviews = async () => {
  try {
    const { data } = await useFetch(
      `/api/${locale}/review?entityId=${route.params.userId}&entityType=user`,
    );
    reviews.value = data.value || {};
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

// Fetch events for the user's farm
const fetchEvents = async (farmSlug) => {
  try {
    loading.value = true;
    const response = await $fetch(`/api/${locale}/event`, {
      query: { farmSlug },
    });
    events.value = response?.body?.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    loading.value = false;
  }
};

// Determine if the user is the profile's author
const isAuthor = computed(() => {
  const authData = useAuth()?.data?.value;
  return (
    authData?.user?.role?.includes('admin') ||
    authData?.user?.id === user.value.id
  );
});

// Fetch all necessary data
await Promise.all([fetchUser(), fetchReviews()]);
</script>

<style lang="scss" scoped>
.my-card {
  border-radius: 16px;
}
.review-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
.events-container {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-auto-rows: minmax(420px, auto);
}
</style>
