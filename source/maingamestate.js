//Create an empty object
var mainGameState = { };

// Add the preload function 
mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    this.game.load.image("game-bg", "assets/images/ginny-w-bg.jpg")
    this.game.load.image("player", "assets/images/ginny-w-player.png")
    this.game.load.audio("game-music", "assets/music/harry-potter-8bit.WAV")
    this.game.load.image("quaffle", "assets/images/quaffle.png")
    this.game.load.image("bludger", "assets/images/bludger.png")
}

//Add the create function 
mainGameState.create = function() {
    
//Load the Physics system

game.physics.startSystem(Phaser.Physics.ARCADE);
    
//Add background
    game.add.sprite(0, 0, 'game-bg');
    
//Create group for falling balls 
    this.balls = game.add.group();
    
//Add the background music
    this.music = game.add.audio('game-music');
    this.music.play();
    this.music.volume = 0.5;
    this.music.loop = true;
    
//Add coordinate-variables that uses game width and height    
    var x = game.width * 0.5;
    var y = game.height * 0.8;

//Add the player-sprite and set its anchorpoint and scale
    this.playerSprite = game.add.sprite(x,y,'player');
    this.playerSprite.anchor.setTo(0.5,0.5);
    this.playerSprite.scale.setTo(0.5);   
    
//Enable movement of the Player 
    game.physics.arcade.enable(this.playerSprite);
    
//CONTROLS – activating the game controls for the player 
    this.cursors = game.input.keyboard.createCursorKeys();

//Timer for balls 
    this.ballTimer = 2.0;
    
}

// Add the update function 
mainGameState.update = function() {
    
//Setting up the right and left arrow controls   
     if (this.cursors.right.isDown) {
        this.playerSprite.body.velocity.x = 300;
    } else if (this.cursors.left.isDown) {
        this.playerSprite.body.velocity.x = -300;
    } else {
        this.playerSprite.body.velocity.x= 0;
    }
    
//Confiding ship to game screen
    if ( (this.playerSprite.x > game.width - 40) && ( this.playerSprite.body.velocity.x > 0 ) ) {
        this.playerSprite.body.velocity.x = 0;
    }

    if ( (this.playerSprite.x < 40 ) && (this.playerSprite.body.velocity.x < 0) ) {
        this.playerSprite.body.velocity.x = 0;
    }

//Set up the ballTimer 
    this.ballTimer -= game.time.physicsElapsed;
    if (this.ballTimer <= 0.0) {
        mainGameState.spawnQuaffle();
        mainGameState.spawnBludger();
        this.ballTimer = 2.0;
    }

//Iterate over balls-group to destroy
    
    for( var i=0; i < this.balls.children.length; i++) {
        if ( this.balls.children[i].y > (game.height + 200) ) {
            this.balls.children[i].destroy();
            console.log("BALL DESTROYED!");
        }
    }

// STAY INSIDE THE FUNCTION, ELIN!!!!!  
}

//Create the spawnQuaffle-function 
mainGameState.spawnQuaffle = function () {
    
    var x = game.rnd.integerInRange(0,game.width);
    var spinSpeed = game.rnd.integerInRange(50,200);
    var fallSpeed = game.rnd.integerInRange(80,150);
    var quaffleBall = game.add.sprite(x,0,'quaffle');
    quaffleBall.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(quaffleBall);
    quaffleBall.body.velocity.setTo(0,fallSpeed);
    quaffleBall.body.angularVelocity = spinSpeed;
    
    this.balls.add(quaffleBall);
    
}

mainGameState.spawnBludger = function () {
    
    var x = game.rnd.integerInRange(0,game.width);
    var spinSpeed = game.rnd.integerInRange(80,250);
    var fallSpeed = game.rnd.integerInRange(100,200);
    var bludgerBall = game.add.sprite(x,0,'bludger');
    bludgerBall.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(bludgerBall);
    bludgerBall.body.velocity.setTo(0,fallSpeed);
    bludgerBall.body.angularVelocity = spinSpeed;
    
    this.balls.add(bludgerBall);
    
}


