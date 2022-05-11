## [6.3.0] - 2022-05-11

### Changed

- Bump react-intl dependency in order to specifically support react 16, 17 and 18.

## [6.2.0] - 2021-03-29

### Changed

- Do not transpile dynamic import statements to allow for code splitting.
- Bump @babel/cli, @babel/core, @babel/plugin-proposal-class-properties, @babel/plugin-proposal-export-default-from, @babel/plugin-proposal-export-namespace-from, @babel/plugin-proposal-object-rest-spread, @babel/plugin-syntax-dynamic-import, @babel/preset-env, @babel/preset-flow and @babel/preset-react

## [6.1.0] - 2021-01-19

### Added

- Support a fallback component to render while fetching translations

## [6.0.0] - 2020-11-03

### Fixed

- Return translation ids when debug flag is set to true

## [5.0.0] - 2020-09-14

### Fixed

- Intl.PluralRules and Intl.RelativeTimeFormat polyfills not being loaded correctly ([@ArnaudWeyts](https://github.com/ArnaudWeyts) in [#19](https://github.com/teamleadercrm/i18n/pull/19))

### Changed

- Bump @formatjs polyfill packages to latest version ([@ArnaudWeyts](https://github.com/ArnaudWeyts) in [#19](https://github.com/teamleadercrm/i18n/pull/19))
- **Breaking**: bump react-intl from 4.x.x to 5.x.x, see [react-intl changelog](https://github.com/formatjs/formatjs/blob/main/packages/react-intl/CHANGELOG.md#500-2020-07-03) before upgrading ([@ArnaudWeyts](https://github.com/ArnaudWeyts) in [#19](https://github.com/teamleadercrm/i18n/pull/19))

## [4.0.1] - 2020-03-30

### Fixed

- Expose FormattedRelativeTime and formatRelativeTime correctly

## [4.0.0] - 2020-03-18

### Changed

- Major upgrade of react-intl to support HTML formatted messages ([@sanderbrugge](https://github.com/sanderbrugge) in [#13](https://github.com/teamleadercrm/i18n/pull/13))

## [3.0.1] - 2019-07-24

### Security

- Minor update of @babel/cli
- Minor update of @babel/core
- Minor update of @babel/plugin-proposal-class-properties
- Minor update of @babel/plugin-proposal-export-default-from
- Minor update of @babel/plugin-proposal-export-namespace-from
- Minor update of @babel/plugin-proposal-object-rest-spread
- Minor update of @babel/preset-env

## [3.0.0] - 2019-04-01

### Added

- Export wrapped FormattedDate from react-intl
- Export wrapped FormattedTime from react-intl
- Export wrapped FormattedRelative from react-intl
- Export wrapped FormattedNumber from react-intl
- Export wrapped FormattedPlural from react-intl
- Export wrapped FormattedHtmlMessage from react-intl
- Export and inject formatPlural into 'withI18n' from react-intl
- Export and inject formatTime into 'withI18n' from react-intl
- Export and inject formatHtmlMessage into 'withI18n' from react-intl
- Export and inject formatNumber into 'withI18n' from react-intl
- Export and inject formatRelative into 'withI18n' from react-intl

### Changed

- Map translationId for the Translation component through a mapProps function

### Breaking

- Exported type Translate has been renamed to StringFormatter
- Exported type FormatDate has been renamed to Formatter

## [2.2.0] - 2019-03-20

### Added

- Add a debug mode which, when enabled, will print the translation IDs instead of the actual translations.

## [2.1.0] - 2019-03-08

### Changed

- Locale data from `react-intl` is now loaded with a dynamic import (`import()`). So the data will be loaded asynchronously now, instead of putting all the locale data into your bundle. This makes your bundle much smaller.

## [2.0.3] - 2019-02-27

### Security

- Minor update of @babel/cli
- Minor update of @babel/core
- Minor update of @babel/plugin-proposal-class-properties
- Minor update of @babel/plugin-proposal-export-default-from
- Minor update of @babel/plugin-proposal-export-namespace-from
- Minor update of @babel/plugin-proposal-object-rest-spread
- Minor update of @babel/preset-env
- Patch update of babel-plugin-transform-imports
- Patch update of babel-plugin-transform-react-remove-prop-types

## [2.0.2] - 2019-02-01

### Changed

- Rename 'language' prop to 'locale'. (added in [#4](https://github.com/teamleadercrm/i18n/pull/4))
- Default locale is now 'en-GB' instead of 'en'. (added in [#4](https://github.com/teamleadercrm/i18n/pull/4))
- Support passing locale codes (e.g. 'nl-BE'). (added in [#4](https://github.com/teamleadercrm/i18n/pull/4))

## [1.0.1] - 2018-10-04

### Added

- Flow types for `withI18n`. ([@nickwaelkens](https://github.com/nickwaelkens) in [#2](https://github.com/teamleadercrm/i18n/pull/2))

## [1.0.0] - 2018-08-30

### Changed

- Initial changelog
