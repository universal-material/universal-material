export class TextField {

  element: Element;
  input: HTMLInputElement | HTMLTextAreaElement;

  constructor(element: Element) {
    const input = element.querySelector('input, textarea, .text-input') as HTMLInputElement | HTMLTextAreaElement;

    if (input) {
      input.addEventListener('focus', () => {
        element.classList.add('focus');
      });

      input.addEventListener('blur', () => {
        element.classList.remove('focus');
      });


      this.element = element;

      let prototype;

      if (input.nodeName.toLowerCase() === 'input') {
        prototype = HTMLInputElement.prototype;
      } else if (input.nodeName.toLowerCase() === 'textarea') {
        prototype = HTMLTextAreaElement.prototype;
      }

      if (!prototype) return;

      input.addEventListener('input', () => {
        this.setEmpty();
      });

      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
      const inputSetter = descriptor.set;
      descriptor.set = (val) => {

        //changing to native setter to prevent the loop while setting the value
        Object.defineProperty(input, "value", {set:inputSetter});
        input.value = val;

        this.setEmpty();

        //changing back to custom setter
        Object.defineProperty(input, "value", descriptor);
      };

      Object.defineProperty(input, "value", descriptor);

      this.input = input;

      this.setEmpty();
    }
  }

  setEmpty() {
    if (this.input.value) {
      this.element.classList.remove('empty')
    } else {
      this.element.classList.add('empty')
    }
  }

  static initializeTextFields(): void {
    const textFields = document.querySelectorAll('.text-field');
    for (let i = 0; i < textFields.length; i++) {
      const textField = textFields[i];
      new TextField(textField);
    }
  }
}
