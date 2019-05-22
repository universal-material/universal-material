export declare const RippleContainersSelector: string;
export declare class RippleConfig {
    size?: number;
    borderRadius?: string;
}
export declare const RippleConfigMap: {
    selector: string;
    subSelector: string;
    config: any;
}[];
export declare class Ripple {
    private readonly _config;
    disabled: boolean;
    static attach(element: HTMLElement, config?: RippleConfig): Ripple;
    constructor(element: HTMLElement, config?: RippleConfig);
    createRipple(rippleContainer: Element, releaseEventName: string, releaseCallback: Function, pageX: number, pageY: number): void;
    private static _setElementSquareSizeAndCenter;
    private static _initilizeRipples;
    static initializeRipples(): void;
}
