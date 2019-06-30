export class Slider {
  private readonly _sliderThumb: HTMLElement;
  private readonly _sliderInputElement: HTMLInputElement;

  constructor(private readonly _sliderElement: HTMLElement) {
    this._sliderThumb = _sliderElement.querySelector('.u-slider-thumb') as HTMLInputElement;
    this._sliderInputElement = _sliderElement.querySelector('input[type=range]');
    this._sliderInputElement.addEventListener(window.navigator.userAgent.indexOf('Trident/') > -1 ? 'change' : 'input', () => this._setThumbAndTrack());
    this._setThumbAndTrack();
  }

  private _setThumbAndTrack() {
    let value = this._sliderInputElement.valueAsNumber;
    const min = parseInt(this._sliderInputElement.min, 10);
    const max = parseInt(this._sliderInputElement.max, 10);

    const offset = max - min;
    value -= min;

    this._sliderThumb.style.left = Math.round(value * 100 / offset) + '%';
  }

  static initializeSliders(): void {
    const sliders = document.querySelectorAll('.u-slider');

    for (let i = 0; i < sliders.length; i++) {
      const slider = sliders[i];
      new Slider(slider as HTMLElement);
    }
  }
}
