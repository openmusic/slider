# openmusic-slider

> a not ultra fancy slider web component, which shows the current value too

It it essentially an `input[type=range]` and a `span` showing the input's current value. That's all it is.

## install

```bash
npm install openmusic-slider
```

## usage

```javascript
require('openmusic-slider')('openmusic-slider');

var coolSlider = document.createElement('openmusic-slider');
document.body.appendChild(coolSlider);
```

## properties

* min
* max
* value
* step

These properties can also be specified as attributes in HTML:

```html
<openmusic-slider min="10" max="100" step="2" value="20"></openmusic-slider>
```
