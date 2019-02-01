// @flow

import * as React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { IntlProvider, addLocaleData, FormattedMessage } from 'react-intl';
import NotInitialisedError from './NotInitialisedError';
import supportedLocales from './supportedLocales.json';

let translate = NotInitialisedError;
let formatDate = NotInitialisedError;
let Translation = NotInitialisedError;

const FALLBACK_LOCALE = 'en-GB';

const withI18n = (Component: any) => {
  class WithI18nComponent extends React.PureComponent<any> {
    render() {
      return <Component {...this.props} translate={translate} formatDate={formatDate} />;
    }
  }

  return WithI18nComponent;
};

type Props = {
  children: any,
  namespace: ?string,
  locale: ?string,
  path: string | (string => string),
};

type State = {
  loaded: boolean,
};

class Provider extends React.PureComponent<Props, State> {
  state = {
    loaded: false,
  };

  async componentDidMount() {
    const locale = this.getUserLocale();
    const localeData = this.getAllLocaleData();

    addLocaleData(localeData);
    const translations = await this.fetchTranslations(locale);

    const component = React.createElement(IntlProvider, {
      messages: translations,
      children: React.createElement('div'),
      locale,
      ref: (element: ?React.Component<typeof IntlProvider>) => {
        if (!element) {
          return;
        }

        const { intl } = element.getChildContext();

        const provideIntlContext = (
          Component: React.ComponentType<any>,
          getTranslationId: Function,
        ): React.ComponentType<any> => {
          class IntlComponent extends React.PureComponent<{ id: string }> {
            static childContextTypes = {
              intl: PropTypes.object,
            };

            getChildContext() {
              return { intl };
            }

            render() {
              const { id, ...others } = this.props;
              return <Component {...others} id={getTranslationId(id)} />;
            }
          }

          return IntlComponent;
        };

        translate = (id: string, values: ?Object): string =>
          intl.formatMessage({ id: this.getTranslationId(id) }, values);
        formatDate = intl.formatDate;
        Translation = provideIntlContext(FormattedMessage, this.getTranslationId);

        this.setState({ loaded: true });
      },
    });

    render(component, document.createElement('div'));
  }

  getTranslationId = (id: string): string => {
    const { namespace } = this.props;
    return namespace ? [namespace, id].join('.') : id;
  };

  getUserLocale(): string {
    const locale = this.props.locale || (document.documentElement && document.documentElement.getAttribute('lang'));

    if (!locale) return FALLBACK_LOCALE;

    // we support both the language code and the language + locale. For example
    // both 'en' and 'en-GB' are valid though 'en' is considered 'en-US'.
    const supportedLanguages = supportedLocales.map(this.localeToLanguage);

    if (supportedLocales.includes(locale) || supportedLanguages.includes(locale)) {
      return locale;
    }

    return FALLBACK_LOCALE;
  }

  async fetchTranslations(locale: string): Object {
    const path = this.getTranslationsPath(locale);

    try {
      const response = await fetch(path);
      return await response.json();
    } catch (error) {}

    return {};
  }

  getTranslationsPath(locale: string) {
    const { path } = this.props;

    if (typeof path === 'function') {
      return path(locale);
    }

    return `${path}${locale}.json`;
  }

  localeToLanguage(locale: string): string {
    if (locale.match(/^tlh-/)) return 'en';
    return locale.split('-')[0];
  }

  getAllLocaleData(): Array<Object> {
    const languages = Object.keys(supportedLocales.reduce((languages, locale) => ({
      ...languages,
      [this.localeToLanguage(locale)]: true,
    }), {}));

    const localeData = languages.map(language => require(`react-intl/locale-data/${language}`));

    localeData.push({
      locale: 'tlh',
      parentLocale: 'en'
    });

    return localeData.reduce((allLocaleData, localeData) => allLocaleData.concat(localeData), []);
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }

    return this.props.children;
  }
}

export type Translate = (id: string, values?: {}) => string;
export type FormatDate = (value: any, options?: {}) => string;
export type WithI18nProps = {
  translate: Translate,
  formatDate: FormatDate
};

export { Provider, translate, formatDate, Translation, withI18n };
