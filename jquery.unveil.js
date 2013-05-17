/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 *
 * Modified to have a callback on unveiling rather than simply lazy load an image.
 * Usage: $('.lazy').unveil({ unveiled: function () { ... } });
 */

;(function ($) {
	'use strict';

	$.fn.unveil = function (options) {
		var settings = $.extend({}, $.fn.unveil.defaults, typeof options === 'object' ? options : { threshold: options, unveiled: null }),
			$w = $(window),
			th = settings.threshold || 0,
			retina = window.devicePixelRatio && window.devicePixelRatio > 1,
			attrib = retina ? "data-src-retina" : "data-src",
			images = this,
			loaded,
			inview,
			source;

		this.one("unveil", function () {
			if ($.isFunction(settings.unveiled)) {
				settings.unveiled.apply(this, undefined);
			} else {
				source = this.getAttribute(attrib);
				source = source || this.getAttribute("data-src");
				if (source) {
					this.setAttribute("src", source);
				}
			}
		});

		function unveil() {
			var wt = $w.scrollTop(),
				wb = wt + $w.height();

			inview = images.filter(function () {
				var $e = $(this),
					et = $e.offset().top,
					eb = et + $e.height();

				return eb >= wt - th && et <= wb + th;
			});

			loaded = inview.trigger("unveil");
			images = images.not(loaded);
		}

		$w.scroll(unveil);
		$w.resize(unveil);

		unveil();

		return this;
	};

	$.fn.unveil.defaults = {
		threshold: 0,
		unveiled: null
	};
}(jQuery));