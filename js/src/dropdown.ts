export class DropdownConfig {
  static readonly default: DropdownConfig = {

  };
}

const closeEvent = new CustomEvent('close');
const openEvent = new CustomEvent('open');
const EnterKey = 13;
const EscapeKey = 27;
const SpaceKey = 32;

export class Dropdown {
  private readonly _dropdownConfig: DropdownConfig;
  private readonly _dropdownToggle: HTMLElement;
  private readonly _dropdownMenu: HTMLElement;
  private _showing: boolean;

  constructor(private readonly _dropdownElement: HTMLElement,
              dropdownConfig: DropdownConfig) {
    this._dropdownToggle = _dropdownElement.querySelector('.dropdown-toggle');
    this._dropdownMenu = _dropdownElement.querySelector('.dropdown-menu');
    if (!this._dropdownToggle || !this._dropdownToggle) return;

    this._dropdownConfig = {...DropdownConfig.default, ...dropdownConfig};
    this._attachEvents();
  }
  static attach(element: HTMLElement, dropdownConfig?: DropdownConfig): Dropdown {
    return new Dropdown(element, dropdownConfig);
  }

  _attachEvents() {
    this._dropdownToggle.addEventListener('click', e => {
      e.stopPropagation();
    });

    document.addEventListener('click', () => {
      this.close();
    });

    this._dropdownToggle.addEventListener('mouseup', e => {
      this.toggle();
    });

    this._dropdownToggle.addEventListener('keyup', e => {
      switch (e.which) {
        case EscapeKey:
          this.close();
          break;
        case SpaceKey:
          this.open();
          break;
        case EnterKey:
          this.toggle();
          break;
      }
    });
  }

  toggle = () => {
    const action = this._showing ? this.close : this.open;
    action();
  };

  open = () => {
    this._dropdownMenu.classList.add('show');
    this._showing = true;
    this._dropdownElement.dispatchEvent(openEvent);
  };

  close = () => {
    this._dropdownMenu.classList.remove('show');
    this._showing = false;
    this._dropdownElement.dispatchEvent(closeEvent);
  };

  static initializeDropdowns(): void {
    const dropdowns = document.querySelectorAll('.dropdown');
    for (let i = 0; i < dropdowns.length; i++) {
      const dropdown = dropdowns[i] as HTMLElement;
      Dropdown.attach(dropdown);
    }
  }
}
