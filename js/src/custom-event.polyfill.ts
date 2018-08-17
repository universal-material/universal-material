(function () {
  if (typeof window['CustomEvent'] === "function") return;

  function CustomEvent(event: string, params: any) {
    params = params || {bubbles: false, cancelable: false, detail: undefined};
    let evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window['Event'].prototype;

  window['CustomEvent'] = CustomEvent;
})();
