export declare class DropdownConfig {
    static readonly default: DropdownConfig;
}
export declare class Dropdown {
    private readonly _dropdownElement;
    private readonly _dropdownConfig;
    private readonly _dropdownToggle;
    private readonly _dropdownMenu;
    private _showing;
    constructor(_dropdownElement: HTMLElement, dropdownConfig: DropdownConfig);
    static attach(element: HTMLElement, dropdownConfig?: DropdownConfig): Dropdown;
    _attachEvents(): void;
    toggle: () => void;
    open: () => void;
    close: () => void;
    static initializeDropdowns(): void;
}
