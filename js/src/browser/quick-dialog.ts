import {Dialog} from './dialog';

const EscapeKeyCode = 27;

export class QuickDialogConfig {
  static default: QuickDialogConfig = {
    closeOnBackdropClick: true,
    closeOnEsc: true
  };

  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

export abstract class QuickDialog<T extends QuickDialogConfig> {
  private readonly _template: string;
  protected _config: T;
  protected _innerDialog: Dialog;

  protected constructor(template: string, config?: any, beforeCreateDialog?: Function) {
    this._template = template;
    this._config = {...QuickDialogConfig.default, ...config};
    if (beforeCreateDialog) beforeCreateDialog();
    this._createDialog();
  }

  private _keyDownEvent = (event: KeyboardEvent) => {
    if (event.which === EscapeKeyCode) {
      this._innerDialog.close();
      event.preventDefault();
    }
  };

  private _createDialog() {
    const dialogContainer = document.createElement('div');
    dialogContainer.innerHTML = this._template;

    const dialogElement = dialogContainer.querySelector<HTMLElement>('.u-dialog');
    this._configureDialog(dialogElement);

    document.body.appendChild(dialogContainer);

    dialogElement.addEventListener('closed', () => {
      document.body.removeChild(dialogContainer);
      document.body.removeEventListener('keydown', this._keyDownEvent, true);
      this._onClosed();
    });

    this._innerDialog = Dialog.attach(dialogElement, {
      destroyWhenClose: true
    });

    if (this._config.closeOnEsc) {
      this._setEscapeEvent();
    }

    if (this._config.closeOnBackdropClick) {
      dialogElement
        .querySelector('.u-dialog-backdrop')
        .addEventListener('click', () => this._innerDialog.close(), true);
    }
  }

  protected abstract _configureDialog(dialogElement: HTMLElement): void;

  close(): void {
    this._innerDialog.close();
  }

  protected _onClosed() {

  }

  private _setEscapeEvent() {
    document.body.addEventListener('keydown', this._keyDownEvent, true);
  }
}
