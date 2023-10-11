import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Tile({value, handleTileClick}) {
  return(
    <button
      className='board-tile'
      onClick={handleTileClick}
      >
      {value}
    </button>
  )
}

function App() {
  const [xIsNext, setXIsNext] = useState(true);
  const [tiles, setTiles] = useState(new Array(9).fill(null));

  function handleTileClick(i) {
    if (tiles[i] || calculateWinner(tiles)) return;
    const newTiles = tiles.slice();
    xIsNext ? newTiles[i] = 'X': newTiles[i] = 'O';
    setXIsNext(!xIsNext);
    setTiles(newTiles);
  }

  const winner = calculateWinner(tiles);
  const status = winner ? `The winner is ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`

  return (
    <>
     <div class='status'>{status}</div>
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

export default App;
