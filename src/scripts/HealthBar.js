(function(exports) {
	function HealthBar(game, size) {
		Phaser.Sprite.call(this, game, 0, 0, 'health-bar');

		this._value = 100;
		this._max = 100;
		this._rect = new Phaser.Rectangle(0, 0, this.width, this.height);

		this.crop(this._rect);

		var overlay = game.make.sprite(0, 0, 'health-bar-overlay');
		this.addChild(overlay);

		this._updateGraphics();
	}

	_.extend(HealthBar, {
		preload: function(load) {
			load.image('health-bar', 'assets/img/health bar.png');
			load.image('health-bar-overlay', 'assets/img/health bar overlay.png');
		}
	});

	HealthBar.prototype = Object.create(Phaser.Sprite.prototype);
	HealthBar.prototype.constructor = HealthBar;

	_.extend(HealthBar.prototype, {
		setTo: function(value, max) {
			if(max !== undefined) this.max = max;
			this.value = value;
		},
		subtract: function(amount) {
			this.value = this.value - amount;
		},
		_updateGraphics: function() {
			var val = this.value,
				max = this.max,
				fraction = val / max;
	
			this.visible = val < max;
			this._rect.width = this.width * fraction; 
		}
	});

	Object.defineProperties(HealthBar.prototype, {
		value: {
			get: function() {
				return this._value;
			},
			set: function(value) {
				value = Math.min(value, this.max);
				value = Math.max(value, 0);
				this._value = value;

				this._updateGraphics();

				return this._value;
			}
		},
		max: {
			get: function() {
				return this._max;
			},
			set: function(value) {
				value = Math.max(value, 0);
				this._max = value;

				if(this.value > this._max)
					this.value = value;
				
				this._updateGraphics();
			}
		}
	});

	exports.HealthBar = HealthBar;
})(this);
	
