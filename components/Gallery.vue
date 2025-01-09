<template>
  <div class="gallery" v-if="$q.screen.gt.xs">
    <div
      v-for="(mediaFile, index) in mediaFilesForDisplay.slice(0, 7)"
      :key="index"
      :class="{ big: index === 0, tall: index === 3, wide: index === 5 }"
      class="cursor-pointer"
      @click="dialog = true"
    >
      <template v-if="!loading && mediaFile">
        <NuxtImg
          class="img"
          v-if="mediaFile.url"
          :src="useImageOptim(mediaFile.url)"
          alt="Media File"
        />
      </template>
      <template v-else>
        <q-skeleton type="image" class="img" />
      </template>
    </div>
  </div>
  <q-scroll-area v-else class="q-mb-xl" style="height: 350px; width: 100%">
    <div class="row no-wrap">
      <div
        v-for="(mediaFile, index) in mediaFilesForDisplay"
        :key="index"
        style="display: inline-block"
        class="q-mx-sm cursor-pointer"
        @click="dialog = true"
      >
        <template v-if="!loading && mediaFile">
          <NuxtImg
            v-if="mediaFile.url"
            :src="
              useImageOptim(
                mediaFile.url,
                'q_auto,f_auto,c_auto,g_auto,ar_1:1,w_350',
              )
            "
            width="330px"
            height="330px"
            fit="cover"
            alt="Media File"
            style="border-radius: 16px"
            draggable="false"
          />
        </template>
        <template v-else>
          <q-skeleton
            type="image"
            width="330px"
            height="330px"
            style="border-radius: 16px"
          />
        </template>
      </div>
    </div>
  </q-scroll-area>

  <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-actions align="right">
        <q-btn
          flat
          round
          class="bg-accent q-mt-sm q-mr-sm"
          icon="close"
          v-close-popup
        />
      </q-card-actions>

      <q-card-section style="max-height: 95vh" class="FullScreenGallery scroll">
        <div
          class="item q-ma-xs"
          v-for="(mediaFile, index) in mediaFilesForDisplay"
          :key="index"
        >
          <template v-if="!loading && mediaFile">
            <NuxtImg
              v-if="mediaFile.url"
              :src="useImageOptim(mediaFile.url)"
              alt="Media File"
              draggable="false"
            />
          </template>
          <template v-else>
            <q-skeleton type="image" class="img" />
          </template>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  mediaFiles: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const dialog = ref(false);
const maximizedToggle = ref(true);

const mediaFilesForDisplay = computed(() => {
  if (props.loading) {
    return new Array(7).fill(null);
  }
  return props.mediaFiles;
});
</script>

<style lang="scss" scoped>
.gallery {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 180px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(180px, 150px);
  }
}

.img {
  width: 100%;
  height: 100%;
  transition: filter 0.3s ease;
  border-radius: 16px;
  object-fit: cover;
}

.img:hover {
  filter: brightness(0.9);
}
.big {
  grid-column: span 2 / auto;
  grid-row: span 2 / auto;
}

.tall {
  grid-column: span 1;
  grid-row: span 2;
}

.wide {
  grid-column: span 2;
  grid-row: span 1;
}

@media (max-width: 1000px) {
  .gallery > div:nth-child(4),
  .gallery > div:nth-child(6) {
    display: none;
  }
}
.FullScreenGallery {
  display: flex;
  flex-wrap: wrap;
}
.item {
  flex: 1 1 auto;
  height: 40vh;
}
.item img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}
</style>
