import { TextFieldBase } from './text-field-base';

export class ChipField {
  static initializeChipFields(): void {
    const chipFields = document.querySelectorAll('.u-chip-field');
    for (let i = 0; i < chipFields.length; i++) {
      const chipField = chipFields[i];
      // @ts-ignore
      new TextFieldBase(chipField, function () { return this.defaultIsEmpty() && !this.element.querySelector('.u-chip') });
    }
  }
}
