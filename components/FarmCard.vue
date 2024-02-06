<!-- components/FarmCard.vue -->
<template>
  <q-card class="my-card" flat bordered>
    <!-- Farm Image (You can use the first picture here) -->
    <!-- <q-img v-if="farm.pictures.length > 0" :src="farm.pictures[0]" /> -->
    <CldImage
      src="cld-sample-5"
      width="987"
      height="987"
      alt="My Awesome Image"
    />

    <q-card-section>
      <q-btn
        fab
        color="primary"
        icon="place"
        class="absolute"
        style="top: 0; right: 12px; transform: translateY(-50%)"
      />

      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">
          {{ farm.name }}
        </div>
        <div
          class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
        >
          <q-icon name="place" />
          250 ft
        </div>
      </div>

      <q-rating
        v-model="localStars"
        :max="5"
        size="32px"
        @input="updateStars"
      />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-subtitle1">$・Italian, Cafe</div>
      <div class="text-caption text-grey">
        {{ farm.description }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn flat round icon="event" />
      <q-btn flat color="primary" :to="`/farm/${farm.farmSlug}`">
        View Details
      </q-btn>
      <q-btn flat round icon="favorite" />
      <q-btn flat round icon="bookmark" />
      <q-btn flat round icon="share" />
      <q-btn flat color="primary"> Reserve </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

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

const emits = defineEmits(['update:stars']);

const localStars = ref(props.stars);

const updateStars = () => {
  emits('update:stars', localStars.value);
};
</script>

<style scoped>
/* Add CSS styles for the farm card, customize as needed */
.my-card {
  /* Add your styles here */
  max-width: 350px;
}
</style>
