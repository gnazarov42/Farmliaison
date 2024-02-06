<template>
  <q-card flat class="bg-transparent">
    <q-item v-if="data?.user">
      <q-item-section avatar>
        <q-avatar>
          <img
            :src="
              data?.user?.profileImage ||
              'https://cdn.quasar.dev/img/avatar2.jpg'
            "
          />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ data?.user?.name || 'Unknown User' }}</q-item-label>
        <q-item-label caption>{{ data?.user?.email }}</q-item-label>
        <nuxt-link :to="`/user/${data?.user.id}`">{{
          data?.user?.name
        }}</nuxt-link>
      </q-item-section>
      <q-btn color="secondary" label="Logout" @click="logoutUser" />
    </q-item>
    <div v-else>
      <q-btn color="secondary" label="Login" @click="showLoginModal = true" />
      <q-dialog v-model="showLoginModal" max-width="400px">
        <AuthForm @success="showLoginModal = false" />
      </q-dialog>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
const { data, signOut } = useAuth();

const showLoginModal = ref(false);
// const user = computed(() => data.value.user);

const logoutUser = async () => {
  await signOut();
};
</script>
