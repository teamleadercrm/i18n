import React from 'react';
import { mount, shallow } from 'enzyme';
import I18nProvider from '../I18nProvider';
import { injectIntl } from 'react-intl';

describe('I18nProvider', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders nothing if its loading', () => {
    const rendered = mount(
      <I18nProvider>
        <div>Hello World</div>
      </I18nProvider>,
    );

    expect(rendered.children().length).toBe(0);
  });

  it('renders the its children', () => {
    const rendered = mount(
      <I18nProvider>
        <div>Hello World</div>
      </I18nProvider>,
    );
    rendered.setState({
      isLoading: false,
    });
    expect(rendered.children().length).toBe(1);
    expect(rendered).toMatchSnapshot();
  });

  it('intializes with locale passed as prop', () => {
    const rendered = mount(
      <I18nProvider locale="ta">
        <div>Hello World</div>
      </I18nProvider>,
    );

    expect(rendered.state().locale).toEqual('ta');
    expect(rendered.state().messages).toEqual({});
    expect(rendered.state().isLoading).toEqual(true);
  });

  it('intializes with fallback language if no locale provided', () => {
    const rendered = mount(
      <I18nProvider>
        <div>Hello World</div>
      </I18nProvider>,
    );

    expect(rendered.state().locale).toEqual('en');
    expect(rendered.state().messages).toEqual({});
    expect(rendered.state().isLoading).toEqual(true);
  });

  it('fetches translations and sets it to the state', done => {
    fetch.mockResponseOnce(
      JSON.stringify({
        foo: 'bar',
        bar: 'baz',
      }),
    );

    const wrapper = shallow(<I18nProvider path="/translations/" locale="en" />);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/translations/en.json');

    process.nextTick(() => {
      expect(wrapper.state()).toEqual({
        messages: {
          foo: 'bar',
          bar: 'baz',
        },
        isLoading: false,
        locale: 'en',
      });

      global.fetch.mockClear();
      done();
    });
  });

  it('fetches translations with path as a function and sets it to the state', done => {
    fetch.mockResponseOnce(
      JSON.stringify({
        foo: 'bar',
        bar: 'baz',
      }),
    );

    const getPath = language => `${language}.hash.json`;

    shallow(<I18nProvider path={getPath} locale="en" />);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('en.hash.json');

    global.fetch.mockClear();
    done();
  });

  it('passes the react-intl props', done => {
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

    const IntlChild = injectIntl(Child);

    const rendered = mount(
      <I18nProvider locale="ta">
        <IntlChild />
      </I18nProvider>,
    );

    process.nextTick(() => {
      rendered.update();
      const intl = rendered.find(Child).prop('intl');

      expect(intl.messages).toEqual({
        foo: 'bar',
        bar: 'baz',
      });

      expect(intl.locale).toEqual('ta');

      global.fetch.mockClear();
      done();
    });
  });
});
