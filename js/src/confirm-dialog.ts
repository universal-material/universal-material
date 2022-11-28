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
<div class="u-dialog show">
  <div class="u-dialog-backdrop"></div>
  <div class="u-dialog-content">
    <div class="u-dialog-header">
      <div class="u-dialog-title"></div>
    </div>
    <div class="u-dialog-body"></div>
    <div class="u-dialog-actions">
      <button type="button" class="u-btn-text u-btn-primary" cancelButton></button>
      <button type="button" class="u-btn-text u-btn-primary" confirmButton></button>
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
    const titleElement = dialogElement.querySelector<HTMLElement>('.u-dialog-title');

    if (this._config.title) {
      titleElement.innerText = this._config.title;
    } else {
      titleElement.parentNode.removeChild(titleElement);
    }
    dialogElement.querySelector<HTMLElement>('.u-dialog-body').innerText = this._config['_message'];

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
