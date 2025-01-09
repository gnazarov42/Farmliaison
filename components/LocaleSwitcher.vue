<template>
  <div class="row items-center">
    <q-select
      v-if="!small"
      v-model="language"
      class="text-body1"
      :options="selectOptions"
      emit-value
      map-options
      flat
      dense
      borderless
    ></q-select>
    <q-icon v-if="!small" size="sm" name="mdi-web" />
    <q-btn v-else round flat size="md" color="soft-dark-green" icon="mdi-web">
      <q-menu
        :offset="[0, 24]"
        anchor="bottom right"
        self="top right"
        style="border-radius: 16px; margin-top: 40px"
      >
        <q-list>
          <q-item
            v-for="(value, key) in selectOptions"
            :key="key"
            clickable
            @click="language = value.value"
            :active="locale === value.value"
          >
            {{ value.label }}
          </q-item>
          <q-separator />
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locales, locale, setLocale } = useI18n();

const props = defineProps({
  small: {
    type: Boolean,
    default: false,
  },
});

// Prepare select options from locales
const selectOptions = computed(() =>
  locales.value.map((item) => ({
    label: typeof item === 'object' ? item.name : item,
    value: typeof item === 'object' ? item.code : item,
  })),
);

const language = computed({
  get: () => locale.value,
  set: (value: string) => {
    setLocale(value);
    localStorage.setItem('locale', value);
  },
});
</script>

<style lang="scss" scoped></style>
