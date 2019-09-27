import { PureComponent } from 'react';

class I18nProvider extends PureComponent {
  state = {
    locale: this.props.locale,
    messages: {},
    isLoading: true,
  };

  async componentDidMount() {
    try {
      const response = await fetch(this.props.path + `${this.props.locale}.json`);
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
