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
  FormattedRelative,
  FormattedNumber,
  FormattedPlural,
} from 'react-intl';
import NotInitialisedError, { createNonInitialisedError } from './NotInitialisedError';
import supportedLocales from './supportedLocales.json';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-relativetimeformat/polyfill';

let translate = createNonInitialisedError('translate');
let Translation = createNonInitialisedError('Translation');
let formatDate = createNonInitialisedError('formatDate');
let formatTime = createNonInitialisedError('formatTime');
let formatRelative = createNonInitialisedError('formatRelative');
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
          formatRelative={formatRelative}
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
    const { debug } = this.props;

    await this.setLocalData(locale);

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

        if (debug === true) {
          intl.formatMessage = ({ id }) => id;
        }

        const provideIntlContext = (
          Component: React.ComponentType<any>,
          mapProps: ?(Object) => Object
        ): React.ComponentType<any> => {
          class IntlComponent extends React.PureComponent<{ id: string }> {
            static childContextTypes = {
              intl: PropTypes.object,
            };

            getChildContext() {
              return { intl };
            }

            render() {
              return <Component {...(mapProps ? mapProps(this.props) : this.props)} />;
            }
          }

          return IntlComponent;
        };

        translate = (id: string, values: ?Object): string =>
          intl.formatMessage({ id: this.getTranslationId(id) }, values);

        Translation = provideIntlContext(ReactIntlFormattedMessage, props => ({
          ...props,
          id: props.id && this.getTranslationId(props.id),
        }));

        formatDate = intl.formatDate;
        FormattedDate = provideIntlContext(ReactIntlFormattedDate);

        formatTime = intl.formatTime;
        FormattedTime = provideIntlContext(ReactIntlFormattedTime);

        formatRelative = intl.formatRelative;
        FormattedRelative = provideIntlContext(ReactIntlFormattedRelative);

        formatNumber = intl.formatNumber;
        FormattedNumber = provideIntlContext(ReactIntlFormattedNumber);

        formatPlural = intl.formatPlural;
        FormattedPlural = provideIntlContext(ReactIntlFormattedPlural);

        formatHtmlMessage = intl.formatHtmlMessage;
        FormattedHtmlMessage = provideIntlContext(ReactIntlFormattedHtmlMessage);

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

  async setLocalData(locale: string): Promise<Array<Object>> {
    if (!Intl.PluralRules) {
      if (locale === 'tlh-KL') {
        await import(`@formatjs/intl-pluralrules/dist/locale-data/en`);
      } else {
        await import(`@formatjs/intl-pluralrules/dist/locale-data/${language}`);
      }
    }

    if (!Intl.RelativeTimeFormat) {
      if (locale === 'tlh-KL') {
        await import(`@formatjs/intl-relativetimeformat/dist/locale-data/en`);
      } else {
        await import(`@formatjs/intl-relativetimeformat/dist/locale-data/${language}`);
      }
    }
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }

    return this.props.children;
  }
}

export type StringFormatter = (id: string, values?: {}) => string;
export type Formatter = (value: any, options?: {}) => string;
export type WithI18nProps = {
  translate: StringFormatter,
  formatDate: Formatter,
  formatTime: Formatter,
  formatRelative: Formatter,
  formatNumber: Formatter,
  formatPlural: Formatter,
  formatHtmlMessage: StringFormatter,
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
  formatRelative,
  FormattedRelative,
  formatNumber,
  FormattedNumber,
  formatPlural,
  FormattedPlural,
  formatHtmlMessage,
  FormattedHtmlMessage,
};
