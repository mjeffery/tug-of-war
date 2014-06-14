(function(exports) {
	function Team(game, team) {
		Phaser.Group.call(this, game);

		this.team = team;
	}

	_.extend(Team, {
		PLAYER: 0,
		ENEMY: 1
	});

	Team.prototype = Object.create(Phaser.Group.prototype);
	Team.prototype.constructor = Team;

	Object.defineProperty(Team.prototype, '', {
		get: function() {
			
		}
	});

	exports.Team = Team;
})(this);
