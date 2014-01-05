
;(function () {

	function Slides(id, options) {
		var _this = this;

		this.$container = $(id);
		this.$slides = this.$container.find('.slide');

		var idx = this.$container.find('.slide.active').index();
		if (idx === -1) {
			this.activeIdx = 0;
			this.$slides.first().addClass('active');
		}
		else {
			this.activeIdx = idx;
		}

		this.options = options;

		var parts = options.aspect.split('x');
		this.aspectRatio = parts[0] / parts[1];

		this.attachListeners();
		
		this.adjustContainerHeight();

		var height = this.$container.width() / this.aspectRatio;

		this.$container.find('img').on('load', function () {
			var $t = $(this);
			var h = $t.height();

			if (h < height) {
				$t.css({
					width: 'auto',
					height: '100%'
				});
			}
		}).each(function () {
			var $t = $(this);
			var h = $t.height();

			if (h === 0) {
				return;
			}

			if (h < height) {
				$t.css({
					width: 'auto',
					height: '100%'
				});
			}
		});

		if (options.interval) {
			this.intervalId = setInterval(function () {
				_this.next.call(_this);
			}, options.interval);
		}
	}

	Slides.fn = Slides.prototype;

	Slides.fn.destroy = function () {
		clearInterval(this.intervalId);
		this.$container.find('img').off('load').css({width: '', height: ''});
		$(window).off('resize');
	};

	Slides.fn.attachListeners = function () {
		var _this = this;
		
		$(window).on('resize', function (e) {
			_this.onResize.call(_this);
		});
	};

	Slides.fn.adjustContainerHeight = function () {
		var width = this.$container.width();

		var height = width / this.aspectRatio;
		this.$container.css({height: height});
	};

	Slides.fn.onResize = function () {
		this.adjustContainerHeight();
	};

	Slides.fn.previous = function () {
		var nextIdx = (this.activeIdx - 1) % this.$slides.length;
		if (nextIdx < 0) {
			nextIdx = this.$slides.length + nextIdx;
		}

		$(this.$slides[this.activeIdx]).removeClass('active');
		$(this.$slides[nextIdx]).addClass('active');
		this.activeIdx = nextIdx;
	};

	Slides.fn.next = function () {
		var nextIdx = (this.activeIdx + 1) % this.$slides.length;
		$(this.$slides[this.activeIdx]).removeClass('active');
		$(this.$slides[nextIdx]).addClass('active');
		this.activeIdx = nextIdx;
	};

	window.Slides = Slides;

})();
