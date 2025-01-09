<template>
  <q-header class="bg-white" height-hint="98">
    <div class="navbar">
      <q-toolbar class="q-px-none q-py-lg">
        <q-btn
          v-if="!$q.screen.gt.xs"
          flat
          round
          dense
          icon="menu"
          color="soft-dark-green"
          class="q-pl-md"
          @click="drawer = !drawer"
        />

        <div class="flex fit row justify-between logo items-center">
          <q-toolbar-title
            v-if="$q.screen.gt.xs"
            style="max-width: 132px; height: 56px"
          >
            <nuxt-link :to="localePath(`/`)">
              <img
                width="74px"
                style="vertical-align: bottom"
                src="/img/fl-logo-large.svg"
                alt="FarmLiaison logo"
              />
            </nuxt-link>
          </q-toolbar-title>

          <LocationSelector v-if="$q.screen.gt.xs" />

          <div class="row items-center">
            <LocaleSwitcher small />
            <ClientOnly>
              <UserMenu />
            </ClientOnly>
          </div>
        </div>
      </q-toolbar>
    </div>
    <div v-if="!$q.screen.gt.xs" class="q-pb-sm q-px-md">
      <LocationSelector />
    </div>
  </q-header>

  <q-drawer v-model="drawer" overlay :width="240" :breakpoint="500">
    <q-scroll-area class="fit">
      <q-list padding class="q-pt-xl">
        <q-item
          v-for="(value, key) in links"
          :key="key"
          v-ripple
          :to="localePath(`/${value.link}`)"
          :label="key"
          clickable
        >
          <q-item-section avatar>
            <q-icon :name="value.icon" color="soft-dark-green" />
          </q-item-section>
          <q-item-section>{{ $t(key) }}</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
const drawer = ref(false);

const links = {
  home: { link: '', icon: 'home' },
  farms: { link: 'farm', icon: 'agriculture' },
  events: { link: 'event', icon: 'mdi-calendar' },
  job: { link: 'job', icon: 'mdi-briefcase' },
  favorites: { link: 'favorites', icon: 'mdi-heart' },
};
const localePath = useLocalePath();
const route = useRoute();
</script>
<style lang="scss" scoped>
/* Same paddings and breakpoints as in default.vue */
.navbar {
  margin: auto;
  padding-left: 80px;
  padding-right: 80px;

  @media screen and (max-width: 1125px) {
    padding-left: 40px;
    padding-right: 40px;
  }
  @media screen and (max-width: 599px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}
.q-toolbar {
  @media screen and (max-width: 599px) {
    padding-left: 0;
    .flex {
      flex-direction: row-reverse;
    }
  }
}

.search-button {
  @media screen and (max-width: 760px) {
    display: none;
  }
}
.menu-list {
  .q-item {
    border-radius: 0 32px 32px 0;
  }
}
.q-scrollarea__content {
  .q-item {
    &:hover {
      text-decoration: none;
    }
  }
}
</style>
