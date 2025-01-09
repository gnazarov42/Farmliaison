<template>
  <div>
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
            <q-icon name="star" class="text-primary" style="height: 24px" />
            {{ currentFarm?.stars }}
          </template>
        </div>
        <div class="q-mr-sm text-subtitle2">
          <q-skeleton v-if="pending" type="text" width="20%"></q-skeleton>
          <template v-else
            >{{ currentFarm?.reviews }} {{ $t('reviews') }}</template
          >
        </div>

        <q-separator vertical class="q-mr-sm" />
        <div class="q-mr-sm text-subtitle2">
          <q-skeleton v-if="pending" type="text" width="30%"></q-skeleton>
          <template v-else>{{ currentFarm?.name }}</template>
        </div>
      </div>
      <div class="top-buttons q-pb-lg">
        <ClientOnly>
          <nuxt-link
            v-if="isAuthor"
            :to="localePath(`/farm/${route.params.farmSlug}/edit`)"
          >
            <q-btn flat rounded no-caps class="bg-pistachio">
              <q-icon left name="edit" />
              <div class="btn-txt">{{ $t('edit_farm') }}</div>
            </q-btn>
          </nuxt-link>
        </ClientOnly>
        <ClientOnly>
          <LazyWriteReviewButton
            reviewType="farm"
            :entityId="currentFarm?.id"
          />
          <LikeButton wide :farmId="currentFarm?.id" />
        </ClientOnly>
        <q-btn flat rounded no-caps>
          <q-icon left name="upload" />
          <div class="btn-txt">{{ $t('share') }}</div>
        </q-btn>
      </div>
    </div>

    <Gallery :mediaFiles="currentFarm?.mediaFiles" :loading="pending" />

    <!-- description -->
    <div class="grid q-pt-xl">
      <div>
        <div>
          <q-skeleton
            v-if="pending"
            type="text"
            width="100%"
            lines="3"
          ></q-skeleton>
          <template v-else>
            <div v-html="renderredDecription" class="markdown"></div>
          </template>
        </div>

        <!-- Render other currentFarm details as needed -->
        <q-separator />
        <div v-if="currentFarm?.activities?.length">
          <h2>{{ $t('activities') }}</h2>
          <q-list class="row q-gutter-md q-mb-lg">
            <q-item
              v-for="activity in currentFarm?.activities"
              :key="activity.id"
              class="items-center q-pa-none"
            >
              <q-icon name="spa" class="q-mr-sm" size="16px" />
              <div class="text-body1">{{ activity.name }}</div>
            </q-item>
          </q-list>
        </div>
      </div>
      <div>
        <q-card
          class="rounded-card bg-light-sand q-mb-lg"
          style="max-width: 368px"
        >
          <q-card-section>
            <div class="row justify-start items-center q-pb-md">
              <div class="q-pr-md">
                <q-avatar v-if="!pending" size="120px">
                  <img
                    :src="
                      useImageOptim(
                        currentFarm?.user?.profileImage
                          ? currentFarm?.user?.profileImage
                          : currentFarm?.user?.image,
                        'q_auto,f_auto,c_auto,g_auto,ar_1:1,w_160',
                      )
                    "
                  />
                </q-avatar>
                <q-skeleton v-else type="QAvatar" size="120px"></q-skeleton>
              </div>
              <div class="column">
                <div class="row flex-center justify-between">
                  <h4 class="text-black">
                    <q-skeleton
                      v-if="pending"
                      type="text"
                      width="70%"
                    ></q-skeleton>
                    <template v-else> {{ currentFarm?.user?.name }}</template>
                  </h4>
                </div>
              </div>
            </div>
            <q-separator class="bg-dark-olive" />
            <div class="row justify-between q-py-md">
              <div class="column">
                <q-list>
                  <q-item
                    v-if="currentFarm?.address"
                    :clickable="currentFarm?.location ? true : false"
                    :href="currentFarm?.location ? currentFarm?.location : null"
                    target="_blank"
                  >
                    <q-item-section side>
                      <q-icon name="mdi-map-marker" color="dark-green" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{
                        $t('address_currentfarm_address')
                      }}</q-item-label>
                      <q-item-label caption>{{
                        currentFarm?.address
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="currentFarm?.phone"
                    clickable
                    :href="`tel:${currentFarm?.phone}`"
                    target="_blank"
                  >
                    <q-item-section side>
                      <q-icon name="mdi-phone" color="dark-green" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ currentFarm?.phone }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="currentFarm?.email"
                    clickable
                    :href="`mailto:${currentFarm?.email}?subject=Message from FarmLiaison Visitor&body=${contactForm.message}`"
                    target="_blank"
                  >
                    <q-item-section side>
                      <q-icon name="mdi-email" color="dark-green" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ currentFarm?.email }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="currentFarm?.web"
                    clickable
                    :href="currentFarm?.web"
                    target="_blank"
                  >
                    <q-item-section side>
                      <q-icon name="mdi-web" color="dark-green" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ domain }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div>
                <QRCode
                  :data="
                    localePath(
                      `${runtimeConfig.public.appDomain}/farm/${currentFarm?.farmSlug}`,
                    )
                  "
                  :size="120"
                  :bg="`${'#efeee6'}`"
                />
              </div>
            </div>
            <q-separator class="bg-dark-olive" />
            <h3 class="text-black-olive">{{ $t('contact_the_farmer') }}</h3>
            <div class="column q-gutter-sm">
              <q-input
                v-model="contactForm.message"
                :label="$t('message')"
                required
                outlined
                :disable="isLoading"
                type="textarea"
              />
              <q-input
                v-model="contactForm.name"
                :label="$t('name')"
                required
                outlined
                :disable="isLoading"
              />
              <q-input
                v-model="contactForm.phone"
                :label="$t('phone_number')"
                required
                outlined
                :disable="isLoading"
              />
              <q-input
                v-model="contactForm.email"
                :label="$t('email')"
                required
                outlined
                disable
              />
            </div>
          </q-card-section>

          <q-card-actions vertical class="q-px-none q-mb-md">
            <q-btn
              rounded
              no-caps
              color="primary"
              :loading="isLoading"
              class="q-mx-md q-mb-sm"
              @click="handleSubmit"
            >
              {{ $t('send_the_message') }}
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <template v-if="currentFarm?.products?.length">
      <h2>{{ $t('products') }}</h2>
      <div class="product-grid q-mb-md">
        <div v-for="product in currentFarm?.products" :key="product.id">
          <CarouselProductCard :item="product" :editable="isAuthor" />
        </div>
      </div>
    </template>

    <!-- Reviews Section -->
    <template v-if="reviews && reviews?.body.length">
      <h2>{{ $t('reviews') }}</h2>
      <div class="review-grid q-mb-md">
        <div v-for="review in reviews?.body" :key="review.id">
          <ReviewCard :review="review" :ownerId="currentFarm?.userId" />
        </div>
      </div>
    </template>

    <template v-if="currentFarm?.jobs?.length">
      <h2>{{ $t('jobs') }}</h2>
      <ul>
        <li v-for="job in currentFarm?.jobs" :key="job.id">
          <NuxtLink :to="localePath(`/job/${job.id}`)">
            {{ job.title }}
          </NuxtLink>
          <br />
          {{ job.description }}
        </li>
      </ul>
    </template>

    <!-- Render other user details as needed -->

    <FarmMap
      v-if="currentFarm?.latitude"
      class="q-pb-md"
      :latitude="currentFarm?.latitude"
      :longitude="currentFarm?.longitude"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'limited',
});

const localePath = useLocalePath();
const { openModal } = useLoginModal();

import { useRoute } from 'vue-router';
import markdownit from 'markdown-it';
import { ref, computed } from 'vue';
const $q = useQuasar();

const md = markdownit();
const { t } = useI18n();
const { data } = useAuth();
const route = useRoute();
const locale = useLocale();

const isLoading = ref(false);

const runtimeConfig = useRuntimeConfig();

const { data: currentFarm, pending } = await useFetch(
  `/api/${locale}/farm/${route.params.farmSlug}`,
  {
    lazy: true,
  },
);

// Fetch reviews for the farm
const { data: reviews } = await useFetch(
  `/api/${locale}/review?entityId=${currentFarm.value?.id}&entityType=farm`,
  {
    lazy: true,
  },
);

const renderredDecription = computed(() => {
  return currentFarm.value?.description
    ? md.render(currentFarm.value?.description)
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
// TODO: title doesn't work!
const title = computed(() =>
  currentFarm.value?.name
    ? `${currentFarm.value?.name} - FarmLiaison`
    : t('explore_authentic_farms_worldw'),
);
const description = computed(() =>
  currentFarm.value?.metaDescription
    ? currentFarm.value?.metaDescription
    : t('join_farmliaison_to_discover_g'),
);
const ogImg = computed(() =>
  currentFarm.value?.mediaFiles?.length
    ? transformUrl(currentFarm.value?.mediaFiles[0]?.url)
    : '/img/og.png',
);

// TODO: handle the form
const contactForm = ref({
  message: '',
  name: '',
  phone: '',
  email: '',
});

contactForm.value.message = t(
  'hello_farmer_name_i_am_interested_in_your_farm_tha',
  [currentFarm.value?.user?.name],
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

const domain = computed(() => {
  const regex = /https?:\/\/([^/?#]+)/;
  const match = currentFarm.value?.web?.match(regex);
  return match ? match[1] : '';
});

const isAuthor = computed(() => {
  if (data.value) {
    return (
      data.value.user?.role.includes('admin') ||
      data.value.user?.id === currentFarm.value?.user?.id
    );
  }
  return false;
});

const handleSubmit = async () => {
  if (!data.value || !data.value.user) {
    // Open the login modal if the user is not authenticated
    return openModal();
  }

  isLoading.value = true;
  try {
    await $fetch(`/api/${locale}/contact-farmer`, {
      method: 'POST',
      body: {
        farmerId: currentFarm.value.userId,
        message: contactForm.value.message,
        name: contactForm.value.name,
        phone: contactForm.value.phone,
      },
    });
    $q.notify({ type: 'positive', message: t('message_sent_successfully') });
  } catch (error) {
    console.log('🚀 ~ handleSubmit ~ error:', error);
    $q.notify({ type: 'negative', message: t('failed_to_send_message') });
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => data.value,
  (newValue) => {
    if (newValue) {
      contactForm.value.name = newValue.user?.name;
      contactForm.value.phone = newValue.user?.phone;
      contactForm.value.email = newValue.user?.email;
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr minmax(320px, max-content);
  gap: 1rem;
  @media screen and (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(264px, 1fr));
  gap: 1rem;
  width: 100%;
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
