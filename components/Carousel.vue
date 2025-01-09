<template>
  <q-responsive :ratio="ratio" style="max-width: 100%">
    <NuxtImg
      v-if="mediaFiles.length === 1 && mediaFiles[0].url"
      class="carousel-img"
      :src="
        useImageOptim(
          mediaFiles[0].url,
          'q_auto,f_auto,c_auto,g_auto,ar_1:1,w_500',
        )
      "
      alt="Media File"
    />

    <q-carousel
      v-else
      v-model="slide"
      style="border-radius: 16px"
      animated
      swipeable
      arrows
      navigation
      infinite
    >
      <q-carousel-slide
        v-for="(mediaFile, index) in mediaFiles.slice(0, 4)"
        :key="mediaFile.id"
        :name="index"
        class="scroll overflow-hidden q-pa-none bg-accent"
        draggable="false"
      >
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
      </q-carousel-slide>
    </q-carousel>
  </q-responsive>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  mediaFiles: {
    type: Array,
    required: true,
  },
  ratio: {
    type: Number,
    default: 1,
  },
});

const slide = ref(0);
</script>
