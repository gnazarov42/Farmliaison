<template>
  <div>
    <h1 class="text-3xl font-bold">Hi! I'm protected.</h1>
    <pre>{{ data }}</pre>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
const { data } = useAuth();
</script>
