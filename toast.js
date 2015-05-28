/***********************************************

  "toast.js"

  Created by Michael Cheng on 05/27/2015 14:24
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

"use strict";


/**
 * The iqwerty namespace
 */
var iqwerty = iqwerty || {};

/**
 * Toasts are here
 */
iqwerty.toast = (function() {
	function Toast() {
		/**
		 * The duration of the toast, in milliseconds
		 * @type {Number}
		 */
		var _duration = 3000;
		this.getDuration = function() {
			return _duration;
		};
		this.setDuration = function(time) {
			_duration = time;
			return this;
		};

		/**
		 * The toast element
		 * @type {Object}
		 */
		var _toastStage = null;
		this.getToastStage = function() {
			return _toastStage;
		};
		this.setToastStage = function(toastStage) {
			_toastStage = toastStage;
			return this;
		};

		/**
		 * The text inside the toast
		 * @type {String}
		 */
		var _text = null;
		this.getText = function() {
			return _text;
		};
		this.setText = function(text) {
			_text = text;
			return this;
		};

		/**
		 * The text element inside the toast
		 * @type {Object}
		 */
		var _textStage = null;
		this.getTextStage = function() {
			return _textStage;
		};
		this.setTextStage = function(textStage) {
			_textStage = textStage;
			return this;
		};

	};

	/**
	 * Initialize the animations for the toast, including fade/slide in, and fade/slide out. Add the styles to a style element in the head.
	 * @return Returns nothing
	 */
	Toast.prototype.initializeAnimations = function() {
		var style = document.createElement("style");
		style.innerHTML = "." + iqwerty.toast.identifiers.CLASS_SLIDE_IN +
		"{opacity: 1; bottom: 10%;}" +

		"." + iqwerty.toast.identifiers.CLASS_SLIDE_OUT +
		"{opacity: 0; bottom: -10%;}" +

		"." + iqwerty.toast.identifiers.CLASS_ANIMATED +
		"{transition: opacity " + iqwerty.toast.style.TOAST_ANIMATION_SPEED + "ms, bottom " + iqwerty.toast.style.TOAST_ANIMATION_SPEED + "ms;}";

		document.head.appendChild(style);
	};

	/**
	 * Generate the toast and set the stages
	 * @return {Object} Returns the Toast object
	 */
	Toast.prototype.generate = function() {
		var toastStage = document.createElement("div");
		var textStage = document.createElement("span");
		textStage.innerHTML = this.getText();
		toastStage.appendChild(textStage);

		this.setToastStage(toastStage);
		this.setTextStage(textStage);

		// initialize animation styles for the toast
		this.initializeAnimations();

		return this;
	};

	/**
	 * Show the toast
	 * @return {Object} Returns the Toast object
	 */
	Toast.prototype.show = function() {
		if(this.getToastStage() == null) {
			this.generate();
		}

		var body = document.body;
		var before = body.firstChild;

		// add the animated and initial class (shows at bottom)
		this.getToastStage().classList.add(iqwerty.toast.identifiers.CLASS_ANIMATED);
		this.getToastStage().classList.add(iqwerty.toast.identifiers.CLASS_SLIDE_OUT);

		// insert into the dom
		body.insertBefore(this.getToastStage(), before);
		
		// a hack to "redraw"; without this, the next class will get immediately applied without transitioning
		this.getToastStage().offsetHeight;

		// switch classes; slide the toast up
		this.getToastStage().classList.add(iqwerty.toast.identifiers.CLASS_SLIDE_IN);
		this.getToastStage().classList.remove(iqwerty.toast.identifiers.CLASS_SLIDE_OUT);



		// hide the toast after the timeout
		setTimeout(this.hide.bind(this), this.getDuration());

		return this;
	};

	/**
	 * Hide the toast
	 * @return {Object} Returns the Toast object
	 */
	Toast.prototype.hide = function() {
		if(this.getToastStage() == null) return;

		this.getToastStage().classList.remove(iqwerty.toast.identifiers.CLASS_SLIDE_IN);
		this.getToastStage().classList.add(iqwerty.toast.identifiers.CLASS_SLIDE_OUT);


		setTimeout(function() {
			document.body.removeChild(this.getToastStage());
			this.setToastStage(null);
			this.setText(null);
			this.setTextStage(null);
		}.bind(this), iqwerty.toast.style.TOAST_ANIMATION_SPEED);

		return this;
	};

	/**
	 * Stylize the toast with defaults, or specify an object that contains the custom style
	 * @param  {Object} style A literal object containing the custom style, e.g. toast.stylize({background: "pink", color: "#ff00ff"})
	 * @return {Object}       Returns the Toast object
	 */
	Toast.prototype.stylize = function(style) {
		if(this.getToastStage() == null) {
			this.generate();
		}

		var toastStage = this.getToastStage();
		toastStage.setAttribute("style", iqwerty.toast.style.defaultStyle);


		// apply custom styles if specified
		if(arguments.length == 1) {
			var s = Object.keys(style);
			s.forEach(function(value, index, array) {
				toastStage.style[value] = style[value];
			});
		}


		return this;
	};

	
	return {
		Toast: Toast,


		style: {
			/**
			 * The default styles for the toast. Override these in Toast.stylize()
			 * @type {String}
			 */
			defaultStyle: ""+
				"background: rgba(0, 0, 0, .85);" +
				"z-index: 99999;" +
				"border-radius: 3px;" +
				"color: rgba(255, 255, 255, .9);" +
				"padding: 10px 15px;" +
				"max-width: 40%;" +
				"word-break: keep-all;" +
				"margin: 0 auto;" +
				"text-align: center;" +
				"position: fixed;" +
				"left: 0;" +
				"right: 0;",

			/**
			 * The speed of the toast animation, i.e. how long it takes to fade in/out. Preferably not more than 500
			 * @type {Number}
			 */
			TOAST_ANIMATION_SPEED: 400
		},

		/**
		 * A list of constants that define some identifiers for the Toast
		 * @type {Object}
		 */
		identifiers: {
			CLASS_ANIMATED: "iqwerty_toast_animated",
			CLASS_SLIDE_IN: "iqwerty_toast_slide_in",
			CLASS_SLIDE_OUT: "iqwerty_toast_slide_out"
		}
	};
})();