import React from 'react';
import { mount } from 'enzyme';
import I18nProvider from '../I18nProvider';
import withI18n from '../withI18n';

describe('withI18n', () => {
  it('passes the translate prop', done => {
    fetch.mockResponseOnce(
      JSON.stringify({
        foo: 'bar',
        bar: 'baz',
      }),
    );

    class Child extends React.Component {
      render() {
        return <>{'foo'}</>;
      }
    }

    const IntlChild = withI18n(Child);

    const rendered = mount(
      <I18nProvider locale="ta">
        <IntlChild />
      </I18nProvider>,
    );

    process.nextTick(() => {
      rendered.update();
      const intl = rendered.find(Child).prop('intl');
      const translate = rendered.find(Child).prop('translate');

      expect(intl.messages).toEqual({
        foo: 'bar',
        bar: 'baz',
      });

      expect(intl.locale).toEqual('ta');
      expect(typeof translate).toEqual('function');

      global.fetch.mockClear();
      done();
    });
  });
});
