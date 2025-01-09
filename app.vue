<template>
  <div>
    <NuxtLoadingIndicator :height="2" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <LoginModal />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { locale } = useI18n();

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/img/favicon.png',
    },
  ],
});

const seoMeta = computed(() => ({
  title: `FarmLiaison - ${route.meta.title || 'Back to The Roots'}`,
  description:
    route.meta.description ||
    'Connecting farmers, agritourists, and workers through a digital platform...',
  ogTitle: `FarmLiaison - ${route.meta.ogTitle || 'Bridging Rural and Urban Life'}`,
  ogDescription:
    route.meta.ogDescription ||
    'Explore the heart of Spain’s rural landscapes...',
  ogImage: '/img/og.png',
  ogUrl: `https://farmliaison.com${route.path}`,
  twitterTitle: `FarmLiaison - ${route.meta.twitterTitle || 'Back to The Roots'}`,
  twitterDescription:
    route.meta.twitterDescription || 'Join FarmLiaison to explore...',
  twitterImage: '/img/og.png',
  twitterCard: 'summary',
  lang: locale.value,
}));

useSeoMeta(seoMeta.value);

// const { initAuth } = useAuth();

// onBeforeMount(async () => {
//   await initAuth();
// });
</script>
<style>
.q-layout.q-layout--standard {
  min-height: 1200px;
}
</style>
