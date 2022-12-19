export class TextFieldBase {

  element: Element;
  private readonly isEmptyOverride?: () => boolean;
  input: HTMLInputElement | HTMLTextAreaElement;

  constructor(element: Element, isEmptyOverride?: (element: HTMLElement) => boolean) {
    const input = element.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;

    if (!input) {
      return;
    }

    if (isEmptyOverride) {
      this.isEmptyOverride = isEmptyOverride.bind(this);
    }

    input.addEventListener('focus', () => element.classList.add('focus'));
    input.addEventListener('blur', () => element.classList.remove('focus'));

    this.element = element;

    let prototype;

    if (input.nodeName.toLowerCase() === 'input') {
      prototype = HTMLInputElement.prototype;
    } else if (input.nodeName.toLowerCase() === 'textarea') {
      prototype = HTMLTextAreaElement.prototype;
    }

    if (!prototype) return;

    input.addEventListener('input', () => this.setEmpty());

    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    const inputSetter = descriptor.set;
    descriptor.set = val => {

      //changing to native setter to prevent the loop while setting the value
      Object.defineProperty(input, "value", {set: inputSetter});
      input.value = val;

      this.setEmpty();

      //changing back to custom setter
      Object.defineProperty(input, "value", descriptor);
    };

    Object.defineProperty(input, "value", descriptor);
    this.input = input;
    this.setEmpty();
  }

  setEmpty() {
    if (this.isEmpty()) {
      this.element.classList.remove('empty');
      return;
    }

    this.element.classList.add('empty');
  }

  isEmpty(): boolean {
    if (this.isEmptyOverride) {
      return this.isEmptyOverride();
    }

    return !!this.input.value;
  }
}
