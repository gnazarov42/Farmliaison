<template>
  <div
    class="text-dark-olive row"
    style="border-radius: 16px; box-shadow: inset 0 0 0 1px lightgray"
  >
    <q-btn
      style="border-radius: 16px"
      :color="isLocal ? 'primary' : 'pistachio'"
      class="q-px-md q-py-none"
      :text-color="isLocal ? 'white' : 'primary'"
      icon="location_on"
      no-caps
      @click="fetchCurrentLocation"
    >
      <span v-if="$q.screen.gt.sm" class="q-pl-sm">
        {{ $t('use_current_location') }}
      </span>
    </q-btn>
    <q-input
      borderless
      :placeholder="$t('or_enter_your_address_0')"
      v-model="addressInput"
      debounce="500"
      input-class="q-pl-md"
      class="q-mr-md self-center col-grow address-input"
    >
      <template v-slot:append>
        <q-icon color="dark-green" v-if="addressInput === ''" name="search" />
        <q-icon
          v-else
          name="clear"
          class="cursor-pointer"
          @click="addressInput = ''"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const DEFAULT_LATITUDE = 43.5343;
const DEFAULT_LONGITUDE = -5.6615;

const storedCoords = useLocalStorage('user-coords', {
  latitude: null,
  longitude: null,
  proximity: null,
});
const addressInput = ref('');
const isLocal = ref(false);
const userDeniedGeolocation = ref(false);

const isValidCoordinate = (lat, lon) => {
  return (
    lat !== null &&
    lon !== null &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};

async function fetchCurrentLocation() {
  isLocal.value = true;
  addressInput.value = '';
  userDeniedGeolocation.value = false;

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (
          isValidCoordinate(
            position.coords.latitude,
            position.coords.longitude,
          ) &&
          position.coords.latitude !== 0 &&
          position.coords.longitude !== 0
        ) {
          storedCoords.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            proximity: 0,
          };
        } else {
          setDefaultCoords();
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        userDeniedGeolocation.value = true;
        setDefaultCoords();
      },
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    userDeniedGeolocation.value = true;
    setDefaultCoords();
  }
}

async function lookupAddress() {
  if (!addressInput.value) {
    console.error('Please enter an address.');
    return;
  }

  const { data, pending, error } = await useFetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput.value)}`,
  );

  if (error.value) {
    console.error('API error:', error.value.message);
    return;
  }

  if (
    data.value.length > 0 &&
    isValidCoordinate(data.value[0].lat, data.value[0].lon)
  ) {
    storedCoords.value = {
      latitude: parseFloat(data.value[0].lat),
      longitude: parseFloat(data.value[0].lon),
    };
  } else {
    console.error('Invalid address or coordinates.');
  }
}

function setDefaultCoords() {
  storedCoords.value = {
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    proximity: 0,
  };
}

watch(addressInput, (newValue, oldValue) => {
  if (newValue !== oldValue && newValue !== '') {
    isLocal.value = false;
    lookupAddress();
  }
});

onMounted(() => {
  if (!storedCoords.value.latitude || !storedCoords.value.longitude) {
    fetchCurrentLocation();
  }
});
</script>

<style lang="scss" scoped>
@media screen and (min-width: 600px) {
  .address-input {
    min-width: 253px;
  }
}
:deep(.q-field__inner) {
  width: 10px;
}
:deep(.q-btn) {
  margin: 1px;
}
</style>
