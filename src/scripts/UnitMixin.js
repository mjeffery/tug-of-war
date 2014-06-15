(function(exports) {
	var UnitMixin = Mixin({
		initialize: function() {
			var hp = this.hp = new HealthBar(this.game);
			this.addChild(hp);
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
		}
	});

	exports.UnitMixin = UnitMixin;
})(this);
