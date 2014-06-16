(function(exports) {
	var UnitMixin = Mixin({
		initialize: function() {
			var hp = this.hp = new HealthBar(this.game);
			this.addChild(hp);
		},
		getNearestInFront: function(n) {
			var array = [];
			this.foes.forEachExists(array.push, array);

			var result = _(array)
				.filter(function(foe) {
					//TODO does this need a concept of a unit "front"?
					return this.team === Team.PLAYER && foe.front > this.front ||
						   this.team !== Team.PLAYER && foe.front < this.front;
				}, this)
				.map(function(foe) { 
					return { 
						unit: foe, 
						dist: Math.abs(foe.front - this.front)
					}
				}, this)
				.sortBy('dist')
				.first(n || 1)
				.valueOf();

			if(_.isEmpty(result)) {
				result.push({
					unit: undefined,
					dist: Infinity 
				});
			}

			return (n === undefined) ? result[0] : result;
		}
	}, {
		// get the Team group containing friendly units
		friends: {
			get: function() {
				var team = this.game.team;
				return (this.team === Team.PLAYER) ? team.player : team.enemy; 
			}
		},
		// get the Team group containing enemy units
		foes: {
			get: function() {
				var team = this.game.team;
				return (this.team === Team.PLAYER) ? team.enemy : team.player; 
			}
		},
		front: {
			get: function() {
				var offset = Math.abs(this._front || this.width / 2);
				return (this.team === Team.PLAYER) ? this.x + offset : this.x - offset;
			},
			set: function(value) {
				this._front = value;
			}
		}
	});

	exports.UnitMixin = UnitMixin;
})(this);
