//Create an empty object
var mainGameState = { };

var playerScore = 0;

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
    //Load all hit effects 
    this.game.load.audio("ball-hit-01","assets/audio/asteroid_hit_01.mp3");
    this.game.load.audio("ball-hit-02","assets/audio/asteroid_hit_02.mp3");
    this.game.load.audio("ball-hit-03","assets/audio/asteroid_hit_03.mp3");
    this.game.load.audio("ball-hit-04","assets/audio/asteroid_hit_04.mp3");
    this.game.load.audio("ball-hit-05","assets/audio/asteroid_hit_05.mp3");
    this.game.load.audio("ball-hit-06","assets/audio/asteroid_hit_06.mp3");
    this.game.load.audio("player-hit","assets/audio/player_hit_01.mp3");
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
    
//Create the ball hitting soundfx
    this.ballHitSfx = [];
    this.ballHitSfx.push(game.add.audio("ball-hit-01"));
    this.ballHitSfx.push(game.add.audio("ball-hit-02"));
    this.ballHitSfx.push(game.add.audio("ball-hit-03"));
    this.ballHitSfx.push(game.add.audio("ball-hit-04"));
    this.ballHitSfx.push(game.add.audio("ball-hit-05"));
    this.ballHitSfx.push(game.add.audio("ball-hit-06"));
    
//Create the player hitting soundfx
    this.playerHitsfx = game.add.audio("player-hit");
    
//Add the background music
    this.music = game.add.audio('game-music');
    this.music.play();
    this.music.volume = 0.5;
    this.music.loop = true;
    
//Add coordinate-variables that uses game width and height    
    var x = game.width * 0.5;
    var y = game.height * 0.8;
    
//Variable for game speed
    this.gameSpeed = 1;    
    
//Timer for balls 
    this.ballTimer = 2.0;
    
//Timer for spell shooting speed 
    this.spellTimer = 0.3;
    
//Timer for the golden snitch
    this.snitchTimer = 4.0;
    
//Timer for game speed
    this.gameSpeedTimer = 30.0;
    
//Variable for player lives
    this.playerLife = 3;
    
//Timer for player immunity to damage
    this.playerImmunityTimer = 0;
    
//Add the score and life text sprites
    var displayOptions = {
        font: "16px Courier",
        fill: "#FFFFFF",
        align: "center"
    }
    
    //Add score title text sprite
    this.scoreTitle = game.add.text(game.width * 0.80, 30, "SCORE", displayOptions);
    this.scoreTitle.fixedToCamera = true;
    
    //Add score value text sprite
    this.scoreValue = game.add.text(game.width * 0.855, 50, playerScore, displayOptions);
    playerScore.fixedToCamera = true;
    
    //Add life label text sprite 
    this.lifeTitle = game.add.text(game.width * 0.1, 30, "LIVES", displayOptions);
    this.lifeTitle.fixedToCamera = true;
    
    //Add life value text sprite
    this.lifeValue = game.add.text(game.width * 0.155, 50, this.playerLife, displayOptions);
    this.lifeValue.fixedToCamera = true;

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
    
//IF THE SNITCH EXISTS: Confinding the Snitch to game screen
    
    
    if ( this.snitchBall != null ) {
    
        if ( (this.snitchBall.x > game.width + 100) && (
        this.snitchBall.body.velocity.x > 0 ) ) {

            this.snitchBall.body.velocity.x = -this.randomSpeed;

        } 
        
        if ( (this.snitchBall.x < -100 ) && ( this.snitchBall.body.velocity.x < 0 ) ) {
            this.snitchBall.body.velocity.x = this.randomSpeed;
        }
        
        if ( (this.snitchBall.y > game.height + 100) && (this.snitchBall.body.velocity.y > 0 )) {
            this.snitchBall.body.velocity.y = -this.randomSpeed;
        }
        
        if ( (this.snitchBall.y < -100 ) && (this.snitchBall.body.velocity.y < 0 )) {
            this.snitchBall.body.velocity.y = this.randomSpeed;
        }
        
    }
    
//Set up the random speed variable for the snitch
    
    this.randomSpeed = game.rnd.integerInRange(200,450);

//Set up the ballTimer 
    this.ballTimer -= game.time.physicsElapsed;
    if (this.ballTimer <= 0.0) {
        mainGameState.spawnQuaffle();
        mainGameState.spawnBludger();
        if (this.gameSpeed < 2) {
        this.ballTimer = 2.0 - (this.gameSpeed/2);
        } else {
        this.ballTimer = 1.0;
        }
        
        console.log(this.ballTimer);
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
    
//Set up the gameSpeedTimer
    this.gameSpeedTimer -= game.time.physicsElapsed;
    if ( this.gameSpeedTimer <= 0.0 ) {
        this.gameSpeed += 0.3;
        console.log("Game Speed increased");
        console.log(this.gameSpeed);
        this.gameSpeedTimer = 10.0;
    }

    //Set up the player immunity timer 
    
    this.playerImmunityTimer -= game.time.physicsElapsed;

    
//Iterate over balls-group to destroy
    
    for( var i=0; i < this.balls.children.length; i++) {
        if ( this.balls.children[i].y > (game.height + 200) ) {
            this.balls.children[i].destroy();
        }
    }

//Create the collision callback function for spells hitting balls
    game.physics.arcade.collide(this.balls,this.spells,mainGameState.onBallAndSpellCollision,null,this);

//Create the collision callback function for bludger hitting the player 
    
   game.physics.arcade.overlap(this.balls,this.playerSprite,mainGameState.onBludgerAndPlayerCollision,null,this);
    
//Create the collision callback function for spells hitting the snitch
    game.physics.arcade.collide(this.snitchBall,this.spells,mainGameState.onSnitchAndSpellCollision,null,this);
    
    
    
//Update the score 
    
this.scoreValue.setText(playerScore);
    
//Update the lives
    
this.lifeValue.setText(this.playerLife);
    
//Switch to Game over state at end of lives
    
if (this.playerLife <= 0) {
    game.state.start("GameOver");
    this.music.stop();
}

// STAY INSIDE THE FUNCTION, ELIN!!!!!  
}

//Create the spawnQuaffle function 
mainGameState.spawnQuaffle = function () {
    
    var x = game.rnd.integerInRange(0,game.width);
    var spinSpeed = game.rnd.integerInRange(50,200);
    var fallSpeed = game.rnd.integerInRange(80,150) * this.gameSpeed;
    var quaffleBall = game.add.sprite(x,0,'quaffle');
    quaffleBall.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(quaffleBall);
    quaffleBall.body.velocity.setTo(0,fallSpeed);
    quaffleBall.body.angularVelocity = spinSpeed;
    quaffleBall.killsPlayer = false;
    
    this.balls.add(quaffleBall);
    
}

//Creates the spawnBludger function
mainGameState.spawnBludger = function () {
    
    var x = game.rnd.integerInRange(0,game.width);
    var spinSpeed = game.rnd.integerInRange(80,250);
    var fallSpeed = game.rnd.integerInRange(100,200) * this.gameSpeed;
    var bludgerBall = game.add.sprite(x,0,'bludger');
    bludgerBall.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(bludgerBall);
    bludgerBall.body.velocity.setTo(0,fallSpeed);
    bludgerBall.body.angularVelocity = spinSpeed;
    bludgerBall.killsPlayer = true;
    
    this.balls.add(bludgerBall);
    
}

//Creates the spawnSnitch function

mainGameState.spawnSnitch = function () {
    
    var x = game.rnd.integerInRange(0,game.width);
    var y = game.rnd.integerInRange(0, -game.height);
    var z = this.randomSpeed;
    this.snitchBall = game.add.sprite(x,y,'snitch');
    this.snitchBall.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(this.snitchBall);
    this.snitchBall.body.velocity.setTo(z,z);
    this.snitchBall.killsPlayer = false;
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

mainGameState.onBallAndSpellCollision = function (obj1,obj2) {
    obj1.pendingDestroy = true;
    obj2.pendingDestroy = true;

    //Adding the soundfx for shooting a spell
    var index = game.rnd.integerInRange(0, this.ballHitSfx.length - 1);
    this.ballHitSfx[index].play();
    this.ballHitSfx[index].volume = 0.3;
    
    switch (obj1.key) {
        case "red-spell":
        var redSpell = obj1;
        break;
        case "blue-spell":
        var blueSpell = obj1;
        break;
        case "quaffle":
        var quaffle = obj1;
        break;
        case "bludger":
        var bludger = obj1;
        break;
        default:
        console.log("Object 1 unknown");
    }
    
    switch (obj2.key) {
        case "red-spell":
        var redSpell = obj2;
        break;
        case "blue-spell":
        var blueSpell = obj2;
        break;
        case "quaffle":
        var quaffle = obj2;
        break;
        case "bludger":
        var bludger = obj2;
        break;
        default: 
        console.log("Objekt 2 unknown");
    }
    
    if ( (blueSpell != null) && (quaffle != null) ) {
        playerScore += 5;
    }
    
    if ( playerScore >= 10 ) {
        if ( (blueSpell != null) && (bludger != null) ) {
            playerScore -= 10;
        }
    }
    
    if ( (redSpell != null) && (bludger != null) ) {
        playerScore += 10;
    }
         
    
}

//Create function for collision of Snitch ball and spells 

mainGameState.onSnitchAndSpellCollision = function (obj1,obj2) {
    obj1.pendingDestroy = true;
    obj2.pendingDestroy = true;
    this.snitchTimer = game.rnd.integerInRange(10,20);
    
    if ( (obj1.key.includes("blue-spell")) || (obj2.key.includes("blue-spell")) ) {
         playerScore+= 100;
    } 
    
}

//Create function for collision of bludgers and player

mainGameState.onBludgerAndPlayerCollision = function (obj1,obj2) {
    
    if ( obj1.key.includes("player") ) {
        var ball = obj2;
    } else {
        var ball = obj1;
    }
    
    if ( (ball.killsPlayer == true) && (this.playerImmunityTimer <= 0 ) ) {
        this.playerLife -= 1;
        ball.pendingDestroy = true;
        this.playerImmunityTimer = 1.0;
        //Play player hit soundfx
       this.playerHitsfx.play();
        
    } else if ( (ball.killsPlayer == true) && (this.playerImmunityTimer > 0) ) {
        ball.pendingDestroy = true;
    }
    
}


