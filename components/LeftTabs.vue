<template>
  <q-page-sticky v-if="$q.screen.gt.xs" expand position="left">
    <div class="fit column">
      <q-list>
        <q-item
          v-for="(value, key) in links"
          :key="key"
          :to="localePath(`/${value.link}`)"
          :label="key"
          class="q-px-sm q-pt-none"
        >
          <div class="column items-center">
            <q-btn unelevated rounded>
              <q-icon color="soft-dark-green" :name="value.icon" size="24px" />
            </q-btn>
            <div class="label text-caption text-center">
              {{ $t(key) }}
            </div>
          </div>
        </q-item>
      </q-list>
    </div>
  </q-page-sticky>
</template>

<script setup>
const links = {
  home: { link: '', icon: 'home' },
  farms: { link: 'farm', icon: 'agriculture' },
  events: { link: 'event', icon: 'mdi-calendar' },
  job: { link: 'job', icon: 'mdi-briefcase' },
  favorites: { link: 'favorites', icon: 'mdi-heart' },
  // Profile: 'userprofile',
};
const localePath = useLocalePath();
</script>

<script setup></script>
<style scoped lang="scss">
.q-page-sticky {
  .q-item {
    border-radius: 16px;
    &:hover {
      text-decoration: none;
    }
    .label {
      color: $soft-dark-green;
      width: 70px;
      overflow-wrap: break-word;
    }
  }
  .q-router-link--exact-active {
    .q-btn {
      background-color: $pistachio;
    }
  }
  :deep(.q-focusable:focus > .q-focus-helper) {
    opacity: 0 !important;
  }
  :deep(.q-hoverable:hover > .q-focus-helper) {
    opacity: 0.05 !important;
  }
}
</style>
