export const RippleContainersSelector =
  [
    '.btn',
    '.btn-flat',
    '.btn-borderless',
    '.btn-solid',
    '.btn-raised',
    '.btn-outline',
    '.list-hover .list-item',
    '.list-item .list-item-hover',
    '.tab',
    '.dropdown-item',
    '.radio .selection-control',
    '.switch .check-indicator',
    '.chip-remove',
    '.chip-hover'
  ].join(',');

const customRippleSizeMap = [
  {selector: '.checkbox .selection-control', size: 40}
];

export class Ripple {
  disabled = false;

  static attach(element: HTMLElement, customSize?: number): Ripple {
    return new Ripple(element, customSize);
  }

  constructor(element: HTMLElement, private readonly _customSize?: number) {
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
    if (this.disabled) return;

    const rippleWrapper = document.createElement('DIV');
    rippleWrapper.classList.add('ripple-wrapper');

    const ripple = document.createElement('DIV');
    ripple.classList.add('ripple');
    rippleWrapper.appendChild(ripple);
    rippleContainer.insertAdjacentElement('afterbegin', rippleWrapper);

    const release = function () {
      ripple.classList.add('dismiss');

      if (releaseCallback) {
        releaseCallback();
      }
    };

    window.addEventListener(releaseEventName, release);
    rippleContainer.addEventListener("dragover", release);

    ripple.addEventListener('transitionend', () => {
      if (ripple.classList.contains('dismiss')) {
        rippleContainer.removeChild(rippleWrapper);
        rippleContainer.removeEventListener("dragover", release);
        window.removeEventListener(releaseEventName, release)
      }
    });

    requestAnimationFrame(() => {
      const clientRect = rippleContainer.getBoundingClientRect();
      const largestDimensionSize = Math.max(rippleWrapper.clientWidth, rippleWrapper.clientHeight);
      let rippleSize = this._customSize || largestDimensionSize * 2;
      ripple.style.width = rippleSize + 'px';
      ripple.style.height = rippleSize + 'px';
      ripple.style.marginLeft = -rippleSize / 2 + 'px';
      ripple.style.marginTop = -rippleSize / 2 + 'px';
      ripple.style.transitionDuration = (1080 * Math.pow(rippleSize, 0.3)) + 'ms, 750ms';

      const x = (pageX - clientRect.left) + ((rippleSize - rippleContainer.clientWidth) / 2);
      const y = (pageY - clientRect.top) + ((rippleSize - rippleContainer.clientHeight) / 2);

      ripple.style.transformOrigin = x + "px " + y + "px";
      ripple.classList.add('show');
    });
  }

  private static _initilizeRipples(selector: string, customSize?: number) {
    const rippleContainers = document.querySelectorAll(selector);

    for (let i = 0; i < rippleContainers.length; i++) {
      new Ripple(rippleContainers[i] as HTMLElement, customSize);
    }
  }

  static initializeRipples(): void {
    Ripple._initilizeRipples(RippleContainersSelector);

    for (let i = 0; i < customRippleSizeMap.length; i++) {
      let customRippleSize = customRippleSizeMap[i];

      Ripple._initilizeRipples(customRippleSize.selector, customRippleSize.size);
    }
  }
}
