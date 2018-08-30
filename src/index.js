import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { IntlProvider, addLocaleData, FormattedMessage } from 'react-intl';
import NotInitialisedError from './NotInitialisedError';
import supportedLanguages from './supportedLanguages.json';

let translate = NotInitialisedError;
let formatDate = NotInitialisedError;
let Translation = NotInitialisedError;

const withI18n = Component => {
  class WithI18nComponent extends PureComponent {
    render() {
      return <Component {...this.props} translate={translate} formatDate={formatDate} />;
    }
  }

  return WithI18nComponent;
};

class Provider extends PureComponent {
  state = {
    loaded: false,
  };

  async componentDidMount() {
    const { domain } = this.props;
    const language = this.getUserLanguage();
    const localeData = this.getAllLocaleData();

    addLocaleData(localeData);
    const translations = await this.fetchTranslations(language);

    const component = React.createElement(IntlProvider, {
      messages: translations,
      children: React.createElement('div'),
      locale: language,
      ref: element => {
        const { intl } = element.getChildContext();

        const provideIntlContext = Component => {
          class IntlComponent extends PureComponent {
            static childContextTypes = {
              intl: PropTypes.object,
            };

            static propTypes = {
              id: PropTypes.string.isRequired,
            };

            getChildContext() {
              return { intl };
            }

            render() {
              const { id, ...others } = this.props;
              return <Component {...others} id={`${domain}.${id}`} />;
            }
          }

          return IntlComponent;
        };

        translate = (id, values) => intl.formatMessage({ id: domain ? `${domain}.${id}` : id }, values);
        formatDate = intl.formatDate;
        Translation = provideIntlContext(FormattedMessage);

        this.setState({ loaded: true });
      },
    });

    render(component, document.createElement('div'));
  }

  getUserLanguage() {
    if (this.props.isDevelopmentMode) {
      return this.props.developmentLanguage;
    }

    const language = document.body.parentNode.getAttribute('lang');

    if (!supportedLanguages.includes(language)) {
      return this.props.fallbackLanguage;
    }

    return language;
  }

  async fetchTranslations(language) {
    const path = this.getTranslationsPath(language);

    try {
      const response = await fetch(path);
      const json = await response.json();
      return json;
    } catch (error) {}

    return {};
  }

  getTranslationsPath(language) {
    const { path } = this.props;

    if (typeof path === 'function') {
      return path(language);
    }

    return `${path}${language}.json`;
  }

  getAllLocaleData() {
    return supportedLanguages.reduce((currentLocaleData, language) => {
      const languageCode = language.split('-')[0];
      const localeData = this.getLocaleDataForLanguage(languageCode);
      return [...currentLocaleData, ...localeData];
    }, []);
  }

  getLocaleDataForLanguage(languageCode) {
    let languageToLoad = languageCode;

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

Provider.propTypes = {
  children: PropTypes.any.isRequired,
  domain: PropTypes.string.isRequired,
  isDevelopmentMode: PropTypes.bool,
  developmentLanguage: PropTypes.string,
  fallbackLanguage: PropTypes.string,
  path: PropTypes.oneOf(PropTypes.string, PropTypes.func).isRequired,
};

Provider.defaultProps = {
  isDevelopmentMode: false,
  developmentLanguage: 'tlh-KL',
  fallbackLanguage: 'en',
};

export { Provider, translate, formatDate, Translation, withI18n };
