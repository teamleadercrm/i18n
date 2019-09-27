import { getTranslationPath } from '../utils';

describe('utils', () => {
  describe('getTranslationPath', () => {
    it('gets path from string', () => {
      expect(getTranslationPath('/translations/', 'en')).toEqual('/translations/en.json');
    });

    it('gets path from function', () => {
      const getPath = language => `/some/translations/${language}.json`;

      expect(getTranslationPath(getPath, 'en')).toEqual('/some/translations/en.json');
    });
  });
});
