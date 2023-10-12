import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


function View({ 
  opponentSelected,
  moves,
  xIsNext,
  tiles,
  handlePlay,
  handleAi}) {
  if (opponentSelected) {
    // if there is a selected opponent, return the game board
    return (
      <>
        <div className='game-board'>
        <Board xIsNext={xIsNext} tiles={tiles} onPlay={handlePlay} /> 
        </div>
        <div>
          <div className='game-info'>
            <ol>{moves}</ol>
          </div>
        </div>
      </>
    )
  } else {
    // otherwise, return the start screen
    return <StartScreen handleAi={handleAi} />
  }
}
function StartScreen({handleAi}) {
  return(
    <>
      <div>
        <h2>Who do you want to play?</h2>
        <button onClick={() => handleAi(true)}>AI</button>
        <button onClick={() => handleAi(false)}>Human</button>
      </div>
    </>
  )
}
function Tile({value, handleTileClick}) {
  // render a button which will have an onClick handler
  return(
    <button
      className='board-tile'
      onClick={handleTileClick}
      >
      {value}
    </button>
  )
}

function Board({xIsNext, tiles, onPlay}) {
  function handleTileClick(i) {
    if (tiles[i] || calculateWinner(tiles)) return;
    // make a copy of state using .slice()
    const newTiles = tiles.slice();
    xIsNext ? newTiles[i] = 'X': newTiles[i] = 'O';
    onPlay(newTiles);
  }

  const winner = calculateWinner(tiles);
  const status = winner ? `The winner is ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`

  return (
    <>
     <div className='status'>{status}</div>
     <div className='board'>
      { tiles.map((tile, i) => <Tile value={tiles[i]} handleTileClick={() => handleTileClick(i)}/> )}
     </div>
    </>
  );
}

function Game() {
  const [opponentSelected, setOpponentSelected] = useState(false);
  const [isAi, setIsAi] = useState(false);
  const [xIsNext, setXIsNext] = useState(true);
  // keeping a history will allow us to jump back into different game states
  const [history, setHistory] = useState([new Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);  
  let currentTiles = history[currentMove];

  function handleOpponentSelected() {
    setOpponentSelected(!opponentSelected);
  }

  function handleAi(bool) {
    handleOpponentSelected(true);
    setIsAi(bool);
  }

  function handlePlay(newTiles) {
    // create a nextHistory which doesn't include moves after the one we have jumped to
    // if we have made a new move after jumping.
    const nextHistory = [...history.slice(0, currentMove + 1), newTiles]
    setHistory(nextHistory) // sets the new history
    setCurrentMove(nextHistory.length - 1)
    setXIsNext(!xIsNext);
  };

  function handleJumpTo(move) {
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  }

  const moves = history.map((tiles, move) => {
    const description = move === 0 ? 'Game start' :  `Jump to move number ${move}`;
    return(
      <li key={move}>
        <button onClick={() => handleJumpTo(move)}>{description}</button>
      </li>
    )
  })

  if (isAi && !xIsNext && !calculateWinner(currentTiles)) {
    const newTiles = currentTiles.slice();
    // make a move by iterating through the tiles, and placing a marker at the first null space
    for (let i=0; i < 9; i+=1) {
      if (newTiles[i] === null) {
        newTiles[i] = 'O'
        break;
      }
    }
    const nextHistory = [...history.slice(0, currentMove + 1), newTiles]
    setHistory(nextHistory) // sets the new history
    setCurrentMove(nextHistory.length - 1)
    setXIsNext(!xIsNext);
  }
  
  return(
  <div className='game-container'>
    <View 
      opponentSelected={opponentSelected} 
      moves={moves}
      xIsNext={xIsNext} 
      handleAi={handleAi}
      handlePlay={handlePlay}
      tiles={currentTiles}/>
  </div>
    
  )
}

function calculateWinner(tiles) {
  const possibleWinningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < possibleWinningLines.length; i++) {
    const [a, b, c] = possibleWinningLines[i];
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      return tiles[a];
    }
  }
  return null;
}

export default Game;
