export declare const RippleContainersSelector: string;
export declare class Ripple {
    private readonly _customSize?;
    disabled: boolean;
    static attach(element: HTMLElement, customSize?: number): Ripple;
    constructor(element: HTMLElement, _customSize?: number);
    createRipple(rippleContainer: Element, releaseEventName: string, releaseCallback: Function, pageX: number, pageY: number): void;
    private static _initilizeRipples;
    static initializeRipples(): void;
}
