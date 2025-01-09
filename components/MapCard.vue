<template>
  <q-card flat>
    <!-- Image (You can use the first picture here) -->
    <nuxt-link target="_blank" :to="locationLink">
      <NuxtImg
        v-if="location.mediaFiles && location.mediaFiles[0]?.url"
        class="carousel-img"
        :src="
          useImageOptim(
            location.mediaFiles[0].url,
            'q_auto,f_auto,c_auto,g_auto,ar_1:1,w_500',
          )
        "
        alt="Media File"
      />
    </nuxt-link>
    <LikeButton
      size="0.585rem"
      class="absolute-top-right q-mr-sm q-mt-sm"
      :farmId="locationType === 'Farm' ? location.id : null"
      :eventId="locationType === 'Event' ? location.id : null"
      :liked="liked"
    />
    <q-card-section class="q-px-sm q-pt-none q-pb-sm">
      <div class="row no-wrap text-caption text-black-olive">
        <!-- Type of location -->
        <div>{{ locationType }} |</div>
        <!-- Star icon and rating number on the right -->
        <q-icon name="star" class="q-mx-xs" size="16px" />
        <span>4.5{{ location.stars }}</span>
        <span class="q-mx-xs"> · 29 {{ $t('reviews_0') }}</span>
      </div>
      <div class="text-subtitle2 text-dark-green location-name">
        {{ location.name || location.title }}
      </div>
      <div class="row no-wrap justify-between items-center">
        <div
          v-if="location.distance"
          class="text-body2 q-ma-none text-black-olive"
        >
          {{ (location.distance / 1000).toFixed(0) }}
          {{ $t('kilometres_away') }}
        </div>
        <q-btn
          :href="`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${location.latitude},${location.longitude}&travelmode=driving`"
          target="_blank"
          rounded
          size="sm"
          color="primary"
        >
          <q-icon size="14px" class="q-mr-xs" name="directions" />
          {{ $t('directions') }}
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';
const localePath = useLocalePath();

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
  userLocation: {
    type: Object,
    required: true,
  },
});

// Boolean to control the visibility of the like button
const showLikeButton = ref(true);

// Boolean to track whether the like button is pressed
const liked = ref(false);

// Function to toggle the like button
const toggleLike = () => {
  // Toggle the like state
  liked.value = !liked.value;
};

// Computed property to determine the icon of the like button
const likeButtonIcon = computed(() =>
  liked.value ? 'favorite' : 'favorite_border',
);

// Determine the link based on location type
const locationLink = computed(() => {
  if (props.location.farmSlug) {
    return localePath(`/farm/${props.location.farmSlug}`);
  } else {
    return localePath(`/event/${props.location.id}`);
  }
});

// Determine the type of location (Farm or Event)
const locationType = computed(() => {
  return props.location.farmSlug ? 'Farm' : 'Event';
});
</script>

<style lang="scss" scoped>
.q-card {
  background-color: $light-sand;
  width: 272px;
}
.location-name {
  min-height: 40px;
}
.carousel-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  aspect-ratio: 274/160;
}
</style>
