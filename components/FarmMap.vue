<template>
  <div>
    <LMap
      ref="map"
      :zoom="zoom"
      style="height: 300px"
      :center="[latitude, longitude]"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
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
</script>

<style>
body {
  margin: 0;
}
/* Customize the map container */
.leaflet-container {
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
