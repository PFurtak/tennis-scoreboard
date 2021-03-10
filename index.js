const axios = require('axios');

let gameCount = 1;

const scoreTranslation = {
  0: 'Love',
  1: 'Fifteen',
  2: 'Thirty',
  3: 'Fourty',
};

const processScores = async () => {
  const scores = await axios.get('https://c5-tennis.herokuapp.com/deuce');
  evaluateScores(scores.data);
};

const evaluateScores = (games) => {
  for (let i = 0; i < games.length; i++) {
    tallyScores(games[i]);
  }
};

const tallyScores = (scoreSequence) => {
  let [playerOneScore, playerTwoScore, playerOneWins, playerTwoWins] = Array(
    4
  ).fill(0);
  let deuce = false;

  const resetScores = () => {
    playerOneScore = 0;
    playerTwoScore = 0;
  };

  const enterDeuce = () => {
    deuce = true;
  };

  const leaveDeuce = () => {
    deuce = false;
  };

  for (let i = 0; i < scoreSequence.length; i++) {
    if (scoreSequence[i] === 'A') {
      playerOneScore++;
    }

    if (scoreSequence[i] === 'B') {
      playerTwoScore++;
    }

    if (playerOneScore === 3 && playerTwoScore === 3) {
      enterDeuce();
    }

    if (playerOneScore >= 4 && playerOneScore - playerTwoScore >= 2) {
      playerOneWins++;
      resetScores();
      leaveDeuce();
    } else if (playerOneScore > 3 && playerOneScore - playerTwoScore < 2) {
      enterDeuce();
    }

    if (playerTwoScore >= 4 && playerTwoScore - playerOneScore >= 2) {
      playerTwoWins++;
      resetScores();
      leaveDeuce();
    } else if (playerTwoScore > 3 && playerTwoScore - playerOneScore < 2) {
      enterDeuce();
    }
  }

  console.log(
    `
     Game: ${gameCount}
     ************

     PLAYER ONE: ${
       !deuce
         ? scoreTranslation[playerOneScore]
         : deuce && playerOneScore > playerTwoScore
         ? 'Advantage'
         : 'Deuce'
     } 
     Wins: ${playerOneWins} 

     PLAYER TWO: ${
       !deuce
         ? scoreTranslation[playerTwoScore]
         : deuce && playerTwoScore > playerOneScore
         ? 'Advantage'
         : 'Deuce'
     } 
     Wins: ${playerTwoWins} 

     ************`
  );
  gameCount++;
};

processScores();
