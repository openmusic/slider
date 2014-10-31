(function() {
	// Ideally it would be better to extend the HTMLInputElement prototype but
	// it doesn't seem to be working and I don't get any distinct element at all
	// or I get an "TypeError: 'type' setter called on an object that does not implement interface HTMLInputElement."
	// ... so using just HTMLElement for now
	var proto = Object.create(HTMLElement.prototype);

	proto.createdCallback = function() {
	
		var slider = document.createElement('input');
		slider.type = 'range';

		var valueSpan = document.createElement('span');

		this._slider = slider;
		this._valueSpan = valueSpan;

		this.appendChild(slider);
		this.appendChild(valueSpan);

		var self = this;
		slider.addEventListener('input', function() {
			updateDisplay(self);
		});

		Object.defineProperty(this, 'value', {
			get: function() {
				return slider.value;
			},
			set: function(v) {
				slider.value = v;
				updateDisplay(self);
			}
		});

	};

	var sliderAttributes = [ 'min', 'max', 'value', 'step' ];

	proto.attachedCallback = function() {

		var attrs = this.attributes;
	
		for(var i = 0; i < attrs.length; i++) {
			var attr = attrs[i];
			// Just sending sensible attributes to the slider itself
			if(sliderAttributes.indexOf(attr.name) !== -1) {
				this._slider.setAttribute(attr.name, attr.value);
			}
		}

		updateDisplay(this);

	};

	function updateDisplay(compo) {
		compo._valueSpan.innerHTML = compo._slider.value;
	}

	//

	var component = {};
	component.prototype = proto;
	component.register = function(name) {
		document.registerElement(name, {
			prototype: proto
		});
	};

	if(typeof define === 'function' && define.amd) {
		define(function() { return component; });
	} else if(typeof module !== 'undefined' && module.exports) {
		module.exports = component;
	} else {
		component.register('openmusic-slider'); // automatic registration
	}

}).call(this);


