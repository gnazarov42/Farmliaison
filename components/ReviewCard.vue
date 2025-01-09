<template>
  <q-card class="rounded-card bg-light-sand review-card">
    <q-card-section class="row no-wrap items-center">
      <q-avatar size="56px" class="q-mr-sm">
        <img
          :src="review.author?.profileImage"
          alt="{{ review.author?.name }}"
        />
      </q-avatar>
      <div>
        <div class="text-weight-medium">{{ review.author?.name }}</div>
        <q-rating readonly v-model="review.rating" color="amber" size="18px" />
      </div>
    </q-card-section>

    <q-card-section>
      <q-banner dense>
        <div class="q-mb-xs">{{ truncatedReviewText }}</div>
      </q-banner>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat :label="$t('read_more')" color="primary" @click="openModal" />
    </q-card-actions>
  </q-card>

  <!-- Modal for Full Review and Response -->
  <q-dialog v-model="isModalOpen">
    <q-card class="rounded-card bg-light-sand modal-card">
      <q-btn
        flat
        round
        color="primary"
        icon="close"
        class="close-btn"
        @click="isModalOpen = false"
      />
      <q-card-section>
        <q-scroll-area
          class="modal-content"
          :class="$q.screen.gt.xs ? 'q-pa-lg' : 'q-pa-sm'"
        >
          <div class="row" style="gap: 1rem">
            <q-avatar size="40px" class="q-mr-sm">
              <img
                :src="review.author?.profileImage"
                :alt="review.author?.name"
              />
            </q-avatar>
            <div class="column items-start col-grow">
              <h3 class="q-ma-none" style="word-break: break-word">
                {{ review.author?.name }}
              </h3>
              <q-rating
                readonly
                v-model="review.rating"
                color="amber"
                size="24px"
              />
            </div>
          </div>
          <div class="q-my-md text-dark-olive">
            {{ review.content }}
          </div>
        </q-scroll-area>
      </q-card-section>

      <!-- Response Section -->
      <q-card-section v-if="review.response || canRespond">
        <div v-if="!canRespond">
          <!-- Show response for non-logged users -->
          <div class="text-dark-olive">
            <p>{{ review.response }}</p>
          </div>
        </div>
        <q-input
          v-if="canRespond"
          outlined
          v-model="responseText"
          :label="$t('response')"
          type="textarea"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('close')" color="primary" @click="closeModal" />
        <q-btn
          v-if="canRespond"
          flat
          :label="$t('save_response')"
          color="primary"
          @click="submitResponse"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar';

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
  ownerId: {
    type: String,
    required: false, // Owner of the entity being reviewed
  },
});

const isModalOpen = ref(false);
const loading = ref(false);
const responseText = ref('');
const { data: authData } = useAuth();
const $q = useQuasar();
const locale = useLocale();

const truncatedReviewText = computed(() => {
  const maxLength = 100; // Adjust this to change truncation length
  if (props.review.content?.length > maxLength) {
    return props.review.content?.slice(0, maxLength) + '...';
  }
  return props.review.content;
});

const canRespond = computed(() => {
  return (
    authData.value?.user?.id === props.ownerId &&
    authData.value?.user?.id !== props.review.authorId
  );
});

const openModal = () => {
  isModalOpen.value = true;
  responseText.value = props.review.response || ''; // Load existing response if available
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitResponse = async () => {
  loading.value = true;
  try {
    const response = await $fetch(
      `/api/${locale}/review/${props.review.id}/response`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          reviewId: props.review.id,
          response: responseText.value,
        },
      },
    );

    $q.notify({
      color: 'green',
      textColor: 'white',
      message: 'Response saved successfully!',
      icon: 'check_circle',
    });
    closeModal();
  } catch (error) {
    $q.notify({
      color: 'red',
      textColor: 'white',
      message: 'Failed to save response.',
      icon: 'error',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.review-card {
  max-width: 400px;
  margin: 10px;
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
</style>
