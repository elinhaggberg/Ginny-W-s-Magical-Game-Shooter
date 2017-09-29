//Copied this code from Johns example but have not come so far as to being able to use it yet so will just leave it here for now 

localScoreBoard = {
    data: [], 
    
    addScore: function (name, score) {
        //Add the name and the score to the end of 'data'-array
        this.data.push([name, score]);

        //Sort data by all of the scores
        this.data.sort(function(a, b) {
            return a[1] > b[1]; 
        });
    
        //Take only the top 5 elements 
        if (data.length > 5) {
            this.data = this.data.splice(0, 5);
        };
    },
        
    getScores: function() {
        return this.data;
    },
    
    saveScores: function () {
        localStorage.setItem('scoreboard', this.data);
    },
        
    loadScores: function () {
        localStorage.getItem('scoreboard');
    },
    
}