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

    var et = this;
    this.element.addEventListener(event, function(e){
      et.tracker.send(e);
    });
  };

  function Tracker(opts) {
    if(undefined == opts) {
      opts = {};
    }
    this.distant = opts.distant || location;
    this.tryAgain = opts.tryAgain || 3;
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

  Tracker.prototype.send = function (e, count) {
    // Verify format of passed event
    if(undefined === e ||
       undefined === e.category ||
       undefined === e.action ||
       undefined === e.label) {
      throw new Error("Category, Action and Label fields are mandatory.");
    }

    // If count is not provided, it is the first try
    if(undefined === count) {
      count = 1;
    }

    // Create a new object with required info
    var toSend = {
      category: e.category,
      action: e.action,
      label: e.label,
      datetime: new Date()
    }

    // Send it with XHR (if error, retry)
    var request = new XMLHttpRequest();

    var send = function(tracker) {
      return function() {
        if (4 === request.readyState &&
            200 !== request.status &&
            count < tracker.tryAgain) {
          // Try again
          tracker.send(e, ++count);
        }
      }
    };
    request.onreadystatechange = send(this);

    request.open('POST', this.distant);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(toSend));
  };

  window.Tracker = Tracker;
})();
