import {Ripple} from './ripple';

export class Snackbar {
  private static readonly _animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
  private static _snackbarQueue: SnackbarDefinition[] = [];
  private static _consuming: boolean;

  static show(text: string, duration: SnackbarDuration = SnackbarDuration.long, buttonDefinition?: SnackbarButtonDefinition) {
    Snackbar._snackbarQueue.push({
      text: text,
      duration: duration,
      buttonDefinition: buttonDefinition
    });

    if (!Snackbar._consuming) {
      Snackbar.consumeQueue();
    }
  }

  private static consumeQueue() {

    if (Snackbar._snackbarQueue.length) {
      Snackbar._consuming = true;
      Snackbar.showNext();
    }
  }

  private static showNext() {
    if (Snackbar._snackbarQueue.length) {
      const snackbarDefinition = Snackbar._snackbarQueue[0];

      Snackbar._snackbarQueue = Snackbar._snackbarQueue.slice(1);

      const snackbar = Snackbar.createSnackbar();

      snackbar.appendChild(Snackbar.createSnackbarText(snackbarDefinition.text));

      if (snackbarDefinition.buttonDefinition) {
        const snackbarButton = Snackbar.createButton(snackbarDefinition.buttonDefinition);
        snackbar.appendChild(snackbarButton);
      }

      document.body.appendChild(snackbar);

      setTimeout(() => {
        snackbar.classList.add("dismiss");
        Snackbar.addAnimationEndEvents(snackbar);

      }, snackbarDefinition.duration);
    } else {
      Snackbar._consuming = false;
    }
  }

  private static createSnackbar(): HTMLElement {
    const snackbar = document.createElement("div");
    snackbar.className = "u-snackbar";

    return snackbar;
  }

  private static createSnackbarText(text: string): HTMLElement {
    const snackbarText = document.createElement("div");
    snackbarText.innerText = text;
    snackbarText.className = "u-snackbar-text";

    return snackbarText;
  }

  private static createButton(buttonDefinition: SnackbarButtonDefinition): HTMLElement {

    const snackbarButton = document.createElement("button") as HTMLButtonElement;
    snackbarButton.type = "button";
    snackbarButton.className = "u-text-btn";
    snackbarButton.innerText = buttonDefinition.text;

    new Ripple(snackbarButton);

    if (buttonDefinition.action) {
      snackbarButton.addEventListener("click", buttonDefinition.action);
    }

    return snackbarButton;
  }

  private static addAnimationEndEvents(snackbar: HTMLElement) {
    Snackbar._animationEvents.forEach(eventName => {
      snackbar.addEventListener(eventName, Snackbar.onAnimationEnd.bind(this));
    });
  }

  private static onAnimationEnd(event: Event) {
    event.currentTarget.removeEventListener(event.type, Snackbar.onAnimationEnd);
    const element = event.currentTarget as HTMLElement;

    element.parentNode.removeChild(element);
    Snackbar.showNext();
  }
}

export enum SnackbarDuration {
  short = 2500,
  long = 5000
}

export class SnackbarDefinition {
  text: string;
  duration: SnackbarDuration;
  buttonDefinition: SnackbarButtonDefinition;
}

export class SnackbarButtonDefinition {
  text: string;
  action: EventListener;
}
