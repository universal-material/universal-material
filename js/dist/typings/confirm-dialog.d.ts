import { QuickDialog, QuickDialogConfig } from './quick-dialog';
export declare class ConfirmDialogConfig extends QuickDialogConfig {
    static readonly default: ConfirmDialogConfig;
    onConfirm?: Function;
    onCancel?: Function;
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
}
export declare class ConfirmDialog extends QuickDialog<ConfirmDialogConfig> {
    private readonly _message;
    static open(message: string, config?: ConfirmDialogConfig): ConfirmDialog;
    constructor(message: string, config?: ConfirmDialogConfig);
    protected _configureDialog(dialogElement: HTMLElement): void;
}
