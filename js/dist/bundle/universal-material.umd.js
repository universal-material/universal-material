(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['universal-material'] = {})));
}(this, (function (exports) { 'use strict';

  var template = "\n<div class=\"dialog dialog-progress show\">\n  <div class=\"dialog-backdrop\"></div>\n  <div class=\"dialog-content\">\n    <div class=\"dialog-title\"></div> \n    <div class=\"dialog-body\">\n      \n      <div class=\"dialog-progress-message headline6 text-low-contrast text-nowrap\"></div>\n    </div>\n  </div>\n</div>";
  var ConfirmDialog = /** @class */ (function () {
      function ConfirmDialog() {
      }
      ConfirmDialog.addAnimationEndEvents = function (dialog) {
          var _this = this;
          ConfirmDialog.animationEvents.forEach(function (eventName) {
              dialog.addEventListener(eventName, ConfirmDialog.onAnimationEnd.bind(_this));
          });
      };
      ConfirmDialog.onAnimationEnd = function (event) {
          event.currentTarget.removeEventListener(event.type, ConfirmDialog.onAnimationEnd);
          var element = event.currentTarget;
          document.body.removeChild(element.parentNode);
      };
      ConfirmDialog.open = function (message) {
          var _this = this;
          var dialogContainer = document.createElement("div");
          dialogContainer.innerHTML = template;
          dialogContainer.querySelector(".dialog-progress-message").innerText = message;
          var dialog = dialogContainer.querySelector('.dialog');
          document.body.appendChild(dialogContainer);
          return {
              close: function () {
                  dialog.classList.add('hide');
                  dialog.classList.remove('show');
                  _this.addAnimationEndEvents(dialog);
              }
          };
      };
      ConfirmDialog.animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
      return ConfirmDialog;
  }());

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

  var DialogOptions = /** @class */ (function () {
      function DialogOptions() {
      }
      DialogOptions["default"] = {
          disposeWhenClose: false
      };
      return DialogOptions;
  }());
  var Dialog = /** @class */ (function () {
      function Dialog(_dialogElement, dialogOptions) {
          var _this = this;
          this._dialogElement = _dialogElement;
          this.onAnimationEnd = function (event) {
              _this._dialogElement.removeEventListener(event.type, _this.onAnimationEnd);
              if (_this._dialogOptions.disposeWhenClose) {
                  document.body.removeChild(_this._dialogElement);
              }
              else {
                  _this._dialogElement.classList.remove('hide');
              }
          };
          this._dialogOptions = __assign({}, DialogOptions["default"], dialogOptions);
      }
      Dialog.prototype.addAnimationEndEvents = function () {
          var _this = this;
          Dialog._animationEvents.forEach(function (eventName) {
              _this._dialogElement.addEventListener(eventName, _this.onAnimationEnd.bind(_this));
          });
      };
      Dialog.attach = function (element, dialogOptions) {
          return new Dialog(element, dialogOptions);
      };
      Dialog.prototype.open = function () {
          this._dialogElement.classList.add('show');
      };
      Dialog.prototype.close = function () {
          this._dialogElement.classList.add('hide');
          this._dialogElement.classList.remove('show');
          this.addAnimationEndEvents();
      };
      Dialog._animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
      return Dialog;
  }());

  var template$1 = "\n<div class=\"dialog dialog-progress show\">\n  <div class=\"dialog-backdrop\"></div>\n  <div class=\"dialog-content\">\n    <div class=\"dialog-body\">\n      <div class=\"preloader-wrapper\">\n        <div class=\"spinner-layer\">\n          <div class=\"circle-clipper left\">\n            <div class=\"circle\"></div>\n          </div>\n          <div class=\"gap-patch\">\n            <div class=\"circle\"></div>\n          </div>\n          <div class=\"circle-clipper right\">\n            <div class=\"circle\"></div>\n          </div>\n        </div>\n      </div>\n      <div class=\"dialog-progress-message headline6 text-low-contrast text-nowrap\"></div>\n    </div>\n  </div>\n</div>";
  var ProgressDialog = /** @class */ (function () {
      function ProgressDialog() {
      }
      ProgressDialog.open = function (message) {
          var dialogContainer = document.createElement("div");
          dialogContainer.innerHTML = template$1;
          dialogContainer.querySelector(".dialog-progress-message").innerText = message;
          var dialog = dialogContainer.querySelector('.dialog');
          document.body.appendChild(dialogContainer);
          return Dialog.attach(dialog, {
              disposeWhenClose: true
          });
      };
      return ProgressDialog;
  }());

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

  exports.ConfirmDialog = ConfirmDialog;
  exports.ProgressDialog = ProgressDialog;
  exports.RippleContainersSelector = RippleContainersSelector;
  exports.Ripple = Ripple;
  exports.Snackbar = Snackbar;
  exports.SnackbarDefinition = SnackbarDefinition;
  exports.SnackbarButtonDefinition = SnackbarButtonDefinition;
  exports.TextField = TextField;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=universal-material.umd.js.map
