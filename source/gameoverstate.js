//Create the empty Game over-state
var gameOverState = { };


gameOverState.preload = function () {
    this.game.load.image("gameover-bg","assets/images/gameover.jpg");
    
}

gameOverState.create = function () {
    game.add.sprite(0,0,'gameover-bg');
    
}

gameOverState.update = function () {
    
}