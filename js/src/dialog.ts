export class DialogOptions {
  static readonly default: DialogOptions = {
    disposeWhenClose: false
  };

  disposeWhenClose?: boolean
}

export class Dialog {
  private static readonly _animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
  private readonly _dialogOptions: DialogOptions;

  constructor(private readonly _dialogElement: HTMLElement,
              dialogOptions: DialogOptions) {
    this._dialogOptions = {...DialogOptions.default, ...dialogOptions};
  }

  private addAnimationEndEvents() {
    Dialog._animationEvents.forEach(eventName => {
      this._dialogElement.addEventListener(eventName, this.onAnimationEnd.bind(this));
    });
  }

  private onAnimationEnd = (event: Event) => {
    this._dialogElement.removeEventListener(event.type, this.onAnimationEnd);

    if (this._dialogOptions.disposeWhenClose) {
      this._dialogElement.parentNode.removeChild(this._dialogElement);
    } else {
      this._dialogElement.classList.remove('hide');
    }
  };

  static attach(element: HTMLElement, dialogOptions?: DialogOptions): Dialog {
    return new Dialog(element, dialogOptions);
  }

  open() {
    this._dialogElement.classList.add('show');
  }

  close() {
    this._dialogElement.classList.add('hide');
    this._dialogElement.classList.remove('show');
    this.addAnimationEndEvents();
  }
}
