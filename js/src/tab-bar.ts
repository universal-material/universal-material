interface TabElement extends HTMLElement {
  index: number;
}

export class TabBar {

  private static _attachedKeyEvents = false;
  private readonly _tabIndicatorElement: HTMLElement;
  private readonly _tabMap: TabElement[] = [];
  currentTabIndex: number;

  protected constructor(private readonly _tabBarElement: HTMLElement) {

    if (!TabBar._attachedKeyEvents) {
      document.addEventListener('keydown', e => {
        const tabBar = document.activeElement.parentElement && document.activeElement.parentElement['tabBar'] as TabBar;

        if (!tabBar) {
          return;
        }

        let tabFocusIndex = (document.activeElement as TabElement).index;

        if (e.keyCode === 37) {
          tabFocusIndex--;

          if (tabFocusIndex < 0) {
            tabFocusIndex = tabBar._tabMap.length - 1;
          }
        }  else if (e.keyCode === 39) {
          tabFocusIndex++;

          if (tabFocusIndex >= tabBar._tabMap.length) {
            tabFocusIndex = 0
          }
        }

        tabBar._tabMap[tabFocusIndex].focus();
      });
    }

    this._tabIndicatorElement = _tabBarElement.querySelector('.u-tab-indicator');
    this._setTabs();
    this.setActiveTab(0);
    _tabBarElement['tabBar'] = this;

    if (window) {
      window.addEventListener('resize', () => {
        this._updateTabIndicator();
      })
    }
  }

  setActiveTab(tabIndex: number) {
    if (!isNaN(this.currentTabIndex)) {
      this._tabMap[this.currentTabIndex].classList.remove('active');
      this._tabMap[this.currentTabIndex].setAttribute('tabindex', '-1');
      this._tabMap[this.currentTabIndex].setAttribute('aria-selected', 'false');
    }

    this.currentTabIndex = tabIndex;
    this._tabBarElement.dispatchEvent(new CustomEvent('tabchange', {
      detail: {
        tabIndex: tabIndex
      }
    }));

    this._tabMap[this.currentTabIndex].classList.add('active');
    this._tabMap[this.currentTabIndex].setAttribute('tabindex', '0');
    this._tabMap[this.currentTabIndex].setAttribute('aria-selected', 'true');

    setTimeout(() => this._updateTabIndicator(), 100);
  }

  recalculateBounds() {
    this._tabMap.length = 0;
    this._setTabs();
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

  private _setTabs() {

    const tabs = this._tabBarElement.querySelectorAll('.u-tab');

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i] as TabElement;
      tab.removeEventListener('click', this._tabClick);
      tab.addEventListener('click', this._tabClick);
      tab.setAttribute('tabindex', i === this.currentTabIndex ? '0' : '-1');
      tab.setAttribute('aria-selected',
        i === this.currentTabIndex ? 'true' : 'false');

      tab.index = i;
      this._tabMap.push(tab);
    }
  }

  static attach(tabBarElement: HTMLElement): TabBar {

    return new TabBar(tabBarElement);
  }

  static initializeTabBars(): void {
    const tabBars = document.querySelectorAll('.u-tab-bar');
    for (let i = 0; i < tabBars.length; i++) {
      const tabBar = tabBars[i] as HTMLElement;
      TabBar.attach(tabBar);
    }
  }
}
