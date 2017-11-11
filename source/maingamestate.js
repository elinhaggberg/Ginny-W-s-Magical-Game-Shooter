//Create an empty object
var mainGameState = { };

var playerScore = 0;

// Add the preload function 
mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    
    //Load all the image sprites
    this.game.load.image("game-bg", "assets/images/ginny-w-bg.jpg");
    this.game.load.image("tile-bg", "assets/images/bg-tile-2.jpg");
    this.game.load.image("player", "assets/images/ginny-w-player.png");
    this.game.load.image("quaffle", "assets/images/quaffle.png");
    this.game.load.image("bludger", "assets/images/bludger.png");
    this.game.load.image("snitch", "assets/images/snitch.png");
    this.game.load.image("red-spell", "assets/images/red-spell.png");
    this.game.load.image("blue-spell", "assets/images/blue-spell.png");
    this.game.load.image("explosion-yellow", "assets/images/explosion-yellow.png");
    this.game.load.image("instructions-button","assets/images/instructions-button.png");
    this.game.load.image("blue-button","assets/images/blue-button.png");
    this.game.load.image("red-button","assets/images/red-button.png");

    //Load audio 
   // this.game.load.audio("game-music", "assets/music/harry-potter-8bit.mp3");
    this.game.load.audio("game-over-sound","assets/audio/gameover_01.mp3");
    
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
    this.game.load.audio("snitch-hit","assets/audio/snitch-ding.mp3");
    
}; //Ends the preload function

//Add the create function 
mainGameState.create = function() {
    
    //Load the Physics system

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Add the background
    //game.add.sprite(0, 0, 'game-bg');
    this.tileSprite = game.add.tileSprite(0,0,401,601,'tile-bg');

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
    
    //Create the snitch hit soundfx
    this.snitchHitSfx = game.add.audio('snitch-hit');
    
    //Create the game over soundfx
    this.gameOverSfx = game.add.audio('game-over-sound');
    
    //Add the background music
  /*  this.music = game.add.audio('game-music');
    this.music.play();
    this.music.volume = 0.5;
    this.music.loopFull = true;*/
    
    //Create the instructions button
    if (game.device.desktop) {
        this.instructionsButton = game.add.button(0,game.height - 30,'instructions-button', this.actionOnClick, this, 2, 1, 0);
        this.instructionsButton.scale.setTo(0.8);
    };
    
    if ( !(game.device.desktop) ) {
        this.instructionsButton = game.add.button(game.width / 2,game.height - 20, 'instructions-button',this.actionOnClick, this, 2, 1, 0);
        this.instructionsButton.anchor.setTo(0.5,0.5);
        this.instructionsButton.scale.setTo(0.8);
    };
    
    //Create the blue and red fire buttons
    if ( !(game.device.desktop) ) {
    this.redButton = game.add.button(40, game.height - 60,'red-button', mainGameState.fireButtonClick, this, 2, 1, 0);
    this.blueButton = game.add.button(game.width - 100, game.height - 60, 'blue-button', mainGameState.fireButtonClick, this, 2, 1, 0);
    };
    
    //Add coordinate-variables that uses game width and height for the player sprite  
    var x = game.width * 0.5;
    var y = game.height * 0.8;
    
    //Variable for game speed
    this.gameSpeed = 1;    
    
    //Timer for balls 
    this.ballTimer = 2.0;
    
    //Timer for spell shooting speed 
    this.spellTimer = 0.3;
    
    //Timer for the golden snitch
    this.snitchTimer = 20;
    
    //Timer for game speed
    this.gameSpeedTimer = 40.0;
    
    //Variable for player lives
    this.playerLife = 3;
    
    //Timer for player immunity to damage
    this.playerImmunityTimer = 0;
    
    //Timer before moving to Game over screen
    this.gameOverTimer = 0.5;
    
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
    
    
    //For explosions
    this.emitter = game.add.emitter(0,0, 100);
    this.emitter.makeParticles('explosion-yellow');
    this.emitter.gravity = 200;
    
}; //Ends the create-function

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
    
    //Setting up the mobile controls '
    
    if (game.input.pointer1.isDown) {
        console.log("MOVE");
    }
    
   if ( (game.input.pointer1.isDown) && (game.input.pointer1.position.x <= game.width/2) && (game.input.pointer1.position.y < game.height - 100) ) {
        this.playerSprite.body.velocity.x = -300;
    } else if ( (game.input.pointer1.isDown) && (game.input.pointer1.position.x >= game.width/2) && (game.input.pointer1.position.y < game.height - 100) ) {
        this.playerSprite.body.velocity.x = 300;
    } 
    
    
    //Make the background move
    this.tileSprite.tilePosition.y += 0.4 * this.gameSpeed;
    
    //Run the updateRedSpell function that drives the spells
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
    //Checks to see if the Snitch is in the game
        if ( (this.snitchBall.x > game.width + 100) && (
        //Checks if the Snitch is at the edges of the screen and makes it turn around
        //Added a few pixels on either side so it seams to be flying around    
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
    
    //Set up the random speed variable for the snitch ball
    this.randomSpeed = game.rnd.integerInRange(200,450);

    //Set up the ballTimer which decreases with the gameSpeed
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
    
    
    //Set up the snitchTimer for randomizing when the snitch appears
    if (this.snitchTimer != null) {
        this.snitchTimer -= game.time.physicsElapsed;
        if (this.snitchTimer <= 0.0) {
            console.log("HERE COMES THE SNITCH");
            mainGameState.spawnSnitch();
            this.snitchTimer = null;
        }
    }
    
    //Set up the gameSpeedTimer which makes the game go faster and faster
    this.gameSpeedTimer -= game.time.physicsElapsed;
    if ( this.gameSpeedTimer <= 0.0 ) {
        this.gameSpeed += 0.2;
        console.log("Game Speed increased");
        console.log(this.gameSpeed);
        this.gameSpeedTimer = 20.0;
    }

    //Set up the player immunity timer so you can't get killed directly after a hit
    this.playerImmunityTimer -= game.time.physicsElapsed;

    
    //Iterate over balls-group to destroy balls that has left the game screen
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
        this.gameOverTimer -= game.time.physicsElapsed;
            if (this.gameOverTimer <= 0) {
            game.state.start("GameOver");
            this.music.stop();
            this.gameOverSfx.play();
            this.gameOverSfx.volume = 0.3;
            }
    }

}; //Ends the update-function

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
    
};

//Creates the spawnBludger function
mainGameState.spawnBludger = function () {
    
    //Spawns the bludger balls and it's speed and spin. Goes faster according to gameSpeed-variable. 
        var x = game.rnd.integerInRange(0,game.width);
        var spinSpeed = game.rnd.integerInRange(80,250);
        var fallSpeed = game.rnd.integerInRange(100,200) * this.gameSpeed;
        var bludgerBall = game.add.sprite(x,0,'bludger');
        bludgerBall.anchor.setTo(0.5,0.5);
        game.physics.arcade.enable(bludgerBall);
        bludgerBall.body.velocity.setTo(0,fallSpeed);
        bludgerBall.body.angularVelocity = spinSpeed;
        bludgerBall.killsPlayer = true;
        //Adds bludgers to the "balls"-group
        this.balls.add(bludgerBall);
    
};

//Creates the spawnSnitch function
mainGameState.spawnSnitch = function () {
    
    //Spawns the snitch according to the snitchTimer and gives it random coordinates and random speed within a set number defined by the randomSpeed-variable
    var x = game.rnd.integerInRange(0,game.width);
    var y = game.rnd.integerInRange(0, -game.height);
    var z = this.randomSpeed;
    this.snitchBall = game.add.sprite(x,y,'snitch');
    this.snitchBall.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(this.snitchBall);
    this.snitchBall.body.velocity.setTo(z,z);
    this.snitchBall.killsPlayer = false;
};

//Creates the spawnRedSpell function
mainGameState.spawnRedSpell = function () {
    
    //Spawns the red spell by the players wand
    var x = this.playerSprite.x - 19;
    var y = this.playerSprite.y + -120;
    var redSpell = game.add.sprite(x,y,'red-spell');
    game.physics.arcade.enable(redSpell);
    redSpell.body.velocity.setTo(0, -300);
    //Adds spells to the spells-group
    this.spells.add(redSpell);
    //Adding the soundfx for shooting a spell
    var index = game.rnd.integerInRange(0, this.playerFireSfx.length - 1);
    this.playerFireSfx[index].play();
};

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
};

//Creates the updateRedSpell function called in the mainGameState.update function
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
};

//Create function for collision of Quaffle balls and spells

mainGameState.onBallAndSpellCollision = function (obj1,obj2) {
    
    //Destroy both objects
    obj1.pendingDestroy = true;
    obj2.pendingDestroy = true;

    //Adding the soundfx for shooting a spell
    var index = game.rnd.integerInRange(0, this.ballHitSfx.length - 1);
    this.ballHitSfx[index].play();
    this.ballHitSfx[index].volume = 0.3;

    //Identifies collided object1 as ball or spell
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
    
    //Identifies collided object2 as ball or spell
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
    
    //If bluespell and quaffel both exist and has collided add points
    if ( (blueSpell != null) && (quaffle != null) ) {
        playerScore += 5;
    }
    
    //If the player has 10 or more points and blueSpell and bludger exists and has collided remove points
    if ( playerScore >= 10 ) {
        if ( (blueSpell != null) && (bludger != null) ) {
            playerScore -= 10;
        }
    }
    
    //If redspell and bludger both exist and thus has collided add points
    if ( (redSpell != null) && (bludger != null) ) {
        playerScore += 10;
    }        
};

//Create function for collision of Snitch ball and spells 
mainGameState.onSnitchAndSpellCollision = function (obj1,obj2) {
    
    obj1.pendingDestroy = true;
    obj2.pendingDestroy = true;
    
    //Reset the snitchTimer to a random number between 10 and 20
    this.snitchTimer = game.rnd.integerInRange(15,30);
    this.snitchHitSfx.play();
    this.snitchHitSfx.volume = 0.3;
    //If the snitch was hit with a bluespell award 100 points
    if ( (obj1.key.includes("blue-spell")) || (obj2.key.includes("blue-spell")) ) {
         playerScore+= 100;
    } 
    
};

//Create function for collision of bludgers and player
mainGameState.onBludgerAndPlayerCollision = function (obj1,obj2) {
    
    //Check which of obj1 and obj2 is the ball and the player and assign the variable ball to the ball
    if ( obj1.key.includes("player") ) {
        var ball = obj2;
    } else {
        var ball = obj1;
    }
    
    //Checks if the ball can kill the player and the immunityTimer is at 0 
    if ( (ball.killsPlayer == true) && (this.playerImmunityTimer <= 0 ) ) {
        
        //Remove one life
        this.playerLife -= 1;
        //Destroy ball
        ball.pendingDestroy = true;
        //Set immunity timer to 1
        this.playerImmunityTimer = 1.0;
        //Play player hit soundfx
       this.playerHitsfx.play();
        this.explosion(ball);
      
    //Checks if the ball kills the player but the immunity timer is over 0    
    } else if ( (ball.killsPlayer == true) && (this.playerImmunityTimer > 0) ) {
        //Only the ball gets destroyed
        ball.pendingDestroy = true;
    }
    
};

//Create explosion function that emitts exploding pixels, takes in the value of the ball that is going to be destroyed
mainGameState.explosion = function (ballPosition) {
    
    //Sets the emitter to the position of the ball
    this.emitter.x = ballPosition.x;
    this.emitter.y = ballPosition.y;
    
    //Starts the emitter-function
    this.emitter.start(true, 2000, null, 20);
    
};

//Create the function for the Instructions button
mainGameState.actionOnClick = function () {
    game.state.start("InstructionsState");
    this.music.stop();
};

//Create the function for the fire buttons on MOBILE 
mainGameState.fireButtonClick = function(button) {
    console.log(button);
    if ( (button.key == "red-button") && (this.spellTimer <= 0.0) ) {
        //Shoot redSpells with red key every 0.3s
        this.spellTimer -= game.time.physicsElapsed;
            mainGameState.spawnRedSpell();
            this.spellTimer = 0.2;
        console.log("FIRE RED");
    } else if ( ( button.key == "blue-button" ) && (this.spellTimer <= 0.0) ) { 
        //Shoot blueSpells with blue button every 0.3s 
        this.spellTimer -= game.time.physicsElapsed;
            mainGameState.spawnBlueSpell();
            this.spellTimer = 0.2;
        console.log("FIRE BLUE");
    }
};
