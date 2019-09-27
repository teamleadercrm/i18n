export const getTranslationPath = (path, locale) => {
  if (typeof path === 'function') {
    return path(locale);
  }

  return `${path}${locale}.json`;
};
