export default () => {
  throw new Error('Initialize i18n with the Provider before calling any internationalization methods');
};

export const createNonInitialisedError = name => () => {
  throw new Error(`Initialize i18n with the Provider before calling the ${name} method.`);
};
