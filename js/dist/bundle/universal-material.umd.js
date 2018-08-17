(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['universal-material'] = {})));
}(this, (function (exports) { 'use strict';

  (function () {
      if (typeof window['CustomEvent'] === "function")
          return;
      function CustomEvent(event, params) {
          params = params || { bubbles: false, cancelable: false, detail: undefined };
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
      }
      CustomEvent.prototype = window['Event'].prototype;
      window['CustomEvent'] = CustomEvent;
  })();

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  var DialogConfig = /** @class */ (function () {
      function DialogConfig() {
      }
      DialogConfig["default"] = {
          destroyWhenClose: false
      };
      return DialogConfig;
  }());
  var closedEvent = new CustomEvent('closed');
  var dialogBodyTopDividerClassName = 'dialog-body-top-divider';
  var dialogBodyBottomDividerClassName = 'dialog-body-bottom-divider';
  var Dialog = /** @class */ (function () {
      function Dialog(_dialogElement, dialogConfig) {
          var _this = this;
          this._dialogElement = _dialogElement;
          this.onAnimationEnd = function (event) {
              _this._dialogElement.removeEventListener(event.type, _this.onAnimationEnd);
              _this._dialogElement.dispatchEvent(closedEvent);
              if (_this._dialogConfig.destroyWhenClose) {
                  _this._dialogElement.parentNode.removeChild(_this._dialogElement);
              }
              else {
                  _this._dialogElement.classList.remove('hide');
              }
          };
          this._dialogConfig = __assign({}, DialogConfig["default"], dialogConfig);
          this._dialogBodyElement = this._dialogElement.querySelector('.dialog-body');
          if (this._dialogBodyElement) {
              this._setBodyDividers();
              this._setDialogBodyScrollHandler();
          }
      }
      Dialog.prototype.addAnimationEndEvents = function () {
          var _this = this;
          Dialog._animationEvents.forEach(function (eventName) {
              _this._dialogElement.addEventListener(eventName, _this.onAnimationEnd.bind(_this));
          });
      };
      Dialog.attach = function (element, dialogConfig) {
          return new Dialog(element, dialogConfig);
      };
      Dialog.prototype.open = function () {
          this._dialogElement.classList.add('show');
      };
      Dialog.prototype.close = function () {
          this._dialogElement.classList.add('hide');
          this._dialogElement.classList.remove('show');
          this.addAnimationEndEvents();
      };
      Dialog.prototype._setBodyDividers = function () {
          if (this._dialogBodyElement.scrollTop) {
              this._dialogElement.classList.add(dialogBodyTopDividerClassName);
          }
          else {
              this._dialogElement.classList.remove(dialogBodyTopDividerClassName);
          }
          var scrollBottom = this._dialogBodyElement.scrollTop + this._dialogBodyElement.offsetHeight;
          if (scrollBottom !== this._dialogBodyElement.scrollHeight) {
              this._dialogElement.classList.add(dialogBodyBottomDividerClassName);
          }
          else {
              this._dialogElement.classList.remove(dialogBodyBottomDividerClassName);
          }
      };
      Dialog.prototype._setDialogBodyScrollHandler = function () {
          this._dialogBodyElement.addEventListener('scroll', this._setBodyDividers.bind(this), true);
      };
      Dialog._animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
      return Dialog;
  }());

  var EscapeKeyCode = 27;
  var QuickDialogConfig = /** @class */ (function () {
      function QuickDialogConfig() {
      }
      QuickDialogConfig["default"] = {
          closeOnBackdropClick: true,
          closeOnEsc: true
      };
      return QuickDialogConfig;
  }());
  var QuickDialog = /** @class */ (function () {
      function QuickDialog(template, config, beforeCreateDialog) {
          var _this = this;
          this._keyDownEvent = function (event) {
              if (event.which === EscapeKeyCode) {
                  _this._innerDialog.close();
                  event.preventDefault();
              }
          };
          this._template = template;
          this._config = __assign({}, QuickDialogConfig["default"], config);
          if (beforeCreateDialog)
              beforeCreateDialog();
          this._createDialog();
      }
      QuickDialog.prototype._createDialog = function () {
          var _this = this;
          var dialogContainer = document.createElement('div');
          dialogContainer.innerHTML = this._template;
          var dialogElement = dialogContainer.querySelector('.dialog');
          this._configureDialog(dialogElement);
          document.body.appendChild(dialogContainer);
          dialogElement.addEventListener('closed', function () {
              document.body.removeChild(dialogContainer);
              document.body.removeEventListener('keydown', _this._keyDownEvent, true);
              _this._onClosed();
          });
          this._innerDialog = Dialog.attach(dialogElement, {
              destroyWhenClose: true
          });
          if (this._config.closeOnEsc) {
              this._setEscapeEvent();
          }
          if (this._config.closeOnBackdropClick) {
              dialogElement
                  .querySelector('.dialog-backdrop')
                  .addEventListener('click', function () { return _this._innerDialog.close(); }, true);
          }
      };
      QuickDialog.prototype.close = function () {
          this._innerDialog.close();
      };
      QuickDialog.prototype._onClosed = function () {
      };
      QuickDialog.prototype._setEscapeEvent = function () {
          document.body.addEventListener('keydown', this._keyDownEvent, true);
      };
      return QuickDialog;
  }());

  var ConfirmDialogConfig = /** @class */ (function (_super) {
      __extends(ConfirmDialogConfig, _super);
      function ConfirmDialogConfig() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      ConfirmDialogConfig["default"] = __assign({ confirmLabel: "Ok", cancelLabel: "Cancel" }, QuickDialogConfig["default"]);
      return ConfirmDialogConfig;
  }(QuickDialogConfig));
  var confirmDialogTemplate = "\n<div class=\"dialog show\">\n  <div class=\"dialog-backdrop\"></div>\n  <div class=\"dialog-content\">\n    <div class=\"dialog-title\"></div>\n    <div class=\"dialog-body\"></div>\n    <div class=\"dialog-actions\">\n      <button type=\"button\" class=\"btn-flat btn-primary\" confirmButton></button>\n      <button type=\"button\" class=\"btn-flat btn-primary\" cancelButton></button>\n    </div>\n  </div>\n</div>";
  var ConfirmDialog = /** @class */ (function (_super) {
      __extends(ConfirmDialog, _super);
      function ConfirmDialog(message, config) {
          var _this = _super.call(this, confirmDialogTemplate, __assign({}, ConfirmDialogConfig["default"], { _message: message }, config)) || this;
          _this._message = message;
          return _this;
      }
      ConfirmDialog.open = function (message, config) {
          return new ConfirmDialog(message, config);
      };
      ConfirmDialog.prototype._configureDialog = function (dialogElement) {
          var _this = this;
          var titleElement = dialogElement.querySelector('.dialog-title');
          if (this._config.title) {
              titleElement.innerText = this._config.title;
          }
          else {
              titleElement.parentNode.removeChild(titleElement);
          }
          dialogElement.querySelector('.dialog-body').innerText = this._config['_message'];
          var confirmButton = dialogElement.querySelector('[confirmButton]');
          var cancelButton = dialogElement.querySelector('[cancelButton]');
          confirmButton.innerText = this._config.confirmLabel;
          cancelButton.innerText = this._config.cancelLabel;
          confirmButton.addEventListener('click', function () {
              _this._innerDialog.close();
              if (_this._config.onConfirm)
                  _this._config.onConfirm();
          });
          cancelButton.addEventListener('click', function () {
              _this._innerDialog.close();
              if (_this._config.onCancel)
                  _this._config.onCancel();
          });
      };
      return ConfirmDialog;
  }(QuickDialog));

  var ProgressDialogConfig = /** @class */ (function (_super) {
      __extends(ProgressDialogConfig, _super);
      function ProgressDialogConfig() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      ProgressDialogConfig["default"] = __assign({}, QuickDialogConfig["default"], { closeOnBackdropClick: false, closeOnEsc: false });
      return ProgressDialogConfig;
  }(QuickDialogConfig));
  var progressDialogTemplate = "\n<div class=\"dialog dialog-progress show\">\n  <div class=\"dialog-backdrop\"></div>\n  <div class=\"dialog-content\">\n    <div class=\"dialog-body\">\n      <div class=\"preloader-wrapper\">\n        <div class=\"spinner-layer\">\n          <div class=\"circle-clipper left\">\n            <div class=\"circle\"></div>\n          </div>\n          <div class=\"gap-patch\">\n            <div class=\"circle\"></div>\n          </div>\n          <div class=\"circle-clipper right\">\n            <div class=\"circle\"></div>\n          </div>\n        </div>\n      </div>\n      <div class=\"dialog-progress-message headline6 text-low-contrast text-nowrap\"></div>\n    </div>\n  </div>\n</div>";
  var ProgressDialog = /** @class */ (function (_super) {
      __extends(ProgressDialog, _super);
      function ProgressDialog(message, config) {
          var _this = _super.call(this, progressDialogTemplate, __assign({}, ProgressDialogConfig["default"], { _message: message }, config)) || this;
          _this._message = message;
          return _this;
      }
      ProgressDialog.open = function (message, config) {
          return new ProgressDialog(message, config);
      };
      ProgressDialog.prototype._configureDialog = function (dialogElement) {
          var message = this._config['_message'];
          if (message) {
              dialogElement.querySelector('.dialog-progress-message').innerText = message;
          }
          else {
              dialogElement.querySelector('.dialog-progress-message').style.display = 'none';
          }
      };
      return ProgressDialog;
  }(QuickDialog));

  var RippleContainersSelector = [
      '.btn',
      '.btn-flat',
      '.btn-borderless',
      '.btn-solid',
      '.btn-raised',
      '.btn-outline',
      '.list-hover .list-item',
      '.list-item .list-item-hover',
      '.tab',
      '.dropdown-item',
      '.radio .selection-control',
      '.checkbox .selection-control',
      '.switch .check-indicator',
      '.chip-remove',
      '.chip-hover'
  ].join(',');
  var Ripple = /** @class */ (function () {
      function Ripple(element) {
          var _this = this;
          this.disabled = false;
          if (window.getComputedStyle(element).position !== "absolute" && window.getComputedStyle(element).position !== "fixed") {
              element.style.position = "relative";
          }
          var isTouching = false;
          element.addEventListener('mousedown', function (e) {
              if (!isTouching) {
                  _this.createRipple(element, 'mouseup', null, e.clientX, e.clientY);
              }
          });
          element.addEventListener('touchstart', function (e) {
              isTouching = true;
              _this.createRipple(element, 'touchend', function () {
                  setTimeout(function () {
                      isTouching = false;
                  }, 100);
              }, e.touches[0].clientX, e.touches[0].clientY);
          });
      }
      Ripple.prototype.createRipple = function (rippleContainer, releaseEventName, releaseCallback, pageX, pageY) {
          if (this.disabled)
              return;
          var rippleWrapper = document.createElement('DIV');
          rippleWrapper.classList.add('ripple-wrapper');
          var ripple = document.createElement('DIV');
          ripple.classList.add('ripple');
          rippleWrapper.appendChild(ripple);
          rippleContainer.insertAdjacentElement('afterbegin', rippleWrapper);
          var release = function () {
              ripple.classList.add('dismiss');
              if (releaseCallback) {
                  releaseCallback();
              }
          };
          window.addEventListener(releaseEventName, release);
          rippleContainer.addEventListener("dragover", release);
          ripple.addEventListener('transitionend', function () {
              if (ripple.classList.contains('dismiss')) {
                  rippleContainer.removeChild(rippleWrapper);
                  rippleContainer.removeEventListener("dragover", release);
                  window.removeEventListener(releaseEventName, release);
              }
          });
          requestAnimationFrame(function () {
              var clientRect = rippleContainer.getBoundingClientRect();
              var largestDimensionSize = Math.max(rippleWrapper.clientWidth, rippleWrapper.clientHeight);
              var rippleSize = largestDimensionSize * 2;
              ripple.style.width = rippleSize + 'px';
              ripple.style.height = rippleSize + 'px';
              ripple.style.marginLeft = -rippleSize / 2 + 'px';
              ripple.style.marginTop = -rippleSize / 2 + 'px';
              ripple.style.transitionDuration = (1080 * Math.pow(rippleSize, 0.3)) + 'ms, 750ms';
              var x = (pageX - clientRect.left) + ((rippleSize - rippleContainer.clientWidth) / 2);
              var y = (pageY - clientRect.top) + ((rippleSize - rippleContainer.clientHeight) / 2);
              ripple.style.transformOrigin = x + "px " + y + "px";
              ripple.classList.add('show');
          });
      };
      Ripple.initializeRipples = function () {
          var rippleContainers = document.querySelectorAll(RippleContainersSelector);
          for (var i = 0; i < rippleContainers.length; i++) {
              new Ripple(rippleContainers[i]);
          }
      };
      return Ripple;
  }());

  var Snackbar = /** @class */ (function () {
      function Snackbar() {
      }
      Snackbar.show = function (text, duration, buttonDefinition) {
          if (duration === void 0) { duration = exports.SnackbarDuration.long; }
          Snackbar._snackbarQueue.push({
              text: text,
              duration: duration,
              buttonDefinition: buttonDefinition
          });
          if (!Snackbar._consuming) {
              Snackbar.consumeQueue();
          }
      };
      Snackbar.consumeQueue = function () {
          if (Snackbar._snackbarQueue.length) {
              Snackbar._consuming = true;
              Snackbar.showNext();
          }
      };
      Snackbar.showNext = function () {
          if (Snackbar._snackbarQueue.length) {
              var snackbarDefinition = Snackbar._snackbarQueue[0];
              Snackbar._snackbarQueue = Snackbar._snackbarQueue.slice(1);
              var snackbar_1 = Snackbar.createSnackbar();
              snackbar_1.appendChild(Snackbar.createSnackbarText(snackbarDefinition.text));
              if (snackbarDefinition.buttonDefinition) {
                  var snackbarButton = Snackbar.createButton(snackbarDefinition.buttonDefinition);
                  snackbar_1.appendChild(snackbarButton);
              }
              document.body.appendChild(snackbar_1);
              setTimeout(function () {
                  snackbar_1.classList.add("dismiss");
                  Snackbar.addAnimationEndEvents(snackbar_1);
              }, snackbarDefinition.duration);
          }
          else {
              Snackbar._consuming = false;
          }
      };
      Snackbar.createSnackbar = function () {
          var snackbar = document.createElement("div");
          snackbar.className = "snackbar";
          return snackbar;
      };
      Snackbar.createSnackbarText = function (text) {
          var snackbarText = document.createElement("div");
          snackbarText.innerText = text;
          snackbarText.className = "snackbar-text";
          return snackbarText;
      };
      Snackbar.createButton = function (buttonDefinition) {
          var snackbarButton = document.createElement("button");
          snackbarButton.type = "button";
          snackbarButton.className = "btn-flat btn-secondary";
          snackbarButton.innerText = buttonDefinition.text;
          new Ripple(snackbarButton);
          if (buttonDefinition.action) {
              snackbarButton.addEventListener("click", buttonDefinition.action);
          }
          return snackbarButton;
      };
      Snackbar.addAnimationEndEvents = function (snackbar) {
          var _this = this;
          Snackbar._animationEvents.forEach(function (eventName) {
              snackbar.addEventListener(eventName, Snackbar.onAnimationEnd.bind(_this));
          });
      };
      Snackbar.onAnimationEnd = function (event) {
          event.currentTarget.removeEventListener(event.type, Snackbar.onAnimationEnd);
          var element = event.currentTarget;
          element.parentNode.removeChild(element);
          Snackbar.showNext();
      };
      Snackbar._animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
      Snackbar._snackbarQueue = [];
      return Snackbar;
  }());
  (function (SnackbarDuration) {
      SnackbarDuration[SnackbarDuration["short"] = 2500] = "short";
      SnackbarDuration[SnackbarDuration["long"] = 5000] = "long";
  })(exports.SnackbarDuration || (exports.SnackbarDuration = {}));
  var SnackbarDefinition = /** @class */ (function () {
      function SnackbarDefinition() {
      }
      return SnackbarDefinition;
  }());
  var SnackbarButtonDefinition = /** @class */ (function () {
      function SnackbarButtonDefinition() {
      }
      return SnackbarButtonDefinition;
  }());

  var TextField = /** @class */ (function () {
      function TextField(element) {
          var _this = this;
          var input = element.querySelector('input, textarea');
          if (input) {
              input.addEventListener('focus', function () {
                  element.classList.add('focus');
              });
              input.addEventListener('blur', function () {
                  element.classList.remove('focus');
              });
              input.addEventListener('input', function () {
                  _this.setEmpty();
              });
              element.addEventListener('click', function () {
                  input.focus();
              });
              this.input = input;
              this.element = element;
              this.setEmpty();
          }
      }
      TextField.prototype.setEmpty = function () {
          if (this.input.value) {
              this.element.classList.remove('empty');
          }
          else {
              this.element.classList.add('empty');
          }
      };
      TextField.initializeTextFields = function () {
          var textFields = document.querySelectorAll('.text-field');
          for (var i = 0; i < textFields.length; i++) {
              var textField = textFields[i];
              new TextField(textField);
          }
      };
      return TextField;
  }());

  exports.DialogConfig = DialogConfig;
  exports.Dialog = Dialog;
  exports.ConfirmDialogConfig = ConfirmDialogConfig;
  exports.ConfirmDialog = ConfirmDialog;
  exports.ProgressDialogConfig = ProgressDialogConfig;
  exports.ProgressDialog = ProgressDialog;
  exports.QuickDialogConfig = QuickDialogConfig;
  exports.QuickDialog = QuickDialog;
  exports.RippleContainersSelector = RippleContainersSelector;
  exports.Ripple = Ripple;
  exports.Snackbar = Snackbar;
  exports.SnackbarDefinition = SnackbarDefinition;
  exports.SnackbarButtonDefinition = SnackbarButtonDefinition;
  exports.TextField = TextField;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=universal-material.umd.js.map
