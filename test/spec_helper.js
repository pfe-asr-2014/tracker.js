
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
