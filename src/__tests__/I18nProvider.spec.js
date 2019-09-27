import React from 'react';
import { mount } from 'enzyme';
import I18nProvider from '../I18nProvider';

describe('I18nProvider', () => {
  it('renders the its children', () => {
    const rendered = mount(
      <I18nProvider>
        <div>Hello World</div>
      </I18nProvider>,
    );
    expect(rendered.children().length).toBe(1);
    expect(rendered).toMatchSnapshot();
  });
});
