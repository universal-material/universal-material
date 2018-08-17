import {QuickDialog, QuickDialogConfig} from './quick-dialog';
import {Ripple} from './ripple';

export class ConfirmDialogConfig extends QuickDialogConfig {
  static readonly default: ConfirmDialogConfig = {
    confirmLabel: "Ok",
    cancelLabel: "Cancel",
    ...QuickDialogConfig.default
  };

  onConfirm?: Function;
  onCancel?: Function;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const confirmDialogTemplate = `
<div class="dialog show">
  <div class="dialog-backdrop"></div>
  <div class="dialog-content">
    <div class="dialog-title"></div>
    <div class="dialog-body"></div>
    <div class="dialog-actions">
      <button type="button" class="btn-flat btn-primary" confirmButton></button>
      <button type="button" class="btn-flat btn-primary" cancelButton></button>
    </div>
  </div>
</div>`;

export class ConfirmDialog extends QuickDialog<ConfirmDialogConfig> {

  private readonly _message: string;

  static open(message: string, config?: ConfirmDialogConfig): ConfirmDialog {
    return new ConfirmDialog(message, config);
  }

  constructor(message: string, config?: ConfirmDialogConfig) {
    super(confirmDialogTemplate, {...ConfirmDialogConfig.default, _message: message, ...config});

    this._message = message;
  }

  protected  _configureDialog(dialogElement: HTMLElement): void {
    const titleElement = dialogElement.querySelector<HTMLElement>('.dialog-title');

    if (this._config.title) {
      titleElement.innerText = this._config.title;
    } else {
      titleElement.parentNode.removeChild(titleElement);
    }
    dialogElement.querySelector<HTMLElement>('.dialog-body').innerText = this._config['_message'];

    const confirmButton = dialogElement.querySelector<HTMLElement>('[confirmButton]');
    const cancelButton = dialogElement.querySelector<HTMLElement>('[cancelButton]');

    confirmButton.innerText = this._config.confirmLabel;
    cancelButton.innerText = this._config.cancelLabel;

    Ripple.attach(confirmButton);
    Ripple.attach(cancelButton);

    confirmButton.addEventListener('click', () => {
      this._innerDialog.close();
      if (this._config.onConfirm) this._config.onConfirm();
    });

    cancelButton.addEventListener('click', () => {
      this._innerDialog.close();
      if (this._config.onCancel) this._config.onCancel();
    });
  }
}
