export declare class Ripple {
    static rippleContainersSelectors: string;
    constructor(element: HTMLElement);
    createRipple(rippleContainer: Element, releaseEventName: string, releaseCallback: Function, pageX: number, pageY: number): void;
    static initializeRipples(): void;
}
