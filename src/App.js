import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

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
        <Tile value={tiles[0]} handleTileClick={() => handleTileClick(0)}/>
        <Tile value={tiles[1]} handleTileClick={() => handleTileClick(1)}/>
        <Tile value={tiles[2]} handleTileClick={() => handleTileClick(2)}/>
        <Tile value={tiles[3]} handleTileClick={() => handleTileClick(3)}/>
        <Tile value={tiles[4]} handleTileClick={() => handleTileClick(4)}/>
        <Tile value={tiles[5]} handleTileClick={() => handleTileClick(5)}/>
        <Tile value={tiles[6]} handleTileClick={() => handleTileClick(6)}/>
        <Tile value={tiles[7]} handleTileClick={() => handleTileClick(7)}/>
        <Tile value={tiles[8]} handleTileClick={() => handleTileClick(8)}/>
     </div>
    </>
  );
}

function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  // keeping a history will allow us to jump back into different game states
  const [history, setHistory] = useState([new Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);  
  let currentTiles = history[currentMove];

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
    const description = move === 0 ? 'Game start' :  `Move number ${move}`;
    return(
      <li key={move}>
        <button onClick={() => handleJumpTo(move)}>{description}</button>
      </li>
    )
  })
  
  return(
  <div className='game-container'>
    <div className='game-board'>
      <Board xIsNext={xIsNext} tiles={currentTiles} onPlay={handlePlay}/>
    </div>
    <div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
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
