// @flow
import * as React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import {
  createIntl,
  createIntlCache,
  RawIntlProvider,
  IntlProvider,
  FormattedMessage,
  FormattedDate,
  FormattedTime,
  FormattedRelativeTime,
  FormattedNumber,
  FormattedPlural,
} from 'react-intl';
import NotInitialisedError, { createNonInitialisedError } from './NotInitialisedError';
import supportedLocales from './supportedLocales.json';

let translate = createNonInitialisedError('translate');
let Translation = createNonInitialisedError('Translation');
let formatDate = createNonInitialisedError('formatDate');
let formatTime = createNonInitialisedError('formatTime');
let formatRelativeTime = createNonInitialisedError('formatRelativeTime');
let formatNumber = createNonInitialisedError('formatNumber');
let formatPlural = createNonInitialisedError('formatPlural');

const FALLBACK_LOCALE = 'en-GB';

const withI18n = (Component: any) => {
  class WithI18nComponent extends React.PureComponent<any> {
    render() {
      return (
        <Component
          {...this.props}
          translate={translate}
          formatDate={formatDate}
          formatTime={formatTime}
          formatRelativeTime={formatRelativeTime}
          formatNumber={formatNumber}
          formatPlural={formatPlural}
        />
      );
    }
  }

  return WithI18nComponent;
};

type Props = {
  children: any,
  namespace: ?string,
  locale: ?string,
  debug: ?boolean,
  path: string | (string => string),
  fallback: ?any
};

type State = {
  intl: any,
};

class Provider extends React.PureComponent<Props, State> {
  state = {
    intl: null,
  };

  async componentDidMount() {
    const locale = this.getUserLocale();
    const { debug } = this.props;

    await this.loadPolyfills(locale);

    const translations = await this.fetchTranslations(locale);

    const cache = createIntlCache();
    const intl = createIntl(
      {
        locale: locale === 'tlh-KL' ? 'en' : locale,
        messages: translations,
      },
      cache,
    );

    formatDate = intl.formatDate;
    formatTime = intl.formatTime;
    formatRelativeTime = intl.formatRelativeTime;
    formatNumber = intl.formatNumber;
    formatPlural = intl.formatPlural;

    translate = debug ? (id: string) => this.getTranslationId(id) : (id: string, values: ?Object): string => intl.formatMessage({ id: this.getTranslationId(id) }, values);
    Translation = props => <FormattedMessage {...props} id={props.id && this.getTranslationId(props.id)} />;

    this.setState({ intl });
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

  async loadPolyfills(locale: string): Promise<Array<Object>> {
    if (!Intl.PluralRules) {
      await import('@formatjs/intl-pluralrules/polyfill');
      switch (this.localeToLanguage(locale)) {
        case 'nl':
          import(`@formatjs/intl-pluralrules/locale-data/nl`);
          break;
        case 'fr':
          import(`@formatjs/intl-pluralrules/locale-data/fr`);
          break;
        case 'de':
          import(`@formatjs/intl-pluralrules/locale-data/de`);
          break;
        case 'es':
          import(`@formatjs/intl-pluralrules/locale-data/es`);
          break;
        case 'it':
          import(`@formatjs/intl-pluralrules/locale-data/it`);
          break;
        case 'da':
          import(`@formatjs/intl-pluralrules/locale-data/da`);
          break;
        case 'pt':
          import(`@formatjs/intl-pluralrules/locale-data/pt`);
          break;
        case 'pl':
          import(`@formatjs/intl-pluralrules/locale-data/pl`);
          break;
        case 'tr':
          import(`@formatjs/intl-pluralrules/locale-data/tr`);
          break;
        case 'nb':
          import(`@formatjs/intl-pluralrules/locale-data/nb`);
          break;
        case 'fi':
          import(`@formatjs/intl-pluralrules/locale-data/fi`);
          break;
        case 'sv':
          import(`@formatjs/intl-pluralrules/locale-data/sv`);
          break;
        default:
          import(`@formatjs/intl-pluralrules/locale-data/en`);
          break;
      }
    }

    if (!Intl.RelativeTimeFormat) {
      await import('@formatjs/intl-relativetimeformat/polyfill');
      switch (this.localeToLanguage(locale)) {
        case 'nl':
          import(`@formatjs/intl-relativetimeformat/locale-data/nl`);
          break;
        case 'fr':
          import(`@formatjs/intl-relativetimeformat/locale-data/fr`);
          break;
        case 'de':
          import(`@formatjs/intl-relativetimeformat/locale-data/de`);
          break;
        case 'es':
          import(`@formatjs/intl-relativetimeformat/locale-data/es`);
          break;
        case 'it':
          import(`@formatjs/intl-relativetimeformat/locale-data/it`);
          break;
        case 'da':
          import(`@formatjs/intl-relativetimeformat/locale-data/da`);
          break;
        case 'pt':
          import(`@formatjs/intl-relativetimeformat/locale-data/pt`);
          break;
        case 'pl':
          import(`@formatjs/intl-relativetimeformat/locale-data/pl`);
          break;
        case 'tr':
          import(`@formatjs/intl-relativetimeformat/locale-data/tr`);
          break;
        case 'nb':
          import(`@formatjs/intl-relativetimeformat/locale-data/nb`);
          break;
        case 'fi':
          import(`@formatjs/intl-relativetimeformat/locale-data/fi`);
          break;
        case 'sv':
          import(`@formatjs/intl-relativetimeformat/locale-data/sv`);
          break;
        default:
          import(`@formatjs/intl-relativetimeformat/locale-data/en`);
          break;
      }
    }
  }

  render() {
    if (!this.state.intl) {
      return this.props.fallback || null;
    }

    return <RawIntlProvider value={this.state.intl}>{this.props.children}</RawIntlProvider>;
  }
}

export type StringFormatter = (id: string, values?: {}) => string;
export type Formatter = (value: any, options?: {}) => string;
export type WithI18nProps = {
  translate: StringFormatter,
  formatDate: Formatter,
  formatTime: Formatter,
  formatRelativeTime: Formatter,
  formatNumber: Formatter,
  formatPlural: Formatter,
};

export {
  Provider,
  translate,
  formatDate,
  Translation,
  withI18n,
  FormattedDate,
  formatTime,
  FormattedTime,
  formatRelativeTime,
  FormattedRelativeTime,
  formatNumber,
  FormattedNumber,
  formatPlural,
  FormattedPlural,
  FormattedMessage,
};
