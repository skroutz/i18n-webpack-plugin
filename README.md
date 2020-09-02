<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg">
  </a>
  <h1>i18n Plugin</h1>
  <p>i18n (localization) plugin for Webpack.<p>
  <p>Forked from <a href="https://github.com/webpack-contrib/i18n-webpack-plugin">webpack-contrib/i18n-webpack-plugin</a>.</p>
</div>

### Installation

```bash
npm i -D @skroutz/i18n-webpack-plugin
```

Or

```bash
yarn add @skroutz/i18n-webpack-plugin -D
```

### Usage

This plugin creates bundles with translations baked in. So you can serve the translated bundle to your clients.

```
plugins: [
  ...
  new I18nPlugin(localization, options)
],
```

- `localization`: object, a key-value map of localization strings
- `options.isDefaultLocale`: boolean, is this language the default one

### Function reference

For functions that use `%{dynamicPart}`, you can extend the `String` prototype with a supplant method, like so:

```js
String.prototype.supplant = function(o) {
  return this.replace(
    /%\{([^{}]*)\}/g,
    (a, b) => {
      const r = o[b];
      return (typeof r === 'string' || typeof r === 'number') ? r : a;
    }
  );
};
```

Then, you can use the following functions in your code:

#### `__(msgid)` Basic translation method

Marks a string as translatable:

```js
__('Hello World!');
```

To translate a string with dynamic parts:

```js
__('Hello %{username}. Welcome to %{sitename}.').supplant({
  username: User.username,
  sitename: App.sitename
});
```

#### `n__(*msgid, n)` Pluralized translations

To return the singular or plural form depending on how many you have:

```js
n__('shop', 'shops', shop_count);
```

Additionally, to include the counter in the translated text:

```js
n__('%{stars_count} star', '%{stars_count} stars', Shop.rating.stars).supplant({
  stars_count: Shop.rating.stars
});
```

#### `s__(msgid)` Scoped translations

To provide context to the translation:

```js
s__('Gender|Female');
s__('Formal|Are you sure?');
s__('VolumetricUnit|kg');
```

### License

[MIT](http://www.opensource.org/licenses/mit-license.php)
