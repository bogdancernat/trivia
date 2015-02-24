exports = (typeof window !== "undefined") && (window !== null) ? window : global;

exports.Game = function() {
  this.players          = [];
  this.places           = [];
  this.purses           = [];
  this.inPenaltyBox     = [];
  this.popQuestions     = [];
  this.scienceQuestions = [];
  this.sportsQuestions  = [];
  this.rockQuestions    = [];
  
  this.currentPlayer    = 0;
  this.isGettingOutOfPenaltyBox = false;
  ;

  for(var i = 0; i < 50; i++){
    this.popQuestions.push("Pop Question "+i);
    this.scienceQuestions.push("Science Question "+i);
    this.sportsQuestions.push("Sports Question "+i);
    this.rockQuestions.push(this.createRockQuestion(i));
  };

  this.currentCategory = function (){
    if(this.places[this.currentPlayer] == 0)
      return 'Pop';
    if(this.places[this.currentPlayer] == 4)
      return 'Pop';
    if(this.places[this.currentPlayer] == 8)
      return 'Pop';
    if(this.places[this.currentPlayer] == 1)
      return 'Science';
    if(this.places[this.currentPlayer] == 5)
      return 'Science';
    if(this.places[this.currentPlayer] == 9)
      return 'Science';
    if(this.places[this.currentPlayer] == 2)
      return 'Sports';
    if(this.places[this.currentPlayer] == 6)
      return 'Sports';
    if(this.places[this.currentPlayer] == 10)
      return 'Sports';
    return 'Rock';
  };

  this.askQuestion = function(){
    if(this.currentCategory() == 'Pop')
      console.log(this.popQuestions.shift());
    if(this.currentCategory() == 'Science')
      console.log(this.scienceQuestions.shift());
    if(this.currentCategory() == 'Sports')
      console.log(this.sportsQuestions.shift());
    if(this.currentCategory() == 'Rock')
      console.log(this.rockQuestions.shift());
  };

  this.didPlayerWin = function(player) {
    return !(this.purses[player] == 6)
  }

};

Game.prototype.createRockQuestion = function(index){
  return "Rock Question "+index;
};


Game.prototype.isPlayable = function(howManyPlayers){
  return howManyPlayers >= 2;
};

Game.prototype.add = function(playerName){
  this.players.push(playerName);
  this.places[this.howManyPlayers() - 1] = 0;
  this.purses[this.howManyPlayers() - 1] = 0;
  this.inPenaltyBox[this.howManyPlayers() - 1] = false;

  console.log(playerName + " was added");
  console.log("They are player number " + this.players.length);

  return true;
};

Game.prototype.howManyPlayers = function(){
  return this.players.length;
};


Game.prototype.roll = function(roll){
  console.log(this.players[this.currentPlayer] + " is the current player");
  console.log("They have rolled a " + roll);

  if(this.inPenaltyBox[this.currentPlayer]){
    if(roll % 2 != 0){
      this.isGettingOutOfPenaltyBox = true;

      console.log(this.players[this.currentPlayer] + " is getting out of the penalty box");
      this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
      if(this.places[this.currentPlayer] > 11){
        this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
      }

      console.log(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
      console.log("The category is " + this.currentCategory());
      askQuestion();
    }else{
      console.log(this.players[this.currentPlayer] + " is not getting out of the penalty box");
      this.isGettingOutOfPenaltyBox = false;
    }
  }else{

    this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
    if(this.places[this.currentPlayer] > 11){
      this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
    }

    console.log(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
    console.log("The category is " + this.currentCategory());
    this.askQuestion();
  }
};
Game.prototype.wasCorrectlyAnswered = function(){
  var winner;

  if(this.inPenaltyBox[this.currentPlayer]){
    if(this.isGettingOutOfPenaltyBox){
      console.log('Answer was correct!!!!');
      this.purses[this.currentPlayer] += 1;
      console.log(this.players[this.currentPlayer] + " now has " +
                  this.purses[this.currentPlayer]  + " Gold Coins.");

      winner = didPlayerWin(this.currentPlayer);
      this.currentPlayer += 1;
      if(this.currentPlayer == this.players.length)
        this.currentPlayer = 0;
    } else {
      this.currentPlayer += 1;
      if(this.currentPlayer == this.players.length)
        this.currentPlayer = 0;
      return true;
    }

  } else {

    console.log("Answer was correct!!!!");

    this.purses[this.currentPlayer] += 1;
    console.log(this.players[this.currentPlayer] + " now has " +
                this.purses[this.currentPlayer]  + " Gold Coins.");

    winner = this.didPlayerWin(this.currentPlayer);

    this.currentPlayer += 1;
    if(this.currentPlayer == this.players.length){
      this.currentPlayer = 0;
    }

  }
  return winner;
};

Game.prototype.wrongAnswer = function(){
  console.log('Question was incorrectly answered');
  console.log(this.players[this.currentPlayer] + " was sent to the penalty box");
  this.inPenaltyBox[this.currentPlayer] = true;

  this.currentPlayer += 1;
  if(this.currentPlayer == this.players.length)
    this.currentPlayer = 0;
  return true;
};

var notAWinner = false
, game = new Game()
;

game.add('Chet');
game.add('Pat');
game.add('Sue');

do{

  game.roll(Math.floor(Math.random()*6) + 1);

  if(Math.floor(Math.random()*10) == 7){
    notAWinner = game.wrongAnswer();
  }else{
    notAWinner = game.wasCorrectlyAnswered();
  }

} while (notAWinner);


