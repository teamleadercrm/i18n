# @teamleader/api [![npm version](https://badge.fury.io/js/%40teamleader%2Fi18n.svg)](https://badge.fury.io/js/%40teamleader%2Fi18n)

Teamleader i18n implementation for our frontend micro service, built with `react-intl` (in a hacky way).

## Installation

```bash
npm i @teamleader/i18n
```

## Usage Example

Wrap your app with the `Provider`.

```js
import { Provider as I18nProvider } from '@teamleader/i18n';

const App = () => (
  <I18nProvider domain="domains.invoicing" path="/">
    <TheRestOfYourApp />
  </I18nProvider>
);
```

Now you can Use translations inside your components.

You can use the `withI18n` HOC which will provide a `translate` function to your component.

```js
import { withI18n } from '@teamleader/i18n';

const  MyComponent = () => (
  <button>{this.props.translate('send')}</button>;
)

export default withI18n(MyComponent);
```

Or you can use the `Translation` component.

```js
import { Translation } from '@teamleader/i18n';

const MyComponent = () => (
  <button><Translation id="send" /></button>;
)

export default MyComponent;
```

## Configuration

@todo

## License

[MIT](LICENSE).
