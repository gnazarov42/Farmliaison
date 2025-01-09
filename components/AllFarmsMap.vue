<template>
  <div>
    <div class="map-container q-pb-lg">
      <LMap
        ref="map"
        :zoom="zoom"
        :key="userLocation"
        style="height: 400px"
        :center="[userLatitude, userLongitude]"
        :options="{ scrollWheelZoom: false }"
        @ready="mapInitialized"
        @moveend="onMapMoveEnd"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&amp;copy; <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors'
          layer-type="base"
          name="OpenStreetMap"
        />
        <LMarker :lat-lng="[userLatitude, userLongitude]">
          <LIcon :icon-size="[21, 21]">★</LIcon>
        </LMarker>
        <LMarker
          v-for="location in locations"
          :key="location.id"
          :lat-lng="[location.latitude, location.longitude]"
          :icon="getIcon(location)"
        >
          <LPopup :options="{ closeButton: false }">
            <MapCard :location="location" :userLocation="userLocation" />
          </LPopup>
        </LMarker>
      </LMap>
      <transition name="fade">
        <q-btn
          v-if="showSearchButton"
          color="primary"
          rounded
          outline
          :label="$t('search_this_location')"
          @click="searchThisLocation"
          class="search-location-btn bg-white"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { icon } from 'leaflet';

// This retrieves coordinates from local storage and reacts to changes
const userLocation = useLocalStorage('user-coords', {
  latitude: null,
  longitude: null,
  proximity: null,
});

const farmIcon = icon({
  iconUrl: '/img/icons/marker/farm.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 30],
});

const eventIcon = icon({
  iconUrl: '/img/icons/marker/event.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 30],
});

const getIcon = (location) => {
  return location.farmSlug ? farmIcon : eventIcon;
};

const zoom = ref(10);
const map = ref(null);
const showSearchButton = ref(false);

const props = defineProps({
  latitude: {
    type: Number,
    default: null, // Default to null to check if it's provided
  },
  longitude: {
    type: Number,
    default: null, // Default to null to check if it's provided
  },
  locations: {
    type: Array,
    default: () => [],
  },
});

const userLatitude = computed(() => userLocation.value.latitude);
const userLongitude = computed(() => userLocation.value.longitude);

const mapInitialized = () => {
  map.value.leafletObject.attributionControl.setPrefix(false);
};

const onMapMoveEnd = () => {
  if (map.value && map.value.leafletObject) {
    const center = map.value.leafletObject.getCenter();
    const isCenterSameAsUserLocation =
      center.lat === userLocation.value.latitude &&
      center.lng === userLocation.value.longitude;
    showSearchButton.value = !isCenterSameAsUserLocation;
  }
};

const searchThisLocation = () => {
  if (map.value && map.value.leafletObject) {
    const center = map.value.leafletObject.getCenter();
    if (center) {
      userLocation.value = {
        latitude: center.lat,
        longitude: center.lng,
        proximity: 0,
      };
      showSearchButton.value = false;
    }
  }
};
</script>

<style lang="scss" scoped>
body {
  margin: 0;
}
.leaflet-container {
  border: 1px solid #ccc;
  border-radius: 16px;
}
:deep(.leaflet-popup-content) {
  margin: 0;
}
:deep(.leaflet-popup-content-wrapper) {
  background-color: $light-sand;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  width: 272px;
}
:deep(.leaflet-popup-tip) {
  background-color: $light-sand;
  width: 272px;
}
:deep(.leaflet-div-icon) {
  background: none;
  color: $primary;
  border: none;
  font-size: small;
  text-align: center;
  line-height: 30px;
}
.map-container {
  position: relative;
}

.search-location-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  opacity: 0.7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
