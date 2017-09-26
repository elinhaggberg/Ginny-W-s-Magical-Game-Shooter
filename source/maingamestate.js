//Create an empty object
var mainGameState = { };

// Add the preload function 
mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    this.game.load.image("game-bg", "assets/images/space-bg.jpg")
}

//Add the create function 

mainGameState.create = function() {
    game.add.sprite(0, 0, 'game-bg');  
}

// Add the update function 
mainGameState.update = function() {
    
}