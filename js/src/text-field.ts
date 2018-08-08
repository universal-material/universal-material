export class TextField {

    readonly element: Element;
    readonly input: HTMLInputElement | HTMLTextAreaElement;

    constructor(element: Element) {
        const input = element.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;

        if (input) {
            input.addEventListener('focus', () => {
                element.classList.add('focus');
            });

            input.addEventListener('blur', () => {
                element.classList.remove('focus');
            });

            input.addEventListener('input', () => {
                this.setEmpty();
            });

            element.addEventListener('click', () => {
                input.focus();
            });

            this.input = input;
            this.element = element;

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
