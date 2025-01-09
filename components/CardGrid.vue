<template>
  <div :class="['container', { 'container-wide': wide }]">
    <template v-if="loading">
      <slot name="skeleton" v-for="i in skeletonCount" :key="i" />
    </template>
    <template v-else>
      <slot v-for="(card, index) in displayedCards" :card="card" :key="index" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  cards: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  skeletonCount: {
    type: Number,
    default: 30,
  },
  wide: {
    type: Boolean,
    default: false,
  },
  short: {
    type: Boolean,
    default: false,
  },
});

const containerWidth = ref(window.innerWidth);
const columns = ref(1);

const updateColumns = () => {
  const width = containerWidth.value;
  if (width >= 1880) columns.value = props.wide ? 4 : 6;
  else if (width >= 1640) columns.value = props.wide ? 3 : 5;
  else if (width >= 1128) columns.value = props.wide ? 3 : 4;
  else if (width >= 950) columns.value = props.wide ? 2 : 3;
  else if (width >= 600) columns.value = props.wide ? 2 : 2;
  else columns.value = 1;
};

const displayedCards = computed(() => {
  if (props.short) {
    const maxCards = columns.value * 2;
    return props.cards.slice(0, maxCards);
  }
  return props.cards;
});

onMounted(() => {
  window.addEventListener('resize', () => {
    containerWidth.value = window.innerWidth;
    updateColumns();
  });
  updateColumns();
});
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-auto-flow: row dense;
  gap: 1.5rem;
  max-width: 2520px;
  margin: auto;
  @media screen and (max-width: 599px) {
    padding: 1.5rem;
  }
  @media (min-width: 374px) {
    --breakpoint-grid_columns: 1;
  }

  @media (min-width: 600px) {
    --breakpoint-grid_columns: 2;
  }

  @media (min-width: 950px) {
    --breakpoint-grid_columns: 3;
  }

  @media (min-width: 1128px) {
    --breakpoint-grid_columns: 4;
  }

  @media (min-width: 1640px) {
    --breakpoint-grid_columns: 5;
  }

  @media (min-width: 1880px) {
    --breakpoint-grid_columns: 6;
  }

  grid-template-columns: repeat(var(--breakpoint-grid_columns), minmax(0, 1fr));
}

.container-wide {
  @media (min-width: 374px) {
    --breakpoint-grid_columns: 1;
  }

  @media (min-width: 600px) {
    --breakpoint-grid_columns: 2;
  }

  @media (min-width: 950px) {
    --breakpoint-grid_columns: 2;
  }

  @media (min-width: 1128px) {
    --breakpoint-grid_columns: 3;
  }

  @media (min-width: 1640px) {
    --breakpoint-grid_columns: 3;
  }

  @media (min-width: 1880px) {
    --breakpoint-grid_columns: 4;
  }

  grid-template-columns: repeat(var(--breakpoint-grid_columns), minmax(0, 1fr));
}

.container > *:nth-child(odd) {
  animation: appear ease-in;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}

.container > *:nth-child(even) {
  animation: appear linear 5s;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}

@keyframes appear {
  from {
    transform: translateY(50px);
  }
  to {
    transform: translateY(0);
  }
}
</style>
