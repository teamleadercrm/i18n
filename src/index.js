// @flow

import * as React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { IntlProvider, addLocaleData, FormattedMessage } from 'react-intl';
import NotInitialisedError from './NotInitialisedError';
import supportedLanguages from './supportedLanguages.json';

let translate = NotInitialisedError;
let formatDate = NotInitialisedError;
let Translation = NotInitialisedError;

const FALLBACK_LANGUAGE = 'en';

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
  language: ?string,
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
    const { namespace } = this.props;
    const language = this.getUserLanguage();
    const localeData = this.getAllLocaleData();

    addLocaleData(localeData);
    const translations = await this.fetchTranslations(language);

    const component = React.createElement(IntlProvider, {
      messages: translations,
      children: React.createElement('div'),
      locale: language,
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

  getUserLanguage(): string {
    const language = this.props.language || (document.documentElement && document.documentElement.getAttribute('lang'));

    if (!language || !supportedLanguages.includes(language)) {
      return FALLBACK_LANGUAGE;
    }

    return language;
  }

  async fetchTranslations(language: string): Object {
    const path = this.getTranslationsPath(language);

    try {
      const response = await fetch(path);
      const json: Object = await response.json();
      return json;
    } catch (error) {}

    return {};
  }

  getTranslationsPath(language: string) {
    const { path } = this.props;

    if (typeof path === 'function') {
      return path(language);
    }

    return `${path}${language}.json`;
  }

  getAllLocaleData(): Array<Object> {
    return supportedLanguages.reduce((currentLocaleData: Array<Object>, language: string): Array<Object> => {
      const languageCode = language.split('-')[0];
      const localeData = this.getLocaleDataForLanguage(languageCode);
      return [...currentLocaleData, ...localeData];
    }, []);
  }

  getLocaleDataForLanguage(languageCode: string): Array<Object> {
    // tlh doesn't exist, so we replace it with english (which we want anyway)
    const languageToLoad = languageCode === 'tlh' ? 'en' : languageCode;

    const localeData = require(`react-intl/locale-data/${languageToLoad}`);

    if (languageCode === 'tlh') {
      localeData.push({ locale: 'tlh', parentLocale: 'en' });
    }

    return localeData;
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }

    return this.props.children;
  }
}

export { Provider, translate, formatDate, Translation, withI18n };
