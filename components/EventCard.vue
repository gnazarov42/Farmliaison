<template>
  <q-card class="my-card" flat>
    <!-- Event Image (You can use the first picture here) -->
    <q-responsive :ratio="1" style="max-width: 100%">
      <q-carousel
        v-model="slide"
        style="border-radius: 16px"
        animated
        swipeable
        arrows
        navigation
        infinite
      >
        <q-carousel-slide
          v-for="(mediaFile, index) in (event.mediaFiles || []).slice(0, 4)"
          :key="mediaFile.id"
          :name="index"
          class="scroll overflow-hidden q-pa-none bg-accent"
          draggable="false"
        >
          <nuxt-link target="_blank" :to="localePath(`/event/${event.id}`)">
            <NuxtImg
              v-if="mediaFile.url"
              class="carousel-img"
              :src="
                useImageOptim(
                  mediaFile.url,
                  'q_auto,f_auto,c_auto,g_auto,ar_1:1,w_500',
                )
              "
              alt="Media File"
            />
          </nuxt-link>
        </q-carousel-slide>
      </q-carousel>
    </q-responsive>
    <LikeButton
      v-if="showLikeButton"
      class="absolute-top-right q-mr-sm q-mt-sm"
      :eventId="event.id"
    />
    <q-card-section class="q-pl-none q-pr-none">
      <div class="row no-wrap">
        <!-- Text column on the left -->
        <div class="col">
          <nuxt-link
            target="_blank"
            :to="localePath(`/event/${event.id}`)"
            class="text-h4 text-soft-dark-green event-name"
          >
            {{ event.title }}
          </nuxt-link>
          <h6 v-if="event.distance" class="q-ma-none q-mb-sm text-dark-olive">
            {{ (event.distance / 1000).toFixed(0) }} kilometres away
          </h6>
          <h6 class="q-ma-none">Sep 12-15</h6>
        </div>
        <!-- Star icon and rating number on the right -->
        <div class="col-auto">
          <div class="row items-center">
            <q-icon name="star" class="text-primary" size="16px" />
            <span class="text-h5">{{ stars }}</span>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

const localePath = useLocalePath();

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  stars: {
    type: Number,
    required: false,
    default: 0,
  },
});

const slide = ref(0);

// Boolean to control the visibility of the like button
const showLikeButton = ref(true);

// Boolean to track whether the like button is pressed
// const liked = ref(false);

// Function to update the like state
// const updateLiked = (newValue) => {
//   liked.value = newValue;
// };
</script>

<style lang="scss" scoped>
.q-card {
  width: 100%;
  :hover {
    :deep(.q-carousel__control) {
      display: flex;
    }
  }
  .event-name {
    text-decoration: none;
  }
}

.carousel-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
:deep(.q-btn.q-carousel__navigation-icon) {
  font-size: 0.4rem !important;
}
:deep(.q-carousel__control) {
  overflow: hidden;
}
:deep(.q-carousel__control) {
  display: none;
}
</style>
