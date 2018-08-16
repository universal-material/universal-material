import {Dialog} from './dialog';

const template = `
<div class="dialog dialog-progress show">
  <div class="dialog-backdrop"></div>
  <div class="dialog-content">
    <div class="dialog-body">
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
      <div class="dialog-progress-message headline6 text-low-contrast text-nowrap"></div>
    </div>
  </div>
</div>`;

export class ProgressDialog {
  static open(message: string): {close: () => any} {
    const dialogContainer = document.createElement("div");
    dialogContainer.innerHTML = template;
    dialogContainer.querySelector<HTMLElement>(".dialog-progress-message").innerText = message;
    const dialog = dialogContainer.querySelector<HTMLElement>('.dialog');

    document.body.appendChild(dialogContainer);

    return Dialog.attach(dialog, {
      disposeWhenClose: true
    });
  }
}
