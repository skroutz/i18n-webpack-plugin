const I18nPlugin =  require('../lib');
const webpack = require('webpack');
const execSync = require('child_process').execSync;
const readFileSync = require('fs').readFileSync;
const options = require('../fixtures/webpack.config.js');

describe('i18nPlugin', function () {
  test('should export the loader', function () {
    expect(I18nPlugin).toBeInstanceOf(Function);
  });

  test('should define an apply method in its prototype', function () {
    expect(I18nPlugin.prototype.apply).toBeInstanceOf(Function);
  });

  test('should define a translate method in its prototype', function () {
    expect(I18nPlugin.prototype.translate).toBeInstanceOf(Function);
  });

  describe('in a webpack environment', function() {
    let webpackLog, outputBundle;

    beforeAll(async function() {
      webpackLog = execSync('npx webpack --config fixtures/webpack.config.js').toString();
      outputBundle = readFileSync('./fixtures/bundle.js').toString();
      await webpack(options, function(err, stats) {
  
        if (err) {
          console.log('There was an error: ' + err);
          process.exit(1);
        }
      }); 
    });

    test('produces a bundle file', function() {
      expect(outputBundle).not.toBe(undefined);
    });

    test('logs build information to console', function() {
      expect(webpackLog).not.toBe(undefined);
    });

    describe('embeds the correct internationalization output', function() {

      test('when called with __ and a known translation', function() {
        expect(outputBundle.indexOf('p:"simple"')).not.toBe(-1);
      });

      test('when called with n__, n===1 and a known translation', function() {
        expect(outputBundle.indexOf('n1:"one"')).not.toBe(-1);
      });

      test('when called with n__, n!==1 and a known translation', function() {
        expect(outputBundle.indexOf('nm:"more"')).not.toBe(-1);
      });

      test('when called with s__ and a known translation', function() {
        expect(outputBundle.indexOf('s:"hi"')).not.toBe(-1);
      });

      test('when called with __ and an empty translation', function() {
        expect(outputBundle.indexOf('ep:"empty"')).not.toBe(-1);
      });

      test('when called with n__, n===1 and an empty translation', function() {
        expect(outputBundle.indexOf('en1:"empty with n"')).not.toBe(-1);
      });

      test('when called with n__, n!==1 and an empty translation', function() {
        expect(outputBundle.indexOf('enm:"empty with ns"')).not.toBe(-1);
      });

      test('when called with s__ and an empty translation', function() {
        expect(outputBundle.indexOf('es:"empty|hey"')).not.toBe(-1);
      });

      test('when called with __ and an unlisted translation', function() {
        expect(outputBundle.indexOf('n:"yada"')).not.toBe(-1);
      });

    });

    describe('logs warnings', function() {

      test('points to the file where the issue occured', function() {
        expect(webpackLog.indexOf('WARNING in ./fixtures/app.js')).not.toBe(-1);
      });

      test('lists missing translations', function() {
        expect(webpackLog.indexOf('Missing localization: empty')).not.toBe(-1);
        expect(webpackLog.indexOf('Missing localization: empty with n')).not.toBe(-1);
        expect(webpackLog.indexOf('Missing localization: empty|hey')).not.toBe(-1);
        expect(webpackLog.indexOf('Missing localization: yada')).not.toBe(-1);
      });
    });
  });
});
