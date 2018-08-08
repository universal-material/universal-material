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

//# sourceMappingURL=text-field.js.map
