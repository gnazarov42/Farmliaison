<script lang="ts" setup>
definePageMeta({
  meta: {
    title: 'My Custom Page Title',
    metaTags: [
      {
        name: 'description',
        content: 'This is a custom description for my page.',
      },
      {
        property: 'og:description',
        content: 'This is a custom Open Graph description for my page.',
      },
    ],
  },
});
</script>

<template>
  <div>{{ $t('surface-irrigation-automation') }}</div>
</template>

<style lang="scss" scoped></style>
