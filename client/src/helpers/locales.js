export const inputs = {
  en: 'en',
  'en-gb': 'en',
  gb: 'en',
  fr: 'fr',
};

export const outputs = {
  en: {
    i18n: 'en',
    moment: 'en-gb',
    flagIcon: 'gb',
  },
  fr: {
    i18n: 'fr',
    moment: 'fr',
    flagIcon: 'fr',
  },
};

export const localeTo = (locale, output) => {
  if (!locale || !output) {
    // eslint-disable-next-line no-console
    console.error('Locale and output are required (localeTo("en", "moment"))');
    return false;
  }
  return outputs[inputs[locale]][output];
};
