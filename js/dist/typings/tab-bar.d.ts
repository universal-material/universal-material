export declare class TabBar {
    private readonly _tabBarElement;
    private readonly _tabIndicatorElement;
    private readonly _tabMap;
    currentTabIndex: number;
    constructor(_tabBarElement: HTMLElement);
    setActiveTab(tabIndex: number): void;
    recalculateBounds(): void;
    private _updateTabIndicator;
    private _tabClick;
    private _setTabInfoMap;
    static attach(tabBarElement: HTMLElement): TabBar;
    static initializeTabBars(): void;
}
