var TextField = /** @class */ (function () {
    function TextField(element) {
        var _this = this;
        var input = element.querySelector('input.text-input')
            || element.querySelector('textarea.text-input')
            || element.querySelector('.text-input input')
            || element.querySelector('.text-input textarea');
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
        }
        this.input = input;
        this.element = element;
        this.setEmpty();
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

//# sourceMappingURL=text-field.js.map
