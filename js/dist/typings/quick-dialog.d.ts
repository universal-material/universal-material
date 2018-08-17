import { Dialog } from './dialog';
export declare class QuickDialogConfig {
    static default: QuickDialogConfig;
    closeOnBackdropClick?: boolean;
    closeOnEsc?: boolean;
}
export declare abstract class QuickDialog<T extends QuickDialogConfig> {
    private readonly _template;
    protected _config: T;
    protected _innerDialog: Dialog;
    protected constructor(template: string, config?: any, beforeCreateDialog?: Function);
    private _keyDownEvent;
    private _createDialog;
    protected abstract _configureDialog(dialogElement: HTMLElement): void;
    close(): void;
    protected _onClosed(): void;
    private _setEscapeEvent;
}
