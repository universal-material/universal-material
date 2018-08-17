import { QuickDialog, QuickDialogConfig } from "./quick-dialog";
export declare class ProgressDialogConfig extends QuickDialogConfig {
    static readonly default: ProgressDialogConfig;
}
export declare class ProgressDialog extends QuickDialog<ProgressDialogConfig> {
    private readonly _message;
    static open(message: string, config?: ProgressDialogConfig): ProgressDialog;
    constructor(message: string, config?: ProgressDialogConfig);
    protected _configureDialog(dialogElement: HTMLElement): void;
}
