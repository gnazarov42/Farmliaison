<template>
  <div>
    <div class="text-h2 q-pb-xs">
      <q-skeleton v-if="pending" type="text" width="50%"></q-skeleton>
      <template v-else>{{ currentEvent?.name }}</template>
    </div>

    <!-- top row -->
    <div class="row flex-center text-body2 justify-between">
      <div left class="row q-pb-lg">
        <div class="row q-mr-sm flex-center">
          <q-skeleton
            v-if="pending"
            type="icon"
            class="text-primary q-mb-xs"
          ></q-skeleton>
          <template v-else>
            <q-icon name="star" class="text-primary q-mb-xs" />
            {{ currentEvent?.stars }}
          </template>
        </div>
        <div class="q-mr-sm">
          <q-skeleton v-if="pending" type="text" width="20%"></q-skeleton>
          <template v-else
            >{{ currentEvent?.reviews }} {{ $t('reviews') }}</template
          >
        </div>

        <q-separator vertical class="q-mr-sm" />
        <div class="q-mr-sm">
          <q-skeleton v-if="pending" type="text" width="30%"></q-skeleton>
          <template v-else>{{ currentEvent?.user?.name }}</template>
        </div>
      </div>
      <div class="top-buttons q-pb-lg">
        <ClientOnly>
          <nuxt-link
            v-if="isAuthor"
            :to="localePath(`/event/${route.params.eventId}/edit`)"
          >
            <q-btn flat rounded no-caps class="bg-pistachio">
              <q-icon left name="edit" />
              <div class="btn-txt">Edit Event</div>
            </q-btn>
          </nuxt-link>
          <WriteReviewButton reviewType="event" :entityId="currentEvent?.id" />
          <LikeButton wide :eventId="currentEvent?.id" />
        </ClientOnly>
        <q-btn flat rounded no-caps>
          <q-icon left name="upload" />
          <div class="btn-txt">{{ $t('share') }}</div>
        </q-btn>
      </div>
    </div>

    <Gallery :mediaFiles="currentEvent?.mediaFiles" :loading="pending" />

    <!-- description -->
    <div class="grid q-mt-md">
      <div>
        <q-separator class="bg-olive" />
        <div class="q-my-xl">
          <q-skeleton
            v-if="pending"
            type="text"
            width="100%"
            lines="3"
          ></q-skeleton>
          <template v-else>
            <div v-html="renderredDecription"></div>
          </template>
        </div>

        <!-- Render other currentEvent details as needed -->
        <q-separator />
      </div>
      <div>
        <QRCode
          :data="
            localePath(
              `${runtimeConfig.public.appDomain}/event/${currentEvent?.eventId}`,
            )
          "
        />
      </div>
    </div>

    <h2>{{ $t('address') }}</h2>
    <p>
      <q-skeleton v-if="pending" type="text" width="50%"></q-skeleton>
      <template v-else>{{
        $t('address_currentfarm_address', [currentEvent?.address])
      }}</template>
    </p>
    <p v-if="currentEvent?.web">
      {{ $t('web_currentfarm_web') }}
      <a :href="currentEvent?.web" target="_blank">website</a>
    </p>
    <h2>{{ $t('user') }}</h2>
    <p>
      <q-skeleton v-if="pending" type="text" width="50%"></q-skeleton>
      <template v-else>{{
        $t('email_currentfarm_user_email', [currentEvent?.user?.email])
      }}</template>
    </p>
    <p>
      <q-skeleton v-if="pending" type="text" width="50%"></q-skeleton>
      <template v-else>{{
        $t('name_currentfarm_user_name', [currentEvent?.user?.name])
      }}</template>
    </p>
    <!-- Reviews Section -->
    <template v-if="reviews && reviews?.body.length">
      <h2>{{ $t('reviews') }}</h2>
      <div class="review-grid q-mb-md">
        <div v-for="review in reviews?.body" :key="review.id">
          <ReviewCard :review="review" :ownerId="currentEvent?.userId" />
        </div>
      </div>
    </template>
    <!-- Render other user details as needed -->
    <q-separator class="bg-olive" />
    <div v-if="currentEvent?.location" class="q-my-md">
      <nuxt-link :to="currentEvent?.location" target="_blank"
        >Location</nuxt-link
      >
    </div>
    <FarmMap
      v-if="currentEvent?.latitude"
      class="q-pb-md"
      :latitude="currentEvent?.latitude"
      :longitude="currentEvent?.longitude"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'limited',
});

import { useRoute } from 'vue-router';
import markdownit from 'markdown-it';
import { ref, computed } from 'vue';

const md = markdownit();
const { t } = useI18n();
const { data } = useAuth();
const route = useRoute();
const locale = useLocale();

const runtimeConfig = useRuntimeConfig();

const { data: currentEvent, pending } = await useFetch(
  `/api/${locale}/event/${route.params.eventId}`,
  {
    lazy: true,
  },
);

// Fetch reviews for the event
const { data: reviews } = await useFetch(
  `/api/${locale}/review?entityId=${route.params.eventId}&entityType=event`,
  {
    lazy: true,
  },
);

const renderredDecription = computed(() => {
  return currentEvent.value?.description
    ? md.render(currentEvent.value?.description)
    : '';
});

const transformUrl = (originalUrl) => {
  // Split the URL to insert the transformation parameters
  const parts = originalUrl.split('/upload/');
  const transformations = 'w_1200,h_627,c_fill,q_auto,f_auto';

  // Reassemble the URL with transformations
  return parts[0] + '/upload/' + transformations + '/' + parts[1];
};

// Dynamic SEO metadata
const title = computed(() =>
  currentEvent.value?.name
    ? `${currentEvent.value?.name} - FarmLiaison`
    : t('explore_authentic_farms_worldw'),
);
const description = computed(() =>
  currentEvent.value?.metaDescription
    ? currentEvent.value?.metaDescription
    : t('join_farmliaison_to_discover_g'),
);
const ogImg = computed(() =>
  currentEvent.value?.mediaFiles?.length
    ? transformUrl(currentEvent.value?.mediaFiles[0]?.url)
    : '/img/og.png',
);

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogImage: () => ogImg.value,
  twitterCard: () => 'summary_large_image',
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
  twitterImage: () => ogImg.value,
  ogLocale: () => locale.value,
});

const isAuthor = computed(() => {
  if (data.value) {
    return (
      data.value.user?.role.includes('admin') ||
      data.value.user?.id === currentEvent.value?.user?.id
    );
  }
  return false;
});
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr minmax(200px, 300px);
  gap: 1rem;
  @media screen and (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
  grid-template-rows: auto auto 1fr;
  gap: 1rem;
}
:deep(.top-buttons) {
  .q-btn {
    margin-left: 8px;
    .q-icon {
      margin-right: 8px;
      @media screen and (max-width: 599px) {
        margin-right: 0px;
      }
    }
    @media screen and (max-width: 599px) {
      .btn-txt {
        display: none;
      }
    }
  }
}
</style>
