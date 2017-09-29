var gameStartState = { };

gameStartState.preload = function () {
    //Load all the images
    this.game.load.image("gamestart-1","assets/images/start-screen-1.jpg");
    this.game.load.image("gamestart-2","assets/images/start-screen-2.jpg")
    this.game.load.image("gamestart-3","assets/images/start-screen-3.jpg")
    this.game.load.image("gamestart-4","assets/images/start-screen-4.jpg")
    this.game.load.image("snitch", "assets/images/snitch.png");
    //Load the music
    this.game.load.audio("harry-potter","assets/music/harry-potter-8bit.mp3");
}

gameStartState.create = function () {
    //Adds the first start screen
    this.gameStartBg = game.add.sprite(0,0,'gamestart-1');
    
    //Creates timer for image change
    this.imageChangeTimer = 0;
    
    //Creates array of start screen images to switch betweet
    this.gameStartScreens = ['gamestart-2','gamestart-3','gamestart-4'];
    
    //Plays the background music
    this.music = game.add.audio('harry-potter');
    this.music.play();
    this.music.volume = 0.3;
    this.music.loop = true;
    
    //Sets the index for the images array to 0
    this.index = 0;
    
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
}

gameStartState.update = function () {
    
    //Sets the image change timer
    this.imageChangeTimer -= game.time.physicsElapsed;
    
    //Checks to see if someone is clicking and the timer is at 0 and the array isn't done
    if ( (game.input.activePointer.isDown) && (this.imageChangeTimer <= 0) && (this.index < this.gameStartScreens.length ) ) {
        
        //Changes to the next startscreen image in the array
        game.add.sprite(0,0,this.gameStartScreens[this.index]);
        
        //Increases index with 1
        this.index += 1;
        
        //Sets change timer to 0.5 to limit clicks
        this.imageChangeTimer = 0.5;
        
    }
    
    //Checks to see if someone is clicking and the array is at it's last image
    if ( (game.input.activePointer.isDown) && ( this.index == this.gameStartScreens.length ) && (this.imageChangeTimer <= 0) ) {
        
        //Starts the main game
        game.state.start("MainGame");
        
        //Stops the music
        this.music.stop();
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