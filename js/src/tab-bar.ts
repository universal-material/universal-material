interface TabElement extends HTMLElement {
  index: number;
}

export class TabBar {

  private readonly _tabIndicatorElement: HTMLElement;
  private readonly _tabMap: TabElement[] = [];
  currentTabIndex: number;

  constructor(private readonly _tabBarElement: HTMLElement) {
    this._tabIndicatorElement = _tabBarElement.querySelector('.tab-indicator');
    this._setTabInfoMap();
    this.setActiveTab(0);

    if (window) {
      window.addEventListener('resize', () => {
        this._updateTabIndicator();
      })
    }
  }

  setActiveTab(tabIndex: number) {
    if (!isNaN(this.currentTabIndex)) {
      this._tabMap[this.currentTabIndex].classList.remove('active');
    }

    this.currentTabIndex = tabIndex;
    this._tabBarElement.dispatchEvent(new CustomEvent('tabchange', {
      detail: {
        tabIndex: tabIndex
      }
    }));

    this._tabMap[this.currentTabIndex].classList.add('active');

    setTimeout(() => this._updateTabIndicator(), 100);
  }

  recalculateBounds() {
    this._tabMap.length = 0;
    this._setTabInfoMap();
    this._updateTabIndicator();
  }

  private _updateTabIndicator() {
    const tab = this._tabMap[this.currentTabIndex];
    const tabBounds = tab.getBoundingClientRect();
    const offset = tabBounds.left - this._tabBarElement.getBoundingClientRect().left;

    this._tabIndicatorElement.style.left = offset + 'px';
    this._tabIndicatorElement.style.width = tabBounds.width + 'px';
  }

  private _tabClick = (event: Event) => {
    const tab = event.currentTarget as TabElement;
    this.setActiveTab(tab.index);
  }

  private _setTabInfoMap() {

    const tabs = this._tabBarElement.querySelectorAll('.tab');

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i] as TabElement;
      tab.removeEventListener('click', this._tabClick);
      tab.addEventListener('click', this._tabClick);

      tab.index = i;
      this._tabMap.push(tab);
    }
  }

  static attach(tabBarElement: HTMLElement): TabBar {
    return new TabBar(tabBarElement);
  }

  static initializeTabBars(): void {
    const tabBars = document.querySelectorAll('.tab-bar');
    for (let i = 0; i < tabBars.length; i++) {
      const tabBar = tabBars[i] as HTMLElement;
      TabBar.attach(tabBar);
    }
  }
}
