(function(exports) {
	function Tank(game, x, y, team) {
		var key = (team == Team.PLAYER) ?  'placeholder-tank.png' :  'placeholder-enemy-tank.png';
		Phaser.Sprite.call(this, game, x, y, key);
		this.initialize();
	
		this.anchor.setTo(0.5, 0);

		this.animations.add('idle', [2]);
		this.animations.add('walk', [0, 1], 5, true);
		this.animations.play('idle');

		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.team = team;
		this.facing = (team === Team.PLAYER) ? Phaser.RIGHT : Phaser.LEFT;

		this.hp.setTo(50);
		this.hp.x = -32;
		this.hp.y = -32;

		// Add a sword sprite
		key = (team == Team.PLAYER) ? 'placeholder-player-sword' : 'placeholder-enemy-sword';
		var sword = this.sword = game.make.sprite(0, 50, key);
		this.addChild(sword);
		sword.anchor.setTo(0.5, 1.0);
		sword.visible = false;

		this.walk();
		this.attack();
	}

	_.extend(Tank, {
		Walk: { Speed: 100 },
		Attack: { 
			Angle: 135,
			Duration: 600,
			Easing: Phaser.Easing.Quartic.Out
		},
		preload: function(load) {
			load.spritesheet('placeholder-tank.png', 'assets/spritesheet/placeholder tank.png', 78, 150);
			load.spritesheet('placeholder-enemy-tank.png', 'assets/spritesheet/placeholder enemy tank.png', 78, 150);
			load.image('placeholder-player-sword', 'assets/img/placeholder sword.png');
			load.image('placeholder-enemy-sword', 'assets/img/placeholder enemy sword.png');
		}
	});

	Tank.prototype = Object.create(Phaser.Sprite.prototype);
	Tank.prototype.constructor = Tank;

	UnitMixin(Tank.prototype);

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
		},
		attack: function() {
			var sword = this.sword,
				tween = this.game.add.tween(sword),
				angle = (this.team == Team.PLAYER) ? Tank.Attack.Angle : -Tank.Attack.Angle;

			sword.visible = true;

			tween.to({ angle: angle }, Tank.Attack.Duration, Tank.Attack.Easing)
				.onComplete.addOnce(function() {
					sword.visible = false;
					sword.angle = 0;
					this.attack();
					//TODO damage
				}, this);

			tween.start();
		}
	});

	exports.Tank = Tank;
})(this);
	
