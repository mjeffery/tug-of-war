(function(exports) {
	function Preload() {}

	Preload.prototype = {
		preload: function() {
			var x = 250,
				y = 296,
				add = this.add,
				load = this.load;

			add.sprite(x, y, 'loading-bar-bg');

			var loadingBar = add.sprite(x, y, 'loading-bar');
			load.setPreloadSprite(loadingBar);

			load.bitmapFont('minecraftia', 'assets/font/minecraftia.png', 'assets/font/minecraftia.xml');

			// Preload content here
			load.image('horizon-line', 'assets/img/placeholder horizon.png');
			Tank.preload(load);

			load.onLoadComplete.addOnce(this.onLoadComplete, this);					
		},
		create: function() {
			this.stage.backgroundColor = '#000000';
		},
		onLoadComplete: function() {
			this.state.start('game');
		}
	};

	exports.Preload = Preload;
})(this);
