import { PureComponent } from 'react';

class I18nProvider extends PureComponent {
  state = {
    locale: this.props.locale,
    messages: {},
    isLoading: true,
  };

  render() {
    return this.props.children;
  }
}

export default I18nProvider;
