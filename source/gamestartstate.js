var gameStartState = { };

gameStartState.preload = function () {
    this.game.load.image("gamestart-1","assets/images/start-screen-1.jpg");
    this.game.load.image("gamestart-2","assets/images/start-screen-2.jpg")
    this.game.load.image("gamestart-3","assets/images/start-screen-3.jpg")
    this.game.load.image("gamestart-4","assets/images/start-screen-4.jpg")
    this.game.load.audio("harry-potter","assets/music/harry-potter-8bit.WAV");
}

gameStartState.create = function () {
    
    this.gameStartBg = game.add.sprite(0,0,'gamestart-1');
   
    this.imageChangeTimer = 0;
    
    this.gameStartScreens = ['gamestart-2','gamestart-3','gamestart-4'];
    
    this.music = game.add.audio('harry-potter');
    this.music.play();
    this.music.volume = 0.3;
    this.music.loop = true;
    
    this.index = 0;
}

gameStartState.update = function () {

    this.imageChangeTimer -= game.time.physicsElapsed;
    
    if ( (game.input.activePointer.isDown) && (this.imageChangeTimer <= 0) && (this.index < this.gameStartScreens.length ) ) {
        
        game.add.sprite(0,0,this.gameStartScreens[this.index]);
        
        this.index += 1;
        
        this.imageChangeTimer = 0.5;
        
    }
    
    if ( (game.input.activePointer.isDown) && ( this.index == this.gameStartScreens.length ) && (this.imageChangeTimer <= 0) ) {
        game.state.start("MainGame");
        console.log("Start spel")
        this.music.stop();
    }
    
}