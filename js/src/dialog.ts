export class DialogConfig {
  static readonly default: DialogConfig = {
    destroyWhenClose: false
  };

  destroyWhenClose?: boolean
}

const closedEvent = new CustomEvent('closed');
const dialogBodyTopDividerClassName = 'dialog-body-top-divider';
const dialogBodyBottomDividerClassName = 'dialog-body-bottom-divider';

export class Dialog {
  private static readonly _animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
  private readonly _dialogConfig: DialogConfig;
  private readonly _dialogBodyElement: HTMLElement;

  constructor(private readonly _dialogElement: HTMLElement,
              dialogConfig: DialogConfig) {
    this._dialogConfig = {...DialogConfig.default, ...dialogConfig};
    this._dialogBodyElement = this._dialogElement.querySelector<HTMLElement>('.dialog-body');

    if (this._dialogBodyElement) {
      this._setBodyDividers();
      this._setDialogBodyScrollHandler();
    }
  }

  private addAnimationEndEvents() {
    Dialog._animationEvents.forEach(eventName => {
      this._dialogElement.addEventListener(eventName, this.onAnimationEnd.bind(this));
    });
  }

  private onAnimationEnd = (event: Event) => {
    this._dialogElement.removeEventListener(event.type, this.onAnimationEnd);
    this._dialogElement.dispatchEvent(closedEvent);

    if (this._dialogConfig.destroyWhenClose) {
      this._dialogElement.parentNode.removeChild(this._dialogElement);
    } else {
      this._dialogElement.classList.remove('hide');
    }
  };

  static attach(element: HTMLElement, dialogConfig?: DialogConfig): Dialog {
    return new Dialog(element, dialogConfig);
  }

  open() {
    this._dialogElement.classList.add('show');
  }

  close() {
    this._dialogElement.classList.add('hide');
    this._dialogElement.classList.remove('show');
    this.addAnimationEndEvents();
  }

  private _setBodyDividers() {
    if(this._dialogBodyElement.scrollTop) {
      this._dialogElement.classList.add(dialogBodyTopDividerClassName);
    } else {
      this._dialogElement.classList.remove(dialogBodyTopDividerClassName);
    }

    const scrollBottom = this._dialogBodyElement.scrollTop + this._dialogBodyElement.offsetHeight;

    if (scrollBottom !== this._dialogBodyElement.scrollHeight) {
      this._dialogElement.classList.add(dialogBodyBottomDividerClassName);
    } else {
      this._dialogElement.classList.remove(dialogBodyBottomDividerClassName);
    }
  }

  private _setDialogBodyScrollHandler() {
    this._dialogBodyElement.addEventListener('scroll', this._setBodyDividers.bind(this), true);
  }
}
