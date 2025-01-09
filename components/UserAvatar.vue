<template>
  <q-avatar>
    <NuxtImg
      v-if="data?.user?.profileImage || data?.user?.image"
      fit="cover"
      :src="
        useImageOptim(
          data?.user?.profileImage
            ? data?.user?.profileImage
            : data?.user?.image,
          'q_auto,f_auto,c_auto,g_auto,ar_1:1,w_160',
        )
      "
      :ratio="1"
    />
    <div v-else class="text-white text-bold">
      {{ data?.user?.name?.charAt(0) }}
    </div>
  </q-avatar>
</template>

<script setup>
import { useImageOptim } from '~/composables/useImageOptim';
const { data } = useAuth();
</script>
