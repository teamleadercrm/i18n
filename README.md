# @teamleader/i18n [![npm version](https://badge.fury.io/js/%40teamleader%2Fi18n.svg)](https://badge.fury.io/js/%40teamleader%2Fi18n)

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
  <I18nProvider namespace="domains.invoicing" path="/" locale="en">
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

You can configure the `Provider` with a few props.

### `namespace`: String (optional)

The translation keys will be prefixed with the namespace. For example, if your namespace is `invoicing`, an example translation key would be `invoicing.myTranslationKey`.

### `locale` String (optional)

The locale that should be used. If you don't provide a locale it will try to get it from the html element (`<html lang="en">`) and will fallback to english (`en`);

### `path`: String | Function (optional)

The path to the translation files. This can be either a string or a function. If you provide a string, the file name will be added to the path. If you use a function, it will call the function and pass the language as a paramter. The function should return a the path to the translation file as a string.

Example with a string:

```js
import { Provider as I18nProvider } from '@teamleader/i18n';

const App = () => (
  <I18nProvider namespace="domains.invoicing" path="/translations/" language="en">
    <TheRestOfYourApp />
  </I18nProvider>
);
```

Example with a function:

```js
import { Provider as I18nProvider } from '@teamleader/i18n';

const getPath = language => `/translations/${language}.json`;

const App = () => (
  <I18nProvider namespace="domains.invoicing" path={getPath} language="en">
    <TheRestOfYourApp />
  </I18nProvider>
);
```

## License

[MIT](LICENSE).
