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
    
//Load the Physics system

game.physics.startSystem(Phaser.Physics.ARCADE);
    
//Add background
    game.add.sprite(0, 0, 'game-bg');
    
//Add coordinate-variables that uses game width and height    
    var x = game.width * 0.5;
    var y = game.height * 0.8;

//Add the player-sprite and set its anchorpoint and scale
    this.playerSprite = game.add.sprite(x,y,'player');
    this.playerSprite.anchor.setTo(0.5,0.5);
    this.playerSprite.scale.setTo(0.5);   
    
//Enable movement of the Player 
    game.physics.arcade.enable(this.playerSprite);
    
//CONTROLS – creating the game controls for the player 
    this.cursors = game.input.keyboard.createCursorKeys();
    
    
}

// Add the update function 
mainGameState.update = function() {
    
     if (this.cursors.right.isDown) {
        this.playerSprite.body.velocity.x = 200;
    } else if (this.cursors.left.isDown) {
        this.playerSprite.body.velocity.x = -200;
    } else {
        this.playerSprite.body.velocity.x= 0;
    }
    
}



