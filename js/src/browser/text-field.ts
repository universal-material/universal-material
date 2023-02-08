import { TextFieldBase } from './text-field-base';

export class TextField {

  static initializeTextFields(): void {
    const textFields = document.querySelectorAll('.u-text-field:not(.u-chip-field)');
    for (let i = 0; i < textFields.length; i++) {
      const textField = textFields[i];
      new TextFieldBase(textField);
    }
  }
}
