# tracker.js

A simple solution to track user of the TSP MOOC Platform.

## Usage

Include the script `ls/tracker.js` on your webpage. Then in code:

```js
var tracker = new Tracker({distant: 'url'});

// With selector
tracker.on('.my-element').track('click');

// With a NodeList or a HTMLElement
var element = document.querySelectorAll('.my-class');
tracker.on(element).track('click');
```

## Options

When you create the tracker, you can pass some information to it:

| Key        | Description                                                |
|:----------:|------------------------------------------------------------|
| `distant`  | The URL of the server to which you want to send events. (default to `location`) |
| `tryAgain` | The number of times the tracker will try to send events before stopping. (default to `3`) |

## Run the tests

```sh
# install karma
npm install karma

# Run the test
npm test
```
