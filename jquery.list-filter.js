(function($){
	$.fn.listFilter = function( inputEl, options ) {
		return this.each(function() {
			var filterList = new ListFilter().init(this, inputEl, options);
			$(this).data('filterList', filterList);
		});
	};
	var ListFilter = function() {};
	ListFilter.prototype = {
		init: function( listEl, inputEl, options ) {
			var defaults = {
					itemSelector: 'li',
					onBefore: null,
					onAfter: null,
				},
				self = this;
			this.listEl = $(listEl);
			this.inputEl = $(inputEl);
			this.options = $.extend(defaults, options);
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
			var val = this.inputEl.val();
			var items = this.listEl.find(this.options.itemSelector),
				matched = items.filter(':textContains("' + val + '")'),
				notMatched = items.filter(':not(:textContains("' + val + '"))');
			if( !val ) {
				items.show();
				return;
			}
			$(this).trigger('before', matched, notMatched);
			matched.show();
			notMatched.hide();
			$(this).trigger('after', matched, notMatched);
		}
	}
	$.extend($.expr[':'], {
		textContains: function(a,i,m){
			return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
		}
	});
})(jQuery);