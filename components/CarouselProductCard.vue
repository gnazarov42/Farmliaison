<template>
  <q-card class="rounded-card bg-light-sand">
    <Carousel
      :media-files="item?.mediaFiles"
      :ratio="1 / 1"
      class="rounded-card"
    />
    <q-card-section>
      <div class="items-end">
        <!-- Text column on the left -->
        <div class="row no-wrap justify-between items-start">
          <div class="text-body1">{{ item.name }}</div>
          <q-badge
            rounded
            color="pistachio"
            v-if="item.price"
            class="text-dark-primary text-body2 q-my-xs"
          >
            {{ `${item.price} ${item.currency}` }}
          </q-badge>
        </div>
        <div
          v-if="truncatedDescription"
          class="q-ma-none q-mb-sm text-dark-olive"
          v-html="truncatedDescription"
        />
        <div class="row justify-between">
          <q-btn rounded outline color="primary" @click="openDialog"
            >More</q-btn
          >
          <q-btn
            v-if="editable"
            :to="
              localePath(`/farm/${route.params.farmSlug}/product/${item.id}`)
            "
            rounded
            outline
            color="negative"
            >Edit</q-btn
          >
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-dialog v-model="isDialogOpen">
    <q-card class="rounded-card bg-light-sand modal-card">
      <q-btn
        flat
        round
        color="primary"
        icon="close"
        class="close-btn"
        @click="isDialogOpen = false"
      />
      <q-card-section>
        <q-scroll-area
          class="modal-content"
          :class="$q.screen.gt.xs ? 'q-pa-lg' : 'q-pa-sm'"
        >
          <div class="row" style="gap: 1rem">
            <Carousel
              :media-files="item?.mediaFiles"
              :ratio="1 / 1"
              class="rounded-card col-grow"
              style="min-width: 220px"
            />
            <div
              class="column items-start col-grow"
              style="min-width: 50%; flex-basis: 0"
            >
              <h3 class="q-ma-none" style="word-break: break-word">
                {{ item.name }}
              </h3>
              <q-badge
                rounded
                color="pistachio"
                v-if="item.price"
                class="text-dark-primary text-subtitle1 q-my-xs"
              >
                {{ `${item.price} ${item.currency}` }}
              </q-badge>
            </div>
          </div>
          <div class="q-my-md text-dark-olive" v-html="renderredDecription" />
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
const localePath = useLocalePath();
const route = useRoute();
import markdownit from 'markdown-it';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const md = markdownit();

const renderredDecription = computed(() => {
  return props.item.description ? md.render(props.item.description) : '';
});

const truncatedDescription = computed(() => {
  const description = props.item.description ? props.item.description : '';
  return `${removeMarkdown(description).slice(0, 120)}...`;
});

const isDialogOpen = ref(false);

function openDialog() {
  isDialogOpen.value = true;
}
</script>

<style lang="scss" scoped>
/* Add CSS styles for the item card, customize as needed */
.q-card {
  width: 100%;
  :hover {
    :deep(.q-carousel__control) {
      display: flex;
    }
  }
  .item-name {
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

.modal-card {
  max-width: 696px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}

.modal-content {
  max-height: 60vh;
  height: 60vh;
}

.modal-description {
  padding: 16px;
}
</style>
