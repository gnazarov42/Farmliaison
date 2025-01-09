<template>
  <q-card class="my-card" flat>
    <!-- Farm Image (You can use the first picture here) -->
    <q-responsive :ratio="360 / 264" style="max-width: 100%">
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
          v-for="(mediaFile, index) in farm.mediaFiles.slice(0, 4)"
          :key="mediaFile.id"
          :name="index"
          class="scroll overflow-hidden q-pa-none bg-accent"
          draggable="false"
        >
          <nuxt-link target="_blank" :to="localePath(`/farm/${farm.farmSlug}`)">
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
    <LikeButton class="absolute-top-right q-mr-sm q-mt-sm" :farmId="farm.id" />
    <q-card-section class="q-pl-none q-pr-none">
      <div class="row no-wrap">
        <!-- Text column on the left -->
        <div class="col">
          <nuxt-link
            target="_blank"
            :to="localePath(`/farm/${farm.farmSlug}`)"
            class="text-h4 text-soft-dark-green farm-name"
          >
            {{ farm.name }}
          </nuxt-link>
          <h6 v-if="farm.distance" class="q-ma-none q-mb-sm text-dark-olive">
            {{ (farm.distance / 1000).toFixed(0) }} kilometres away
          </h6>
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
  farm: {
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
</script>

<style lang="scss" scoped>
/* Add CSS styles for the farm card, customize as needed */
.q-card {
  width: 100%;
  :hover {
    :deep(.q-carousel__control) {
      display: flex;
    }
  }
  .farm-name {
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
