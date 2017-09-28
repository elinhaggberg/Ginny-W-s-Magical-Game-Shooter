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
    this.game.load.image("snitch", "assets/images/snitch.png")
    this.game.load.image("red-spell", "assets/images/red-spell.png");
    this.game.load.image("blue-spell", "assets/images/blue-spell.png")
    //Load all shooting effects
    this.game.load.audio("player-fire-01","assets/audio/player_fire_01.mp3");
    this.game.load.audio("player-fire-02","assets/audio/player_fire_02.mp3");
    this.game.load.audio("player-fire-03","assets/audio/player_fire_03.mp3");
    this.game.load.audio("player-fire-04","assets/audio/player_fire_04.mp3");
    this.game.load.audio("player-fire-05","assets/audio/player_fire_05.mp3");
    this.game.load.audio("player-fire-06","assets/audio/player_fire_06.mp3");
}

//Add the create function 
mainGameState.create = function() {
    
//Load the Physics system

game.physics.startSystem(Phaser.Physics.ARCADE);
    
//Add background
    game.add.sprite(0, 0, 'game-bg');
    
//Create group for falling Quaffle balls 
    this.balls = game.add.group();
    
//Create group for fired spells 
    this.spells = game.add.group();
    
//Create the shooting sound effects 
    this.playerFireSfx = [];
    this.playerFireSfx.push(game.add.audio("player-fire-01"));
    this.playerFireSfx.push(game.add.audio("player-fire-02"));
    this.playerFireSfx.push(game.add.audio("player-fire-03"));
    this.playerFireSfx.push(game.add.audio("player-fire-04"));
    this.playerFireSfx.push(game.add.audio("player-fire-05"));
    this.playerFireSfx.push(game.add.audio("player-fire-06"));
    
//Add the background music
    this.music = game.add.audio('game-music');
    this.music.play();
    this.music.volume = 0.5;
    this.music.loop = true;
    
//Add coordinate-variables that uses game width and height    
    var x = game.width * 0.5;
    var y = game.height * 0.8;
    
//Timer for balls 
    this.ballTimer = 2.0;
    
//Timer for spell shooting speed 
    this.spellTimer = 0.3;
    
//Timer for the golden snitch
    this.snitchTimer = 4.0;

//Add the player-sprite and set its anchorpoint and scale
    this.playerSprite = game.add.sprite(x,y,'player');
    this.playerSprite.anchor.setTo(0.5,0.5);
    this.playerSprite.scale.setTo(0.5);   
    
//Enable movement of the Player 
    game.physics.arcade.enable(this.playerSprite);
    this.playerSprite.body.imovable = true;
    
//CONTROLS – activating the game controls for the player 
    this.cursors = game.input.keyboard.createCursorKeys();
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z); 
    this.specialFireKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    
//Random directions for the snitch
    this.randomSpeed = game.rnd.integerInRange(-10,10);
    
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
    
mainGameState.updateRedSpell();
    
//Confiding ship to game screen
    if ( (this.playerSprite.x > game.width - 40) && ( this.playerSprite.body.velocity.x > 0 ) ) {
        this.playerSprite.body.velocity.x = 0;
    }

    if ( (this.playerSprite.x < 40 ) && (this.playerSprite.body.velocity.x < 0) ) {
        this.playerSprite.body.velocity.x = 0;
    }
    
//Confinding the Snitch to game screen
    
    //var randomSpeedX = game.rnd.integerInRange(200,500);
    //var randomSpeedY = game.rnd.integerInRange(-300, 600);
    
    /*if ( (this.snitchBall.x > game.width) && (
    this.snitchBall.body.velocity.x > 0 ) ) {
        
        console.log("SNICTH! STAAAPHW!")
        
        //this.snitchBall.body.velocity.x = -randomSpeedX;
        //this.snitchBall.body.velocity.y = randomSpeedY;
    } */
    
   /* if ( (this.snitchBall.x < -30 ) && ( 
    this.snitchBall.body.velocity.x < 0 ) ) {
        this.snitchBall.body.velocity.x = randomSpeedX;
        this.snitchBall.body.velocity.y = randomSpeedY;
    } */

//Set up the ballTimer 
    this.ballTimer -= game.time.physicsElapsed;
    if (this.ballTimer <= 0.0) {
        mainGameState.spawnQuaffle();
        mainGameState.spawnBludger();
        this.ballTimer = 2.0;
    }
    
    
//Set up the snitchTimer
    if (this.snitchTimer != null) {
        this.snitchTimer -= game.time.physicsElapsed;
        if (this.snitchTimer <= 0.0) {
            console.log("HERE COMES THE SNITCH");
            mainGameState.spawnSnitch();
            this.snitchTimer = null;
        }
    }

//Iterate over balls-group to destroy
    
    for( var i=0; i < this.balls.children.length; i++) {
        if ( this.balls.children[i].y > (game.height + 200) ) {
            this.balls.children[i].destroy();
        }
    }

//Create the collision callback function for spells hitting balls
    game.physics.arcade.collide(this.balls,this.spells,mainGameState.onBallAndSpellCollision,null,this);


// STAY INSIDE THE FUNCTION, ELIN!!!!!  
}

//Create the spawnQuaffle function 
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

//Creates the spawnBludger function
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

//Creates the spawnSnitch function

mainGameState.spawnSnitch = function () {
    
    var x = game.rnd.integerInRange(0,game.width);
    var y = game.rnd.integerInRange(0,game.height);
    var z = this.randomSpeed;
    var snitchBall = game.add.sprite(x,y,'snitch');
    snitchBall.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(snitchBall);
    snitchBall.body.velocity.setTo(z,z);
}

//Creates the spawnRedSpell function
mainGameState.spawnRedSpell = function () {
    var x = this.playerSprite.x - 19;
    var y = this.playerSprite.y + -120;
    var redSpell = game.add.sprite(x,y,'red-spell');
    game.physics.arcade.enable(redSpell);
    redSpell.body.velocity.setTo(0, -300);
    this.spells.add(redSpell);
    
    //Adding the soundfx for shooting a spell
    var index = game.rnd.integerInRange(0, this.playerFireSfx.length - 1);
    this.playerFireSfx[index].play();
}

mainGameState.spawnBlueSpell = function () {
    var x = this.playerSprite.x - 19;
    var y = this.playerSprite.y + -120;
    var blueSpell = game.add.sprite(x,y,'blue-spell');
    game.physics.arcade.enable(blueSpell);
    blueSpell.body.velocity.setTo(0, -300);
    this.spells.add(blueSpell);
    
    //Adding the soundfx for shooting a spell
    var index = game.rnd.integerInRange(0, this.playerFireSfx.length - 1);
    this.playerFireSfx[index].play();
}

mainGameState.updateRedSpell = function () {
    
    //Shoot redSpells with Z key every 0.3s
    this.spellTimer -= game.time.physicsElapsed;
    if ( (this.spellTimer <= 0.0) && (this.fireKey.isDown) ) {
        mainGameState.spawnRedSpell();
        this.spellTimer = 0.3;
    }
    
    //Shoot blueSpells with X key every 0.3s 
    this.spellTimer -= game.time.physicsElapsed;
    if ( (this.spellTimer <= 0.0 ) && (this.specialFireKey.isDown) ) {
        mainGameState.spawnBlueSpell();
        this.spellTimer = 0.3;
    }
    
    //Interate over fired spells to destroy
    for ( var i=0; i < this.spells.children.length; i++) {
        if ( this.spells.children[i].y < -100 ) {
            this.spells.children[i].destroy();
        }
    }
    
    
}


//Create function for collision of Quaffle balls and spells

mainGameState.onBallAndSpellCollision = function (ball,spell) {
    ball.pendingDestroy = true;
    spell.pendingDestroy = true;
}


