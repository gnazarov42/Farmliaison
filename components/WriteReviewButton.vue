<template>
  <q-btn flat rounded no-caps class="bg-pistachio" @click="handleClick">
    <q-icon left name="mdi-message-draw" />
    <div class="btn-txt">{{ $t('write_a_review') }}</div>
  </q-btn>

  <q-dialog v-model="isOpen">
    <q-card style="min-width: 300px">
      <q-card-section>
        <div class="text-h3">
          {{ $t('leave_a_review_for_reviewtype', [reviewType]) }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-rating v-model="review.rating" color="dark-lime" max="5" />
      </q-card-section>

      <q-card-section>
        <q-input
          outlined
          v-model="review.comment"
          label="Comment"
          type="textarea"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn rounded outline label="Cancel" color="primary" @click="cancel" />
        <q-btn
          rounded
          label="Submit"
          color="primary"
          :loading="loading"
          @click="submitReview"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar';

const props = defineProps({
  reviewType: {
    type: String,
    required: true,
    validator: (value) => ['farm', 'user', 'event'].includes(value),
  },
  entityId: {
    type: String,
    required: true,
  },
});

const locale = useLocale();
const isOpen = ref(false);
const loading = ref(false);
const review = ref({
  rating: 0,
  comment: '',
  pictures: [],
  reviewType: props.reviewType,
  entityId: props.entityId,
});

const { status } = useAuth();
const { openModal } = useLoginModal();
const $q = useQuasar();

const openModalLocal = () => {
  isOpen.value = true;
};

const cancel = () => {
  isOpen.value = false;
};

const submitReview = async () => {
  if (!review.value.rating) {
    $q.notify({
      color: 'red',
      textColor: 'white',
      message: 'Please provide a rating before submitting your review.',
      icon: 'warning',
    });
    return;
  }

  loading.value = true;

  const reviewData = {
    rating: review.value.rating,
    content: review.value.comment, // Sending content as plain text
    pictures: review.value.pictures,
  };

  // Adjust the request shape based on the reviewType
  if (review.value.reviewType === 'farm') {
    reviewData.reviewedFarmId = review.value.entityId;
  } else if (review.value.reviewType === 'user') {
    reviewData.reviewedUserId = review.value.entityId;
  } else if (review.value.reviewType === 'event') {
    reviewData.reviewedEventId = review.value.entityId;
  }

  try {
    const response = await $fetch(`/api/${locale}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: reviewData,
    });

    $q.notify({
      color: 'green',
      textColor: 'white',
      message: `Review for ${review.value.reviewType} submitted successfully!`,
      icon: 'check_circle',
    });

    // Clear the form
    review.value.rating = 0;
    review.value.comment = '';
    review.value.pictures = [];

    isOpen.value = false;
  } catch (error) {
    $q.notify({
      color: 'red',
      textColor: 'white',
      message: 'There was an error submitting your review.',
      icon: 'error',
    });
  } finally {
    loading.value = false;
  }
};

const handleFileAdded = (files) => {
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      review.value.pictures.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const handleFileRemoved = (file) => {
  review.value.pictures = review.value.pictures.filter(
    (picture) => picture !== file,
  );
};

const handleClick = () => {
  if (status.value !== 'authenticated') {
    openModal(); // Open login modal if not authenticated
  } else {
    openModalLocal(); // Open the review modal if authenticated
  }
};
</script>
