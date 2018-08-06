class TextField {

    private readonly element: Element;
    private readonly input: HTMLInputElement;

    constructor(element) {
        const input = element.querySelector('input.text-input')
            || element.querySelector('textarea.text-input')
            || element.querySelector('.text-input input')
            || element.querySelector('.text-input textarea');

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
        }

        this.input = input;
        this.element = element;

        this.setEmpty();
    }

    setEmpty() {
        if (this.input.value) {
            this.element.classList.remove('empty')
        } else {
            this.element.classList.add('empty')
        }
    }

    static InitializeTextFields(): void {
        const textFields = document.querySelectorAll('.text-field');
        for (let i = 0; i < textFields.length; i++) {
            const textField = textFields[i];
            new TextField(textField);
        }
    }
}
