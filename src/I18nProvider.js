import { PureComponent } from 'react';
import { getTranslationPath } from './utils';

export const FALLBACK_LANGUAGE = 'en';

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

  render() {
    return this.props.children;
  }
}

export default I18nProvider;
