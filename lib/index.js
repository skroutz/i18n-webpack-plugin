const ConstDependency = require('webpack/lib/dependencies/ConstDependency');
const NullFactory = require('webpack/lib/NullFactory');
const MissingLocalizationError = require('./MissingLocalizationError');

function nFunction(singular, plural) {
  return '(function(s,p,c) { return c !== 1 ? p : s })('+JSON.stringify(singular)+','+JSON.stringify(plural);
}

function translatedDependency(result, expression, range) {
  const dep = new ConstDependency(result, range || expression.range);
  dep.loc = expression.loc;

  return dep;
}

class I18nPlugin {
  constructor(localization, options) {
    options = options || {};
    this.localization = localization;
    this.isDefaultLocale = options.isDefaultLocale || false;
  }

  apply(compiler) {
    const _this = this;

    compiler.hooks.compilation.tap(
      'I18nPlugin', 
      function(compilation, data) {
        compilation.dependencyFactories.set(ConstDependency, new NullFactory());
        compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());

        data.normalModuleFactory.hooks.parser
          .for('javascript/auto')
          .tap('I18nPlugin', function(parser, options) {
            parser.plugin('call __', function(expr) {
              return _this.translate(this, expr);
            });

            parser.plugin('call s__', function(expr) {
              return _this.translate(this, expr);
            });

            parser.plugin('call n__', function(expr) {
              return _this.translate(this, expr);
            });
          });
      }
    );
  };

  translate(parserContext, expression) {
    if (!expression.arguments) return;

    const methodName = expression.callee.name;

    let translationKey = parserContext.evaluateExpression(expression.arguments[0]);
    if(!translationKey.isString()) return;

    let textReplacement, range, singular, plural;

    translationKey = translationKey.string;

    const translations = this.localization[translationKey];

    // Fetch singular
    if (this.isDefaultLocale) {
      singular = translationKey;
    } else if (translations && translations[1]) {
      singular = translations[1];
    } else {
      singular = translationKey;
      MissingLocalizationError.log(parserContext.state.module, translationKey);
    }

    // Fetch plural
    if (methodName === 'n__') {
      let pluralKey = parserContext.evaluateExpression(expression.arguments[1]);
      pluralKey = pluralKey.isString() ? pluralKey.string : null;

      if (this.isDefaultLocale) {
        if (pluralKey) {
          plural = pluralKey;
        } else {
          plural = singular;
          MissingLocalizationError.log(parserContext.state.module, translationKey);
        }
      } else {
        if (translations && translations[2]) {
          plural = translations[2];
        } else {
          plural = pluralKey || singular;
          MissingLocalizationError.log(parserContext.state.module, translationKey);
        }
      }
    }

    if (methodName === 'n__') {
      textReplacement = nFunction(singular, plural);
      range = [expression.start, expression.arguments[1].end];
    } else if (methodName === 's__' && this.isDefaultLocale) {
      textReplacement = JSON.stringify(singular.replace(/(.*?)\|/, ''));
    } else {
      textReplacement = JSON.stringify(singular);
    }

    parserContext.state.current.addDependency(translatedDependency(textReplacement, expression, range));
    return true;
  }
}

module.exports = I18nPlugin;
