export declare const RippleContainersSelector: string;
export declare class Ripple {
    constructor(element: HTMLElement);
    createRipple(rippleContainer: Element, releaseEventName: string, releaseCallback: Function, pageX: number, pageY: number): void;
    static initializeRipples(): void;
}
