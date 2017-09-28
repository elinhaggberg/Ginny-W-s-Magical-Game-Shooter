//Create the empty Game over-state
var gameOverState = { };


gameOverState.preload = function () {
    this.game.load.image("gameover-bg","assets/images/gameover.jpg");
    
}

gameOverState.create = function () {
    
    game.add.sprite(0,0,'gameover-bg');
    
    var displayOptions = {
        font: "25px courier",
        fill: "#FFFFFF",
        align: "center"
    }
    
    var yourScoreLable = game.add.text(game.width/2, 50, "Your score:", displayOptions);
    var yourScoreValue = game.add.text(game.width/2, 75, playerScore, displayOptions);
    yourScoreLable.anchor.setTo(0.5,0.5);
    yourScoreValue.anchor.setTo(0.5,0.5);
}

gameOverState.update = function () {
    
}