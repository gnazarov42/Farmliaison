<template>
  <div ref="qrCode"></div>
</template>

<script setup lang="ts">
import type QRCodeStyling from 'qr-code-styling';

const props = defineProps({
  data: String,
  size: {
    type: Number,
    default: 120,
  },
  color: {
    type: String,
    default: '#374E00',
  },
  bg: {
    type: String,
    default: '#fff',
  },
});

const { $qrCodeStyling } = useNuxtApp();
const qrCode = ref<HTMLElement | null>(null);

// Default options
const options = {
  width: props.size,
  height: props.size,
  type: 'svg',
  data: props.data,
  image: '/img/fl.svg',
  dotsOptions: {
    color: props.color,
    type: 'rounded',
  },
  backgroundOptions: {
    color: props.bg,
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 10,
  },
};

let qrCodeStyling: QRCodeStyling | null = null;

onMounted(() => {
  qrCodeStyling = $qrCodeStyling(options);
  // Append QR code to DOM element
  qrCodeStyling.append(qrCode.value);
  // Add viewbox to make it resizable
  qrCode.value!.firstChild!.setAttribute(
    'viewBox',
    `0 0 ${props.size} ${props.size}`,
  );
});

watch(
  () => props.data,
  (newValue: string) => {
    if (qrCodeStyling) {
      // Update QR code data when props change
      options.data = newValue;
      qrCodeStyling.update(options);
      // Add viewbox to make it resizable
      qrCode.value!.firstChild!.setAttribute(
        'viewBox',
        `0 0 ${props.size} ${props.size}`,
      );
    }
  },
);
</script>

<style lang="scss" scoped>
svg {
  width: 100%;
  height: 100%;
}
</style>
