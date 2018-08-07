'use strict';

QUnit.module('text field plugin');

QUnit.test('should toggle focus', function (assert) {
    var focusEvent = new CustomEvent('focus');
    var blurEvent = new CustomEvent('blur');

    var container = document.createElement('div');

    var textFieldElement = document.createElement('div');
    textFieldElement.classList.add('text-field');
    container.appendChild(textFieldElement);

    var textInputElement = document.createElement('input');
    textInputElement.classList.add('text-input');
    textFieldElement.appendChild(textInputElement);

    new TextField(textFieldElement);

    assert.ok(!textFieldElement.classList.contains('focus'), 'text field does not have focus class');
    textInputElement.dispatchEvent(focusEvent);
    assert.ok(textFieldElement.classList.contains('focus'), 'text field has class focus');
    textInputElement.dispatchEvent(blurEvent);
    assert.ok(!textFieldElement.classList.contains('focus'), 'text field does not have focus class');
});

QUnit.test('should toggle empty', function (assert) {
    var focusEvent = new CustomEvent('focus');
    var blurEvent = new CustomEvent('blur');

    var container = document.createElement('div');

    var textFieldElement = document.createElement('div');
    textFieldElement.classList.add('text-field');
    container.appendChild(textFieldElement);

    var textInputElement = document.createElement('input');
    textInputElement.classList.add('text-input');
    textFieldElement.appendChild(textInputElement);

    new TextField(textFieldElement);

    assert.ok(textFieldElement.classList.contains('empty'), 'text field has class empty');
    textInputElement.value = 'some-value';
    assert.ok(textFieldElement.classList.contains('empty'), 'text field does not have empty class');
    textInputElement.value = '';
    assert.ok(textFieldElement.classList.contains('empty'), 'text field has class empty');
});