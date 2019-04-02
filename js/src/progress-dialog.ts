import {QuickDialog, QuickDialogConfig} from "./quick-dialog";

export class ProgressDialogConfig extends QuickDialogConfig {
  static readonly default: ProgressDialogConfig = {
    ...QuickDialogConfig.default,
    closeOnBackdropClick: false,
    closeOnEsc: false
  };
}

const progressDialogTemplate = `
<div class="u-dialog u-dialog-progress show">
  <div class="u-dialog-backdrop"></div>
  <div class="u-dialog-content">
    <div class="u-dialog-body">
      <div class="preloader-wrapper">
        <div class="spinner-layer">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      <div class="u-dialog-progress-message u-headline6 text-low-contrast text-nowrap"></div>
    </div>
  </div>
</div>`;

export class ProgressDialog extends QuickDialog<ProgressDialogConfig> {

  private readonly _message: string;

  static open(message: string, config?: ProgressDialogConfig): ProgressDialog {
    return new ProgressDialog(message, config);
  }

  constructor(message: string, config?: ProgressDialogConfig) {
    super(progressDialogTemplate, {...ProgressDialogConfig.default, _message: message, ...config});

    this._message = message;
  }

  protected  _configureDialog(dialogElement: HTMLElement): void {
    const message = this._config['_message'];

    if (message) {
      dialogElement.querySelector<HTMLElement>('.u-dialog-progress-message').innerText = message;
    } else {
      dialogElement.querySelector<HTMLElement>('.u-dialog-progress-message').style.display = 'none';
    }
  }
}
