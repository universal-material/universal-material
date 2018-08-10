export declare class TextField {
    element: Element;
    input: HTMLInputElement | HTMLTextAreaElement;
    constructor(element: Element);
    setEmpty(): void;
    static initializeTextFields(): void;
}
