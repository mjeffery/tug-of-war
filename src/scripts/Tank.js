(function(exports) {
	function Tank(game, x, y, team) {
		var key = (team == Team.PLAYER) ?  'placeholder-tank.png' :  'placeholder-enemy-tank.png';
		Phaser.Sprite.call(this, game, x, y, key);
	
		this.anchor.setTo(0.5, 0);

		this.animations.add('idle', [2]);
		this.animations.add('walk', [0, 1], 5, true);
		this.animations.play('idle');

		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.team = team;
		this.facing = (team === Team.PLAYER) ? Phaser.RIGHT : Phaser.LEFT;

		this.walk();
	}

	_.extend(Tank, {
		Walk: { Speed: 100 },
		preload: function(load) {
			load.spritesheet('placeholder-tank.png', 'assets/spritesheet/placeholder tank.png', 78, 150);
			load.spritesheet('placeholder-enemy-tank.png', 'assets/spritesheet/placeholder enemy tank.png', 78, 150);
		}
	});

	Tank.prototype = Object.create(Phaser.Sprite.prototype);
	Tank.prototype.constructor = Tank;

	_.extend(Tank.prototype, {
		think: function() {
		},
		walk: function() {
			this.animations.play('walk');

			if(this.facing === Phaser.RIGHT) 
				this.body.velocity.x = Tank.Walk.Speed;	
			else
				this.body.velocity.x = -Tank.Walk.Speed;

			this.state = 'walking';
		}
	});

	exports.Tank = Tank;
})(this);
	
