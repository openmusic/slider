(function() {

	var setterGetterify = require('setter-getterify');
	var safeRegisterElement = require('safe-register-element');

	// Ideally it would be better to extend the HTMLInputElement prototype but
	// it doesn't seem to be working and I don't get any distinct element at all
	// or I get an "TypeError: 'type' setter called on an object that does not implement interface HTMLInputElement."
	// ... so using just HTMLElement for now
	var proto = Object.create(HTMLElement.prototype);

	proto.createdCallback = function() {

		var that = this;

		// Values
		var properties = {
			min: 0,
			max: 100,
			value: 50,
			step: 1
		};

		setterGetterify(this, properties, {
			afterSetting: function(property, value) {
				updateDisplay(that);
			}
		});
	
		this._properties = properties;

		// Markup
		var slider = document.createElement('input');
		slider.type = 'range';

		var valueSpan = document.createElement('span');

		this._slider = slider;
		this._valueSpan = valueSpan;

		this.appendChild(slider);
		this.appendChild(valueSpan);

		slider.addEventListener('input', function() {
			that.value = slider.value * 1.0;
		});

	};

	
	var sliderAttributes = [ 'min', 'max', 'value', 'step' ];

	proto.attachedCallback = function() {

		var attrs = this.attributes;
		var valueIsThere = false;
	
		for(var i = 0; i < attrs.length; i++) {
			var attr = attrs[i];

			if(attr.name === 'value') {
				valueIsThere = true;
			}

			// Just sending sensible attributes to the slider itself
			if(sliderAttributes.indexOf(attr.name) !== -1) {
				this._properties[attr.name] = attr.value;
			}
		}

		// If not specified, the default value has to be 
		// (min + max) / 2 as the normal slider would do as well.
		if(!valueIsThere) {
			var calculatedValue = (this._properties.min * 1.0 + this._properties.max * 1.0) / 2.0;
			this._properties.value = calculatedValue;
		}

		updateDisplay(this);

	};


	function updateDisplay(compo) {
		compo._valueSpan.innerHTML = compo._properties.value;
		compo._slider.value = compo._properties.value;
		compo._slider.min = compo._properties.min;
		compo._slider.max = compo._properties.max;
		compo._slider.step = compo._properties.step;
	}

	//
	
	var component = {};
	component.prototype = proto;
	component.register = function(name) {
		safeRegisterElement(name, proto);
	};

	if(typeof define === 'function' && define.amd) {
		define(function() { return component; });
	} else if(typeof module !== 'undefined' && module.exports) {
		module.exports = component;
	} else {
		component.register('openmusic-slider'); // automatic registration
	}

}).call(this);


