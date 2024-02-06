<template>
  <select v-model="language">
    <option
      v-for="item in locales"
      :key="typeof item === 'object' ? item.code : item"
      :value="typeof item === 'object' ? item.code : item"
    >
      {{ typeof item === 'object' ? (item as LocaleObject).name : item }}
    </option>
  </select>
</template>
<script lang="ts" setup>
const { locales, locale, setLocale } = useI18n();

interface LocaleObject {
  code: string;
  name: string;
}

const language = computed({
  get: () => locale.value,
  set: (value) => {
    setLocale(value);
    localStorage.setItem('locale', value);
  },
});
</script>
<style scoped></style>
