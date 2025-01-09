<template>
  <vue-tel-input
    :default-country="locale"
    mode="international"
    :inputOptions="{ placeholder: $t('enter_phone_number') }"
    class="q-mb-md text-body2"
  />
</template>

<script setup lang="ts">
const { locale } = useI18n();

import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
</script>

<style lang="scss" scoped>
.vue-tel-input {
  min-height: 56px;
  position: relative;
  border-radius: 16px;
  :hover {
    border-color: $dark-page;
  }
  &:after {
    content: ' ';
    box-sizing: inherit;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    min-height: inherit;
    border-radius: inherit;
    border: 1px solid transparent;
    transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);
    border-width: 1px;
  }
  &:focus-within:after {
    border-color: $primary;
  }
  &:focus-within {
    box-shadow: none;
    border-color: $primary;
  }
}

:deep(.vti__input) {
  border-radius: 16px;
}
:deep(.vti__dropdown) {
  border-radius: 16px;
}
</style>
