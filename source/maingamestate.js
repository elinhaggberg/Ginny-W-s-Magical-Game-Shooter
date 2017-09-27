//Create an empty object
var mainGameState = { };

// Add the preload function 
mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    this.game.load.image("game-bg", "assets/images/ginny-w-bg.jpg")
    this.game.load.image("player", "assets/images/ginny-w-player.png")
}

//Add the create function 

mainGameState.create = function() {
    
    var x = game.width * 0.5;
    var y = game.height * 0.8;
    
    game.add.sprite(0, 0, 'game-bg');
    
    this.playerSprite = game.add.sprite(x,y,'player');
    this.playerSprite.anchor.setTo(0.5,0.5);
    this.playerSprite.scale.setTo(0.5);   
    
}

// Add the update function 
mainGameState.update = function() {
    
}



