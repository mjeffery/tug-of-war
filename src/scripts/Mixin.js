(function(exports) {
	function override(object, key, fn) {
		var superFn = object[key];
		object[key] = function() {
			var prevSuper = this.__super;
			this.__super = superFn;

			fn.apply(this, arguments);

			this.__super = prevSuper;
		}
	}

	function Mixin(proto, properties) {
		return function(object) {
			if(_.isObject(proto)) {
				_.each(proto, function(fn, key) {
					if(object.hasOwnProperty(key))
						override(object, key, fn);	
					else
						object[key] = fn;
				});
			}

			if(_.isObject(properties))
				Object.defineProperties(object, properties);
		};
	}

	exports.override = override;
	exports.Mixin = Mixin;
})(this);
