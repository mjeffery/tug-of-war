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
		
		this.hp.x = -32;
		this.hp.y = -32;

		// Add a sword sprite
		key = (team == Team.PLAYER) ? 'placeholder-player-sword' : 'placeholder-enemy-sword';
		var sword = this.sword = game.make.sprite(0, 50, key);
		this.addChild(sword);
		sword.anchor.setTo(0.5, 1.0);
		sword.visible = false;

		this._zone = new Phaser.Rectangle();

		this.walk();
	}

	_.extend(Tank, {
		Walk: { Speed: 100 },
		Attack: { 
			Range: 50,
			Angle: 135,
			Duration: 600,
			Easing: Phaser.Easing.Quartic.Out,
			DamageDelay: 100,
			Damage: 40,
			Zone: {
				X: 120,
				Y: 25,
				Width: 120,
				Height: 100
			},
			Cooldown: 0.5
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
			var nearest = this.getNearestInFront();	

			switch(this.state) {
				case 'walking': 
					if(nearest.dist <= Tank.Attack.Range) {
						this.stop();
						this.attack(nearest.unit);
					}
					break;

				case 'standing':
					if(nearest.dist <= Tank.Attack.Range) 
						this.attack(nearest.unit);
					else
						this.walk();
					break;

				case 'cooling down':
					this.cooldownTimer -= this.game.time.physicsElapsed;
					if(this.cooldownTimer <= 0) {
						this.stand();
					}
					break;
			}
		},
		stop: function() {
			switch(this.state) {
				case 'walking': 
					this.body.velocity.x = 0;
					this.animations.play('idle');
					this.state = 'idle';
				break;
				case 'attacking':
					this.cleanUpAttack();
					this.state = 'idle';
				break;
			}
		},
		walk: function() {
			this.animations.play('walk');

			if(this.facing === Phaser.RIGHT) 
				this.body.velocity.x = Tank.Walk.Speed;	
			else
				this.body.velocity.x = -Tank.Walk.Speed;

			this.state = 'walking';
		},
		stand: function() {
			this.state = 'standing';
			this.body.velocity.x = 0;
			this.animations.play('idle');
		},
		attack: function(victim) {
			this.state = 'attacking';	

			var game = this.game,
				sword = this.sword,
				tween = this.sword.tween = game.add.tween(sword),
				angle = (this.team == Team.PLAYER) ? Tank.Attack.Angle : -Tank.Attack.Angle;

			sword.visible = true;
			sword.bringToTop();
			sword.angle = 0;

			// TODO how does interruption work?
			tween.to({ angle: angle }, Tank.Attack.Duration, Tank.Attack.Easing, true)
				.onComplete.addOnce(this.attackCooldown, this);
			
			// use a rectangle for zone intersection
			game.time.events.add(Tank.Attack.DamageDelay, function() {
				var zone = this.damageZone;
				this.foes.forEachExists(function(foe) {
					if(zone.intersects(foe.body))
						foe.damage(Tank.Attack.Damage);
				}, this);
			}, this);
		},
		attackCooldown: function() {
			this.cleanUpAttack();
			
			this.state = 'cooling down';
			this.cooldownTimer = Tank.Attack.Cooldown; 
		},
		cleanUpAttack: function() {
			var sword = this.sword;

			sword.visible = false;
			if(sword.tween) {
				if(sword.tween.isRunning) sword.tween.stop();
				sword.tween = undefined;
			}
		},
		damage: function(amount) {
			this.hp.subtract(amount);
			
		}
	});

	Object.defineProperty(Tank.prototype, 'damageZone', {
		get: function() {
			var w = Tank.Attack.Zone.Width,
				h = Tank.Attack.Zone.Height,
				x = this.x + (this.team === Team.PLAYER ? Tank.Attack.Zone.X - w : -Tank.Attack.Zone.X),
				y = this.y + Tank.Attack.Zone.Y;

			this._zone.setTo(x, y, Tank.Attack.Zone.Width, Tank.Attack.Zone.Height);	

			return this._zone;
		}
	})

	exports.Tank = Tank;
})(this);
	
