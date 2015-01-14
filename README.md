# tracker.js

A simple solution to track user of the TSP MOOC Platform.

## Usage

Include the script `ls/tracker.js` on your webpage. Then in code:

```js
var tracker = new tracker("url");

// With selector
tracker.on('.my-element').track('click');

// With a NodeList or a HTMLElement
var element = document.querySelectorAll('.my-class');
tracker.on(element).track('click');
```

## Run the tests

```sh
# install karma
npm install karma

# Run the test
npm test
```
