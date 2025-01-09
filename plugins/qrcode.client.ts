// plugins/qrcode.client.ts
import QRCodeStyling from 'qr-code-styling';
import type { Options } from 'qr-code-styling';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      // Provide a helper that returns an instance of QRCodeStyling
      qrCodeStyling: (options: Partial<Options>): QRCodeStyling => {
        return new QRCodeStyling(options);
      },
    },
  };
});
