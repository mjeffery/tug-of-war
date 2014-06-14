(function(exports) {
	exports.UnitMixin = Mixin({
		
	}, {
		leadingEdge: {
			get: function() {
				var halfwidth = this.width / 2;
				return this.x + (this.team === Team.PLAYER ? halfwidth : -halfwidth);
			}
		}		
	});
})(this);
