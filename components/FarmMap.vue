<template>
  <div>
    <LMap
      v-if="latitude"
      ref="map"
      :zoom="zoom"
      style="height: 300px"
      :key="latitude + longitude"
      :center="[latitude, longitude]"
      :options="{ scrollWheelZoom: false }"
      @ready="mapInitialized"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />
      <LMarker :lat-lng="[latitude, longitude]"></LMarker>
    </LMap>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const zoom = ref(6);
const map = ref(null);

const { latitude, longitude } = defineProps({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});
const mapInitialized = () => {
  map.value.leafletObject.attributionControl.setPrefix(false);
};
</script>

<style lang="scss" scoped>
body {
  margin: 0;
}
/* Customize the map container */
.leaflet-container {
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
