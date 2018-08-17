export declare class DialogConfig {
    static readonly default: DialogConfig;
    destroyWhenClose?: boolean;
}
export declare class Dialog {
    private readonly _dialogElement;
    private static readonly _animationEvents;
    private readonly _dialogConfig;
    private readonly _dialogBodyElement;
    constructor(_dialogElement: HTMLElement, dialogConfig: DialogConfig);
    private addAnimationEndEvents;
    private onAnimationEnd;
    static attach(element: HTMLElement, dialogConfig?: DialogConfig): Dialog;
    open(): void;
    close(): void;
    private _setBodyDividers;
    private _setDialogBodyScrollHandler;
}
