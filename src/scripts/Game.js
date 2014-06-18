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
			game.team.player.callAll('think');
			game.team.enemy.callAll('think');
		},
		render: function() {
			/*
			function renderBodies(sprite) {
				game.debug.geom(sprite.damageZone, 'rgba(215, 44, 44, 0.5);');
				game.debug.body(sprite);
			}

			game.team.player.forEach(renderBodies);
			game.team.enemy.forEach(renderBodies);
			*/
		}
	}

	exports.Game = Game;	
})(this);
