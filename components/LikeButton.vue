<template>
  <q-btn
    v-if="wide"
    :class="{
      'text-primary': isLiked,
      'border-primary': !isLiked,
    }"
    flat
    rounded
    no-caps
    @click="handleClick"
  >
    <q-icon left :name="likeButtonIcon" />
    <div class="btn-txt">{{ $t('save') }}</div>
  </q-btn>
  <q-btn
    v-else
    flat
    round
    size="0.8rem"
    :icon="likeButtonIcon"
    class="text-primary bg-pistachio"
    :class="{
      'text-primary': isLiked,
      'border-primary': !isLiked,
    }"
    @click="handleClick"
  />
</template>

<script setup>
const props = defineProps({
  farmId: {
    type: String,
    required: false,
  },
  eventId: {
    type: String,
    required: false,
  },
  wide: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:liked']);

const { status, data: authData } = useAuth();
const { openModal } = useLoginModal();
const { favorites, addFavorite, removeFavorite } = useFavorites();

const isLiked = ref(false);

const checkIfLiked = () => {
  if (Array.isArray(favorites.value)) {
    isLiked.value = favorites.value.some(
      (fav) =>
        (props.farmId && fav.farmId === props.farmId) ||
        (props.eventId && fav.eventId === props.eventId),
    );
  }
};

onMounted(() => {
  checkIfLiked();
});

watch(
  favorites,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      checkIfLiked();
    }
  },
  { deep: true },
);

const toggleLike = async () => {
  const originalState = isLiked.value;
  isLiked.value = !originalState;
  emit('update:liked', isLiked.value);

  try {
    if (originalState) {
      await removeFavorite(props.farmId, props.eventId);
    } else {
      await addFavorite(props.farmId, props.eventId);
    }
  } catch (error) {
    isLiked.value = originalState;
    emit('update:liked', isLiked.value);
    console.error('Failed to update favorite:', error);
  }
};

const handleClick = () => {
  if (status.value !== 'authenticated') {
    openModal();
  } else {
    toggleLike();
  }
};

const likeButtonIcon = computed(() =>
  isLiked.value ? 'favorite' : 'favorite_border',
);
</script>

<style scoped></style>
