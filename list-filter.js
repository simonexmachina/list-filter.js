(function($){
	$.fn.listFilter = function( inputEl, options ) {
		return this.each(function() {
			var filterList = new ListFilter().init(this, inputEl, options);
			$(this).data('filterList', filterList);
		});
	};
	$.listFilter = {
		defaults: {
			itemSelector: 'li, tbody td',
			onBefore: null,
			onAfter: null,
			hiddenClass: 'hidden'
		}
	};
	var ListFilter = function() {};
	ListFilter.prototype = {
		init: function( listEl, inputEl, options ) {
			var self = this;
			this.listEl = $(listEl);
			this.inputEl = $(inputEl);
			this.options = $.extend({}, $.listFilter.defaults, options);
			function handler(e) {
				if( !e.listFilterHandled ) {
					e.listFilterHandled = true;
					self.filter(e);
				}
			}
			this.inputEl.bind('keyup', handler)
				.bind('change', handler)
				.bind('click', handler);
			$(this).bind('before', this.options.onBefore);
			$(this).bind('after', this.options.onAfter);
		},
		filter: function() {
			var val = this.inputEl.val(),
				self = this;
			var items = this.listEl.find(this.options.itemSelector),
				matched = items.filter(':textContains("' + val + '")'),
				notMatched = items.filter(':not(:textContains("' + val + '"))');
			if( !val ) {
				matched = items;
				notMatched = $([]);
			}
			$(this).trigger('before', matched, notMatched);
			matched.each(function() {
				self.matched(this);
			});
			notMatched.each(function() {
				self.notMatched(this);
			});
			$(this).trigger('after', matched, notMatched);
		},
		matched: function(el) {
			$(el).removeClass(this.options.hiddenClass);
			if( el.tagName == 'TD' ) {
				$(el).css('visibility', 'visible');
			}
			else {
				$(el).show();
			}
		},
		notMatched: function(el) {
			$(el).addClass(this.options.hiddenClass);
			if( el.tagName == 'TD' ) {
				$(el).css('visibility', 'hidden');
			}
			else {
				$(el).hide();
			}
		}
	}
	$.extend($.expr[':'], {
		textContains: function(a,i,m){
			return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
		}
	});
})(jQuery);
