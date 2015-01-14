
/**
 * Fire an event on the given element
 * @param {HTMLElement} el - the element on which the event will be fired.
 * @param {string} etype - the name of the event to dispatch (eg. click).
 */
function fireEvent(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

/**
 * Return the most recent request of jasmine-ajax mock.
 */
function lastRequest() {
  return jasmine.Ajax.requests.mostRecent();
}


var MockResponses = {
  failure: {
    'status': 500,
    'contentType': 'application/json',
    'responseText': 'awesome response'
  }
};
