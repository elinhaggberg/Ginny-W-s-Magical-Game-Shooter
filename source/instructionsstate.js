var instructionsState = {};

instructionsState.preload = function () {
    //Load all assets
    this.game.load.image("instruction-bg","assets/images/instruction-bg.jpg");
    this.game.load.image("instruction-bg-mobile","assets/images/instruction-bg-mobile.jpg")
    this.game.load.image("snitch", "assets/images/snitch.png");
    this.game.load.image("exit-button","assets/images/exit-button.png");
};

instructionsState.create = function () {
    //Add the background
    
    if (game.device.desktop) {
        background = game.add.sprite(0,0,'instruction-bg');
        background.scale.setTo(0.5);
    } else {
        background = game.add.sprite(0,0,'instruction-bg-mobile');
        background.scale.setTo(0.5);
    }

    button = game.add.button(10,10,'exit-button',actionOnClick,this,2,1,0);
    button.scale.setTo(0.7);
    
};

instructionsState.update = function () {
    
};

function actionOnClick () {
    game.state.start("MainGame");
};