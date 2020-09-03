const path = require('path');
const I18nPlugin = require('../lib');

const sampleTranslations = {
  '': {
    'project-id-version': 'version 0.0.1',
    'report-msgid-bugs-to': '',
    language: 'el_GR',
    'mime-version': '1.0',
    'content-type': 'text/plain; charset=UTF-8',
    'content-transfer-encoding': '8bit',
    'plural-forms': 'nplurals=2; plural=(n != 1);'
  },
  'test': [ 
    null, 
    'simple' 
  ],
  'test with n': [
    'test with ns',
    'one',
    'more'
  ],
  'test|hey': [ 
    null, 
    'hi' 
  ],
  'empty': [
    null,
    null
  ],
  'empty with n': [
    'empty with ns',
    null,
    null
  ],
  'empty|hey': [ 
    null, 
    null
  ],
}

module.exports = {
  entry: './fixtures/app.js',
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'bundle.js'
  },
  plugins: [new I18nPlugin(sampleTranslations)]
};
