<template>
  <q-dialog v-model="showLoginModal" max-width="500px">
    <AuthForm @success="closeModal" />
  </q-dialog>
</template>

<script setup>
const { showLoginModal, closeModal } = useLoginModal();
</script>
