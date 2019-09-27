import { PureComponent } from 'react';

class I18nProvider extends PureComponent {
  render() {
    return this.props.children;
  }
}

export default I18nProvider;
