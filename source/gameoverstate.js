//Create the empty Game over-state
var gameOverState = { };


gameOverState.preload = function () {
    //Load all assets
    this.game.load.image("gameover-bg","assets/images/gameover.jpg");
    this.game.load.audio("harry-potter","assets/music/harry-potter-8bit.WAV");
    this.game.load.image("snitch", "assets/images/snitch.png");
    
};

gameOverState.create = function () {
    
    //Add the background
    game.add.sprite(0,0,'gameover-bg');
    
    //Add the music and play it
    this.music = game.add.audio('harry-potter');
    this.music.play();
    this.music.volume = 0.3;
    this.music.loop = true;
    
    //Set display style for score 
    var displayOptions = {
        font: "25px courier",
        fill: "#FFFFFF",
        align: "center"
    }
    
    //Att the score from the game
    var yourScoreLable = game.add.text(game.width/2, 50, "Your score:", displayOptions);
    var yourScoreValue = game.add.text(game.width/2, 75, playerScore, displayOptions);
    yourScoreLable.anchor.setTo(0.5,0.5);
    yourScoreValue.anchor.setTo(0.5,0.5);
    
    //Set up the random speed variable for the snitch
    this.randomSpeed = game.rnd.integerInRange(200,450);
    
    //Spawn the Snitch
    var x = game.rnd.integerInRange(0,game.width);
    var y = game.rnd.integerInRange(0, -game.height);
    var z = this.randomSpeed;
    this.snitchBall = game.add.sprite(x,y,'snitch');
    this.snitchBall.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(this.snitchBall);
    this.snitchBall.body.velocity.setTo(z,z);
    
};

gameOverState.update = function () {
    
    //Restart the game on click
    if (game.input.activePointer.isDown) {
        game.state.start("MainGame");
        this.music.stop();
        playerScore = 0;
    }
    
    //Confind the Snitch to the game screen
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
    
};