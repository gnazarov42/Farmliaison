<template>
  <q-header class="bg-primary text-white row" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
        </q-avatar>
        Title
      </q-toolbar-title>
    </q-toolbar>

    <q-tabs align="left">
      <q-route-tab
        v-for="(value, key) in links"
        :key="key"
        :to="localePath(`/${value}`)"
        :label="key"
      />
    </q-tabs>
    <ClientOnly>
      <UserAvatar class="q-ml-auto" />
    </ClientOnly>
  </q-header>
</template>

<script setup>
const links = {
  Home: '',
  Farm: 'farm',
  // Profile: 'userprofile',
};
const localePath = useLocalePath();
</script>
