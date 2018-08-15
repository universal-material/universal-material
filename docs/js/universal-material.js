var umd;
(function (umd) {
    var template = "\n<div class=\"dialog dialog-progress show\">\n  <div class=\"dialog-backdrop\"></div>\n  <div class=\"dialog-content\">\n    <div class=\"dialog-body\">\n      <div class=\"preloader-wrapper\">\n        <div class=\"spinner-layer\">\n          <div class=\"circle-clipper left\">\n            <div class=\"circle\"></div>\n          </div>\n          <div class=\"gap-patch\">\n            <div class=\"circle\"></div>\n          </div>\n          <div class=\"circle-clipper right\">\n            <div class=\"circle\"></div>\n          </div>\n        </div>\n      </div>\n      <div class=\"dialog-progress-message headline6 text-low-contrast text-nowrap\"></div>\n    </div>\n  </div>\n</div>";
    var ProgressDialog = (function () {
        function ProgressDialog() {
        }
        ProgressDialog.addAnimationEndEvents = function (dialog) {
            var _this = this;
            ProgressDialog.animationEvents.forEach(function (eventName) {
                dialog.addEventListener(eventName, ProgressDialog.onAnimationEnd.bind(_this));
            });
        };
        ProgressDialog.onAnimationEnd = function (event) {
            event.currentTarget.removeEventListener(event.type, ProgressDialog.onAnimationEnd);
            var element = event.currentTarget;
            document.body.removeChild(element.parentNode);
        };
        ProgressDialog.open = function (message) {
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
        ProgressDialog.animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
        return ProgressDialog;
    }());
    umd.ProgressDialog = ProgressDialog;
})(umd || (umd = {}));
var umd;
(function (umd) {
    umd.RippleContainersSelector = [
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
    var Ripple = (function () {
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
            var rippleContainers = document.querySelectorAll(umd.RippleContainersSelector);
            for (var i = 0; i < rippleContainers.length; i++) {
                new Ripple(rippleContainers[i]);
            }
        };
        return Ripple;
    }());
    umd.Ripple = Ripple;
})(umd || (umd = {}));
var umd;
(function (umd) {
    var Snackbar = (function () {
        function Snackbar() {
        }
        Snackbar.show = function (text, duration, buttonDefinition) {
            if (duration === void 0) { duration = SnackbarDuration.long; }
            Snackbar.snackbarQueue.push({
                text: text,
                duration: duration,
                buttonDefinition: buttonDefinition
            });
            if (!Snackbar.consuming) {
                Snackbar.consumeQueue();
            }
        };
        Snackbar.consumeQueue = function () {
            if (Snackbar.snackbarQueue.length) {
                Snackbar.consuming = true;
                Snackbar.showNext();
            }
        };
        Snackbar.showNext = function () {
            if (Snackbar.snackbarQueue.length) {
                var snackbarDefinition = Snackbar.snackbarQueue[0];
                Snackbar.snackbarQueue = Snackbar.snackbarQueue.slice(1);
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
                Snackbar.consuming = false;
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
            new umd.Ripple(snackbarButton);
            if (buttonDefinition.action) {
                snackbarButton.addEventListener("click", buttonDefinition.action);
            }
            return snackbarButton;
        };
        Snackbar.addAnimationEndEvents = function (snackbar) {
            var _this = this;
            Snackbar.animationEvents.forEach(function (eventName) {
                snackbar.addEventListener(eventName, Snackbar.onAnimationEnd.bind(_this));
            });
        };
        Snackbar.onAnimationEnd = function (event) {
            event.currentTarget.removeEventListener(event.type, Snackbar.onAnimationEnd);
            var element = event.currentTarget;
            element.parentNode.removeChild(element);
            Snackbar.showNext();
        };
        Snackbar.animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
        Snackbar.snackbarQueue = [];
        return Snackbar;
    }());
    umd.Snackbar = Snackbar;
    var SnackbarDuration;
    (function (SnackbarDuration) {
        SnackbarDuration[SnackbarDuration["short"] = 2500] = "short";
        SnackbarDuration[SnackbarDuration["long"] = 5000] = "long";
    })(SnackbarDuration = umd.SnackbarDuration || (umd.SnackbarDuration = {}));
    var SnackbarDefinition = (function () {
        function SnackbarDefinition() {
        }
        return SnackbarDefinition;
    }());
    umd.SnackbarDefinition = SnackbarDefinition;
    var SnackbarButtonDefinition = (function () {
        function SnackbarButtonDefinition() {
        }
        return SnackbarButtonDefinition;
    }());
    umd.SnackbarButtonDefinition = SnackbarButtonDefinition;
})(umd || (umd = {}));
var umd;
(function (umd) {
    var TextField = (function () {
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
    umd.TextField = TextField;
})(umd || (umd = {}));

//# sourceMappingURL=universal-material.js.map
