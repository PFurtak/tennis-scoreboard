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
    scoreTally(games[i]);
  }
};

const scoreTally = (scoreSequence) => {
  let playerOneScore = 0;
  let playerTwoScore = 0;
  let playerOneWins = 0;
  let playerTwoWins = 0;
  let deuce = false;

  for (let i = 0; i < scoreSequence.length; i++) {
    if (scoreSequence[i] === 'A') {
      playerOneScore++;
    }

    if (scoreSequence[i] === 'B') {
      playerTwoScore++;
    }

    if (playerOneScore === 3 && playerTwoScore === 3) {
      deuce = true;
    }

    if (playerOneScore >= 4 && playerOneScore - playerTwoScore >= 2) {
      playerOneWins++;
      playerOneScore = 0;
      playerTwoScore = 0;
      deuce = false;
    } else if (playerOneScore > 3 && playerOneScore - playerTwoScore < 2) {
      deuce = true;
    }

    if (playerTwoScore >= 4 && playerTwoScore - playerOneScore >= 2) {
      playerTwoWins++;
      playerOneScore = 0;
      playerTwoScore = 0;
      deuce = false;
    } else if (playerTwoScore > 3 && playerTwoScore - playerOneScore < 2) {
      deuce = true;
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
