import { TextFieldBase } from './text-field-base';

export class ChipField {
  static initializeChipFields(): void {
    const chipFields = document.querySelectorAll('.u-chip-field');
    for (let i = 0; i < chipFields.length; i++) {
      const chipField = chipFields[i];
      // @ts-ignore
      new TextFieldBase(chipField, () => this.isEmpty() && !!this.element.querySelector('.u-chip'));
    }
  }
}
