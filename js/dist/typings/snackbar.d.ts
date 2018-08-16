export declare class Snackbar {
    private static readonly _animationEvents;
    private static _snackbarQueue;
    private static _consuming;
    static show(text: string, duration?: SnackbarDuration, buttonDefinition?: SnackbarButtonDefinition): void;
    private static consumeQueue;
    private static showNext;
    private static createSnackbar;
    private static createSnackbarText;
    private static createButton;
    private static addAnimationEndEvents;
    private static onAnimationEnd;
}
export declare enum SnackbarDuration {
    short = 2500,
    long = 5000
}
export declare class SnackbarDefinition {
    text: string;
    duration: SnackbarDuration;
    buttonDefinition: SnackbarButtonDefinition;
}
export declare class SnackbarButtonDefinition {
    text: string;
    action: EventListener;
}
