export const RippleContainersSelector =
  [
    '.u-btn',
    '.u-btn-flat',
    '.u-btn-solid',
    '.u-btn-raised',
    '.u-btn-outline',
    '.u-btn-floating',
    '.u-btn-borderless',
    '.u-tab',
    '.u-dropdown-item',
    '.u-chip-remove',
    '.u-chip-hover',
    '.u-text-input.u-dropdown-toggle'
  ].join(',');

export class RippleConfig {
  size?: number;
  borderRadius?: string;
}

export const RippleConfigMap = [
  {
    selector: '.u-list-selectable',
    subSelector: '.u-list-item'
  },
  {
    selector: '.u-list-item',
    subSelector: '.u-list-item-hover'
  },
  {
    selector: '.u-radio',
    subSelector: '.u-selection-control'
  },
  {
    selector: '.u-switch',
    subSelector: '.u-check-indicator'
  },
  {
    selector: '.u-checkbox',
    subSelector: '.u-selection-control'
  }
];

export class Ripple {
  private readonly _config: RippleConfig;
  disabled = false;

  static attach(element: HTMLElement, config?: RippleConfig): Ripple {
    return new Ripple(element, config);
  }

  constructor(element: HTMLElement, config?: RippleConfig) {
    this._config = {...config};

    if (window.getComputedStyle(element).position !== "absolute" && window.getComputedStyle(element).position !== "fixed") {
      element.style.position = "relative";
    }

    let isTouching = false;

    element.addEventListener('mousedown', (e: MouseEvent) => {
      if (!isTouching) {
        this.createRipple(element, 'mouseup', null, e.clientX, e.clientY);
      }
    });

    element.addEventListener('touchstart', (e: TouchEvent) => {
      isTouching = true;
      this.createRipple(element, 'touchend', () => {
        setTimeout(() => {
          isTouching = false;
        }, 100);
      }, e.touches[0].clientX, e.touches[0].clientY);
    });
  }

  createRipple(rippleContainer: Element, releaseEventName: string, releaseCallback: Function, pageX: number, pageY: number) {
    if (this.disabled ||
      rippleContainer.hasAttribute('disabled') ||
      rippleContainer.classList.contains('disabled')) return;

    let release: () => void;
    let cancel = false;
    const touchMove = () => {

      cancel = true;

      rippleContainer.removeEventListener("touchmove", touchMove);

      if (release) {
        release();
      }
    };


    rippleContainer.addEventListener("touchmove", touchMove);

    setTimeout(() => {
      if (cancel) {
        return;
      }

      const rippleWrapper = document.createElement('DIV');
      rippleWrapper.classList.add('u-ripple-wrapper');

      const ripple = document.createElement('DIV');
      ripple.classList.add('u-ripple');
      rippleWrapper.appendChild(ripple);
      rippleContainer.insertAdjacentElement('afterbegin', rippleWrapper);

      if (this._config.size) {
        Ripple._setElementSquareSizeAndCenter(rippleWrapper, this._config.size);
      }

      if (this._config.borderRadius) {
        rippleWrapper.style.borderRadius = this._config.borderRadius;
      }

      release = () => {
        ripple.classList.add('dismiss');

        if (releaseCallback) {
          releaseCallback();
        }
      };

      window.addEventListener(releaseEventName, release);
      rippleContainer.addEventListener("dragover", release);
      rippleContainer.addEventListener("mouseleave", release);

      ripple.addEventListener('transitionend', () => {
        if (ripple.classList.contains('dismiss')) {
          rippleContainer.removeChild(rippleWrapper);
          rippleContainer.removeEventListener("dragover", release);
          rippleContainer.removeEventListener("mouseleave", release);
          window.removeEventListener(releaseEventName, release)
        }
      });

      requestAnimationFrame(() => {
        const clientRect = rippleContainer.getBoundingClientRect();
        const largestDimensionSize = Math.max(rippleWrapper.clientWidth, rippleWrapper.clientHeight);
        let rippleSize = this._config.size || largestDimensionSize * 2;
        Ripple._setElementSquareSizeAndCenter(ripple, rippleSize);
        ripple.style.transitionDuration = (1080 * Math.pow(rippleSize, 0.3)) + 'ms, 750ms';

        const x = (pageX - clientRect.left) + ((rippleSize - rippleContainer.clientWidth) / 2);
        const y = (pageY - clientRect.top) + ((rippleSize - rippleContainer.clientHeight) / 2);

        ripple.style.transformOrigin = x + "px " + y + "px";
        ripple.classList.add('show');
      });
    }, 100);
  }

  private static _setElementSquareSizeAndCenter(element: HTMLElement, size: number) {
    element.style.top = "50%";
    element.style.left = "50%";
    element.style.width = size + 'px';
    element.style.height = size + 'px';
    element.style.marginLeft = -size / 2 + 'px';
    element.style.marginTop = -size / 2 + 'px';
  }

  private static _initilizeRipples(selector: string, config?: RippleConfig) {
    const rippleContainers = document.querySelectorAll(selector);

    for (let i = 0; i < rippleContainers.length; i++) {
      new Ripple(rippleContainers[i] as HTMLElement, config);
    }
  }

  static initializeRipples(): void {
    Ripple._initilizeRipples(RippleContainersSelector);

    for (let i = 0; i < RippleConfigMap.length; i++) {
      let rippleConfig = RippleConfigMap[i];

      let selector = rippleConfig.selector;

      if (rippleConfig.subSelector) {
        selector = [selector, rippleConfig.subSelector].join(' ');
      }

      Ripple._initilizeRipples(selector);
    }
  }
}
