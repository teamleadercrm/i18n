import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

import { translate } from './I18nProvider';

export default WrappedComponent => {
  return injectIntl(
    class extends PureComponent {
      render() {
        return <WrappedComponent {...this.props} translate={translate} />;
      }
    },
  );
};
