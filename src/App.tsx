import './App.css';
import { calculateWinner } from './utils';
import AIPlayer from './aiPlayer';
import View from './View';
import { useState } from 'react';
import React from 'react';

function Game() {
  const [opponentSelected, setOpponentSelected] = useState(false);
  const [isAi, setIsAi] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  // keeping a history will allow us to jump back into different game states
  const [history, setHistory] = useState([new Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);  
  let currentTiles = history[currentMove];
  let aiPlayer;

  function handleOpponentSelected() {
    setOpponentSelected(!opponentSelected);
  }

  function handleAi(bool) {
    handleOpponentSelected();
    setIsAi(bool);
  }

  function handlePlay(newTiles) {
    // create a nextHistory which doesn't include moves after the one we have jumped to
    // if we have made a new move after jumping.
    const nextHistory = [...history.slice(0, currentMove + 1), newTiles]
    setHistory(nextHistory) // sets the new history
    setCurrentMove(nextHistory.length - 1)
    currentPlayer === 'X' ? setCurrentPlayer('O') : setCurrentPlayer('X');
  };

  function handleJumpTo(move) {
    setCurrentMove(move);
    move % 2 === 0 ? setCurrentPlayer('X') : setCurrentPlayer('O');
  }

  const moves = history.map((tiles, move) => {
    const description = move === 0 ? 'Game start' :  `Jump to move number ${move}`;
    return(
      <li key={move}>
        <button onClick={() => handleJumpTo(move)}>{description}</button>
      </li>
    )
  })
  
  if (isAi && !aiPlayer) aiPlayer = new AIPlayer('O');
  if (aiPlayer && currentPlayer === aiPlayer.mark && !calculateWinner(currentTiles)) {
    const newTiles = aiPlayer.move(currentTiles)
    console.log(newTiles, 'newTILES');
    handlePlay(newTiles);
  }
  
  return(
  <div className='game-container'>
    <View 
      opponentSelected={opponentSelected} 
      moves={moves}
      currentPlayer={currentPlayer}
      handleAi={handleAi}
      handlePlay={handlePlay}
      tiles={currentTiles}/>
  </div>
    
  )
}

export default Game;
