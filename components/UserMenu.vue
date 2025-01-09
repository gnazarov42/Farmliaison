<template>
  <div>
    <div v-if="data?.user">
      <q-btn outline rounded color="dark-green" class="user-menu">
        <q-icon size="16px" color="primary" left name="menu" class="q-mx-sm" />
        <UserAvatar />
        <q-menu
          :offset="[0, 24]"
          anchor="bottom right"
          self="top right"
          style="border-radius: 16px; margin-top: 40px"
        >
          <q-list style="min-width: 150px">
            <q-item
              v-for="(value, key) in accountLinks"
              :key="key"
              v-close-popup
              clickable
              :to="localePath(value.link)"
            >
              {{ $t(key) }}
            </q-item>
            <q-separator />
            <q-item v-close-popup clickable @click="logoutUser">
              <q-item-section>{{ $t('logout') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <div v-else>
      <q-btn
        outline
        rounded
        color="dark-green"
        class="user-menu"
        @click="openLoginModal"
      >
        <q-icon size="16px" color="primary" left name="menu" class="q-mx-sm" />
        <q-icon size="38px" color="primary" name="mdi-account-circle" />
      </q-btn>
    </div>
  </div>
</template>

<script setup>
const { data, signOut } = useAuth();
const localePath = useLocalePath();
const { openModal } = useLoginModal();

const openLoginModal = () => {
  openModal();
};

const logoutUser = async () => {
  await signOut();
};

const accountLinks = computed(() => {
  const accountLinks = {
    account: {
      link: localePath(`/user/${data.value?.user?.id || '/user'}`),
      icon: 'account',
    },
    // messages: {
    //   link: '/messages',
    //   icon: 'message',
    // },
    favourites: {
      link: '/favorites',
      icon: 'heart',
    },
  };

  if (data.value?.user?.farmSlug) {
    accountLinks.new_event = {
      link: localePath('/event/new-event'),
      icon: 'local_pizza',
    };
  }
  if (data.value?.user?.farmSlug) {
    accountLinks.my_farm = {
      link: localePath(`/farm/${data.value?.user?.farmSlug}`),
      icon: 'local_pizza',
    };
  } else {
    accountLinks.create_farm = {
      link: localePath('/farm/new-farm'),
      icon: 'add',
    };
  }
  return accountLinks;
});
</script>
<style scoped lang="scss">
.user-menu {
  padding: 4px;
}
</style>
