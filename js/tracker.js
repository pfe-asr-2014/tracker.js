(function () {
  'use strict';

  var acceptableEvents = ['click'];

  function ElementTracker(element, tracker) {
    this.element = element;
    this.tracker = tracker;
  }

  ElementTracker.prototype.track = function (event) {
    if(event == undefined || null) {
      throw new Error('An event must be passed to #track.');
    }

    if(acceptableEvents.indexOf(event) < 0) {
      throw new Error(event + ' not supported.');
    }

  };

  function Tracker(distant) {
    this.distant = distant || location;
  }

  Tracker.prototype.on = function (selector) {
    var el;

    if('string' === typeof(selector)) {
      el = document.querySelectorAll(selector);

      if(el.length == 0) {
        el = undefined;
      }
    }

    if(selector instanceof HTMLElement || selector instanceof NodeList) {
      el = selector;
    }

    if(undefined === el) {
      throw new Error(selector + " not supported.");
    }

    return new ElementTracker(el, this);
  };

  Tracker.prototype.send = function (e) {
    // TODO verify format of passed event
    // TODO Create a new object with required info
    // TODO Send it with XHR (if error, retry)
  };

  window.Tracker = Tracker;
})();
