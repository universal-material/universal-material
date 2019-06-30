export class Slider {
  private readonly _sliderTrack: HTMLElement;
  private readonly _sliderTrackContainer: HTMLElement;
  private readonly _sliderTrackMarkerContainer: HTMLElement;
  private readonly _sliderTrackMarker: HTMLElement;
  private readonly _sliderThumb: HTMLElement;
  private readonly _sliderInputElement: HTMLInputElement;

  constructor(private readonly _sliderElement: HTMLElement) {
    this._sliderTrack = _sliderElement.querySelector('.u-slider-track') as HTMLInputElement;
    this._sliderTrackContainer = _sliderElement.querySelector('.u-slider-track-container') as HTMLInputElement;
    this._sliderTrackMarkerContainer = _sliderElement.querySelector('.u-slider-track-marker-container') as HTMLInputElement;
    this._sliderTrackMarker = _sliderElement.querySelector('.u-slider-track-marker') as HTMLInputElement;
    this._sliderThumb = _sliderElement.querySelector('.u-slider-thumb') as HTMLInputElement;
    this._sliderInputElement = _sliderElement.querySelector('input[type=range]');
    this._sliderInputElement.addEventListener(window.navigator.userAgent.indexOf('Trident/') > -1 ? 'change' : 'input', () => this._setThumbAndTrack());

    // this._sliderInputElement.setAttribute('aria-hidden', 'true');
    // this._sliderElement.setAttribute('role', 'slider');
    this._sliderInputElement.setAttribute('aria-valuemin', this._sliderInputElement.min);
    this._sliderInputElement.setAttribute('aria-valuemax', this._sliderInputElement.max);

    this._sliderElement['slider'] = this;

    this._setTrackMarkers();
    this._setThumbAndTrack();
  }

  _setTrackMarkers() {
    if (!this._sliderTrackMarker || !this._sliderTrackMarkerContainer) {
      return;
    }

    const min = parseInt(this._sliderInputElement.min, 10);
    const max = parseInt(this._sliderInputElement.max, 10);
    const step = parseInt(this._sliderInputElement.step || "1", 10);

    for (let i = 0; i < max - min; i += step) {
      const node = this._sliderTrackMarker.cloneNode(true);
      this._sliderTrackMarkerContainer.appendChild(node);
    }
  }

  private _setThumbAndTrack() {

    let value = this._sliderInputElement.valueAsNumber;
    const min = parseInt(this._sliderInputElement.min, 10);
    const max = parseInt(this._sliderInputElement.max, 10);

    this._sliderInputElement.setAttribute('aria-valuenow', value.toString());


    const offset = max - min;
    value -= min;

    const position = value * 100 / offset;
    this._sliderThumb.style.width = `${position}%`;
    this._sliderTrack.style.width = `${position}%`;
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this._sliderInputElement.setAttribute('aria-disabled', disabled.toString());
      this._sliderInputElement.setAttribute('disabled', '');
    } else {
      this._sliderInputElement.removeAttribute('aria-disabled');
      this._sliderInputElement.removeAttribute('disabled');
    }
  }

  static initializeSliders(): void {
    const sliders = document.querySelectorAll('.u-slider');

    for (let i = 0; i < sliders.length; i++) {
      const slider = sliders[i];
      new Slider(slider as HTMLElement);
    }
  }
}
