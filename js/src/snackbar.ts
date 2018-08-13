import {Ripple} from './ripple';

export class Snackbar {
  private static readonly animationEvents = ["webkitAnimationEnd", "oanimationend", "msAnimationEnd", "animationend"];
  private static snackbarQueue: SnackbarDefinition[] = [];
  private static consuming: boolean;

  static show(text: string, duration: SnackbarDuration = SnackbarDuration.long, buttonDefinition?: SnackbarButtonDefinition) {
    Snackbar.snackbarQueue.push({
      text: text,
      duration: duration,
      buttonDefinition: buttonDefinition
    });

    if (!Snackbar.consuming) {
      Snackbar.consumeQueue();
    }
  }

  private static consumeQueue() {

    if (Snackbar.snackbarQueue.length) {
      Snackbar.consuming = true;
      Snackbar.showNext();
    }
  }

  private static showNext() {
    if (Snackbar.snackbarQueue.length) {
      const snackbarDefinition = Snackbar.snackbarQueue[0];

      Snackbar.snackbarQueue = Snackbar.snackbarQueue.slice(1);

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
      Snackbar.consuming = false;
    }
  }

  private static createSnackbar(): HTMLElement {
    const snackbar = document.createElement("div");
    snackbar.className = "snackbar";

    return snackbar;
  }

  private static createSnackbarText(text: string): HTMLElement {
    const snackbarText = document.createElement("div");
    snackbarText.innerText = text;
    snackbarText.className = "snackbar-text";

    return snackbarText;
  }

  private static createButton(buttonDefinition: SnackbarButtonDefinition): HTMLElement {

    const snackbarButton = document.createElement("button") as HTMLButtonElement;
    snackbarButton.type = "button";
    snackbarButton.className = "btn-flat btn-secondary";
    snackbarButton.innerText = buttonDefinition.text;

    new Ripple(snackbarButton);

    if (buttonDefinition.action) {
      snackbarButton.addEventListener("click", buttonDefinition.action);
    }

    return snackbarButton;
  }

  private static addAnimationEndEvents(snackbar: HTMLElement) {
    Snackbar.animationEvents.forEach(eventName => {
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
