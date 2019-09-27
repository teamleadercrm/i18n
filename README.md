# @teamleader/i18n [![npm version](https://badge.fury.io/js/%40teamleader%2Fi18n.svg)](https://badge.fury.io/js/%40teamleader%2Fi18n)

This project is a wrapper around [react-intl](https://github.com/formatjs/react-intl) that provides some additional functionality for working with translation in Teamleaders front-end microservices. [Read more about the reasoning here](#why-this-wrapper)

Teamleader i18n implementation for our frontend micro service, built with `react-intl` (in a hacky way).

## Installation

```bash
# Using npm
npm i -S @teamleader/i18n

# Using yarn
yarn add @teamleader/i18n
```

## Usage

### I18nProvider

To be able to use the translation functionality, you have to wrap your application with the provider that this package exposes.

React Intl uses the provider pattern to scope an i18n context to a tree of components. This package adds another layout above their provider to be able to extend it.

```js
import { I18nProvider } from '@teamleader/i18n';

ReactDOM.render(
  <I18nProvider namespace="domains.invoicing" path="/" locale="en">
    <TheRestOfYourApp />
  </I18nProvider>,
  document.getElementById('container'),
);
```

This will now enable you to use translations in your components.

### Configuration of the provider

The `I18nProvider` comes with a few props that enable you to customize the provider.

#### `namespace?: string`

If this optional parameter is set, the translation keys will be prefixed with this namespace. For example, if your namespace is `invoicing`, an example translation key would be `invoicing.myTranslationKey`.

#### `locale?: string`

The locale that should be used. If you don't provide a locale it will try to get it from the html element (`<html lang="en">`) and will fallback to english (`en`);

#### `path?: string | (language: string) => string`

The path to the translation files. This can be either a string or a function. If you provide a string, the file name will be added to the path. If you use a function, it will call the function and pass the language as a paramter. The function should return a the path to the translation file as a string.

**Providing a string for path**

```js
import { I18nProvider } from '@teamleader/i18n';

// This will try to fetch the translation strings `/translations/en.json`
ReactDOM.render(
  <I18nProvider path="/translations/" locale="en">
    <TheRestOfYourApp />
  </I18nProvider>,
  document.getElementById('container'),
);
```

**Providing a function for path**

```js
import { I18nProvider } from '@teamleader/i18n';

const getPath = language => (language === 'it' ? `/translations/it.json` : `/translations/en.json`);

/**
 * This will try to fetch the translation strings `/translations/it.json` if
 * the language is `it` and fallback to `/translations/en.json` in all other
 * cases
 */
ReactDOM.render(
  <I18nProvider path={getPath} locale="en">
    <TheRestOfYourApp />
  </I18nProvider>,
  document.getElementById('container'),
);
```

#### `debug?: boolean`

If this boolean is set to `true` the message keys will be returned instead of the actual translations.

---

Once you have set up the provider, there are several ways that you can access your translations within your application.

### withI18n

You can use the `withI18n` HOC which will provide a `translate` function to your component props.

```js
import { withI18n } from '@teamleader/i18n';

const  MyComponent = () => (
  <button>{this.props.translate('send')}</button>;
)

export default withI18n(MyComponent);
```

### `translate()` outside of components

Once you have your provider set up, you can also import the `translate()` method and use it outside of your component.

```js
import { translate } from `@teamleader/i18n`

const translation = translate('send')
```

### The `Translation` component

You can also use the `Translation` component to translate your strings.

```js
import { Translation } from '@teamleader/i18n';

const MyComponent = () => (
  <button><Translation id="send" /></button>;
)

export default MyComponent;
```

## Why this wrapper

In a basic React application, you won't need this wrapper at all, you be able to work with `react-intl` itself.

`react-intl` however has the limitation that translations only work within React components. But in our project, we sometimes had the need of translated strings outside of the components (eg. in sagas or reducers).

This package exposes some of the functions of `react-intl` to the outer world, so that you can get translated strings from everywhere.

Additionally, this package adds functionality to fetch translation messages asynchronously.

## License

[MIT](LICENSE).
