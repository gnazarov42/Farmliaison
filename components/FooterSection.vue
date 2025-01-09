<template>
  <q-toolbar>
    <q-toolbar-title class="row items-center">
      <q-avatar class="q-mr-lg" style="font-size: 72px">
        <img src="/img/fl-logo.svg" />
      </q-avatar>
      <div class="text-body2">
        &copy; {{ new Date().getFullYear() }} FarmLiaison
      </div>
      <q-space />
      <div class="row" style="gap: 0.8rem">
        <q-btn
          color="black-olive"
          text-color="white"
          icon="mdi-facebook"
          round
          size="sm"
          unelevated
        />
        <q-btn
          color="black-olive"
          text-color="white"
          icon="mdi-twitter"
          round
          size="sm"
          unelevated
        />
        <q-btn
          color="black-olive"
          text-color="white"
          icon="mdi-instagram"
          round
          size="sm"
          unelevated
        />
      </div>
    </q-toolbar-title>
  </q-toolbar>
  <q-toolbar>
    <div class="row items-start full-width" style="gap: 1.2rem">
      <div class="column">
        <h5 class="q-ma-none q-mb-md">{{ $t('join_us') }}</h5>
        <q-list>
          <q-item
            v-for="link in joinUsLinks"
            :key="link"
            class="q-pa-none q-pb-sm"
          >
            <nuxt-link class="text-body1" :to="link.url">{{
              $t(`${link.text}`)
            }}</nuxt-link>
          </q-item>
        </q-list>
      </div>
      <div class="column">
        <h5 class="q-ma-none q-mb-md">{{ $t('about-us') }}</h5>
        <q-list>
          <q-item
            v-for="link in aboutLinks"
            :key="link"
            class="q-pa-none q-pb-sm"
          >
            <nuxt-link class="text-body1" :to="link.url">{{
              $t(`${link.text}`)
            }}</nuxt-link>
          </q-item>
        </q-list>
      </div>
      <div v-if="false" class="column">
        <h5 class="q-ma-none q-mb-md">{{ $t('experiences') }}</h5>
        <q-list>
          <q-item
            v-for="link in experienceLinks"
            :key="link"
            class="q-pa-none q-pb-sm"
          >
            <nuxt-link class="text-body1" :to="link.url">{{
              $t(`${link.text}`)
            }}</nuxt-link>
          </q-item>
        </q-list>
      </div>
      <div class="column">
        <h5 class="q-ma-none q-mb-md">{{ $t('support') }}</h5>
        <q-list>
          <q-item
            v-for="link in supportLinks"
            :key="link"
            class="q-pa-none q-pb-sm"
          >
            <nuxt-link class="text-body1" :to="link.url">{{
              $t(`${link.text}`)
            }}</nuxt-link>
          </q-item>
        </q-list>
      </div>
      <LocaleSwitcher class="q-ml-auto q-mt-none" />
    </div>
  </q-toolbar>
</template>

<script setup>
const joinUsLinks = ref([
  { text: 'for_visitors', url: '/for-visitors' },
  { text: 'for_farmers', url: '/for-farmers' },
  { text: 'for_workers', url: '/for-workers' },
]);
const aboutLinks = ref([
  { text: 'our_mission', url: '/our-mission' },
  // { text: 'team', url: '/team' },
  // { text: 'blog', url: '/blog' },
]);
const experienceLinks = ref(['farm-visits', 'room-rentals', 'masterclasses']);
const supportLinks = ref([
  { text: 'faqs', url: '/faqs' },
  { text: 'contact_us', url: '/contact-us' },
  { text: 'terms_and_conditions', url: '/terms-and-conditions' },
]);
</script>
<style lang="scss" scoped>
.q-item {
  word-wrap: break-word;
  min-height: auto;
}
</style>
