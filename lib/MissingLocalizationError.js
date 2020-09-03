/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
class MissingLocalizationError extends Error {
  constructor(module, name) {
    super();

    Error.captureStackTrace(this, MissingLocalizationError);
    this.name = 'MissingLocalizationError';
    this.requests = [{ name: name }];
    this.module = module;
    // small workaround for babel
    Object.setPrototypeOf(this, MissingLocalizationError.prototype);
    this._buildMessage();
  }

  _buildMessage() {
    this.message = this.requests.map(function(request) {
      return 'Missing localization: ' + request.name;
    }).join('\n');
  }

  add(name) {
    for(let i = 0; i < this.requests.length; i++) {
      if (this.requests[i].name === name) return;
    }
    this.requests.push({ name: name });
    this._buildMessage();
  }

  static log(_module, text, hideMessage, failOnMissing) {
    hideMessage = (typeof hideMessage !== 'undefined' ? hideMessage : false);
    failOnMissing = (typeof failOnMissing !== 'undefined' ? failOnMissing : false);
    if (!hideMessage) {
      let error = _module[__dirname];
      if(!error) {
        error = _module[__dirname] = new MissingLocalizationError(_module, text);
        if (failOnMissing) {
          _module.errors.push(error);
        } else {
          _module.warnings.push(error);
        }
      } else if(error.requests.indexOf(text) < 0) {
        error.add(text);
      }
    }
  }
}

module.exports = MissingLocalizationError;
