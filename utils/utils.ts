export function isUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export const rules = {
  isValidEmail: (email: string) => {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(email);
  },
  hasAnyValue: (val: any) => (val && val.length > 0) || 'Please type something',
  hasAnySelection: (val: any) => !!val || 'Please select something',
};

export async function extractCoordinatesFromUrl(
  url: string,
): Promise<{ latitude: number | null; longitude: number | null }> {
  if (!isUrl(url)) return { latitude: null, longitude: null };

  // Extract coordinates directly from the URL if visible
  const coordinates = /@([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/.exec(
    url,
  );
  if (coordinates) {
    return {
      latitude: parseFloat(coordinates[1]),
      longitude: parseFloat(coordinates[2]),
    };
  }
  return { latitude: null, longitude: null };
}

export const confirmDialog = (props?: {
  title?: string;
  description?: string;
  okLabel?: string;
  cancelLabel?: string;
}) =>
  new Promise((resolve, reject) => {
    Dialog.create({
      title: props?.title || 'Confirm',
      message: props?.description || 'Are you sure you want to continue?',
      ok: {
        rounded: true,
        color: 'negative',
        label: props?.okLabel || true,
      },
      cancel: {
        rounded: true,
        color: 'primary',
        label: props?.cancelLabel || true,
      },
      persistent: true,
    })
      .onOk(() => {
        resolve(true);
      })
      .onCancel(() => {
        reject();
      });
  });

export const removeMarkdown = (text: string) => {
  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/(~~)(.*?)\1/g, '$2') // strikethrough
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // links
    .replace(/^\s{0,3}>\s?/g, '') // blockquotes
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/^-{3,}/g, '') // horizontal rule
    .replace(/^\s*#{1,6}\s*/g, '') // headings
    .replace(/^\s*\*\s*/g, '') // unordered lists
    .replace(/^\s*\d+\.\s*/g, '') // ordered lists
    .replace(/^\s*[-+*]\s+/g, '') // unordered lists
    .replace(/^\s*\d+\.\s+/g, '') // ordered lists
    .replace(/\n{2,}/g, '\n\n') // multiple newlines to two newlines
    .replace(/^\s+/g, '') // leading whitespaces
    .replace(/\s+$/g, ''); // trailing whitespaces
};

export const currencies = [
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'British Pound (GBP)', value: 'GBP' },
  { label: 'Schweizer Franken (CHF)', value: 'CHF' },
  { label: 'Canadian Dollar (CAD)', value: 'CAD' },
  { label: 'Australian Dollar (AUD)', value: 'AUD' },
  { label: 'Svensk krona (SEK)', value: 'SEK' },
  { label: 'Norsk krone (NOK)', value: 'NOK' },
  { label: 'Dansk krone (DKK)', value: 'DKK' },
  { label: 'Polski złoty (PLN)', value: 'PLN' },
  { label: 'Česká koruna (CZK)', value: 'CZK' },
  { label: 'Magyar forint (HUF)', value: 'HUF' },
  { label: 'Íslensk króna (ISK)', value: 'ISK' },
  { label: 'New Zealand Dollar (NZD)', value: 'NZD' },
];

// Phone number validation function
export const isValidPhoneNumber = (val: string): boolean => {
  const phoneRegex = /^\+[1-9]{1}[0-9]{1,14}(\s?[0-9]{1,4})*$/;
  return phoneRegex.test(val);
};
