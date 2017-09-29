var instructionsState = {};

instructionsState.preload = function () {
    //Load all assets
    this.game.load.image("instruction-bg","assets/images/instruction-bg.jpg");
    this.game.load.audio("harry-potter","assets/music/harry-potter-8bit.WAV");
    this.game.load.image("snitch", "assets/images/snitch.png");
    this.game.load.image("exit-button","assets/images/exit-button.png");
};

instructionsState.create = function () {
    //Add the background
    background = game.add.sprite(0,0,'instruction-bg');
    background.scale.setTo(0.5);
    
    button = game.add.button(10,10,'exit-button',actionOnClick,this,2,1,0);
    button.scale.setTo(0.7);
    
    //Add the music and play it
    this.music = game.add.audio('harry-potter');
    this.music.play();
    this.music.volume = 0.3;
    this.music.loop = true;
};

instructionsState.update = function () {
    
};

function actionOnClick () {
    game.state.start("MainGame");
};