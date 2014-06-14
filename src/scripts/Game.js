(function(exports) {
	function Game() {}

	Game.prototype = {
		create: function() {
			var game = this.game,
				add = this.add;

			game.stage.backgroundColor = '#FFFFFF';
			add.tileSprite(0, 450, 1000, 32, 'horizon-line', 0);			

			game.team = {
				player: add.existing(new Team(game, Team.PLAYER)),
				enemy: add.existing(new Team(game, Team.ENEMY))
			};

			game.team.player.add(new Tank(game, 100, 400, Team.PLAYER));
			game.team.enemy.add(new Tank(game, 680, 400, Team.ENEMY));
		},
		update: function() {

		}
	}

	exports.Game = Game;	
})(this);
