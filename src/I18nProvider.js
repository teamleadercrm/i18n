import React, { PureComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { getTranslationPath } from './utils';

export const FALLBACK_LANGUAGE = 'en';

let translate = undefined;

class I18nProvider extends PureComponent {
  state = {
    locale: this.props.locale || FALLBACK_LANGUAGE,
    messages: {},
    isLoading: true,
  };

  async componentDidMount() {
    try {
      const response = await fetch(getTranslationPath(this.props.path, this.props.locale));
      const translations = await response.json();
      this.setState({
        isLoading: false,
        messages: translations,
      });
    } catch (error) {}
  }

  getIntl() {
    const cache = createIntlCache();

    const intl = createIntl(
      {
        locale: this.state.locale,
        messages: this.state.messages,
      },
      cache,
    );

    translate = (id, values) => {
      const { namespace } = this.props;
      const namespacedId = namespace ? [namespace, id].join('.') : id;

      return intl.formatMessage({ id: namespacedId }, values);
    };

    return intl;
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    return <RawIntlProvider value={this.getIntl()}>{this.props.children}</RawIntlProvider>;
  }
}

export default I18nProvider;
export { translate };
