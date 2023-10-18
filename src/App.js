import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function View({ 
  opponentSelected,
  moves,
  currentPlayer,
  tiles,
  handlePlay,
  handleAi}) {
  if (opponentSelected) {
    // if there is a selected opponent, return the game board
    return (
      <>
        <div className='game-board'>
        <Board tiles={tiles} onPlay={handlePlay} currentPlayer={currentPlayer} /> 
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

function Board({tiles, onPlay, currentPlayer}) {
  function handleTileClick(i) {
    if (tiles[i] || calculateWinner(tiles)) return;
    // make a copy of state using .slice()
    const newTiles = tiles.slice();
    currentPlayer === 'X' ? newTiles[i] = 'X': newTiles[i] = 'O';
    onPlay(newTiles);
  }

  const winner = calculateWinner(tiles);
  const status = winner ? `The winner is ${winner}` : `Next player: ${currentPlayer === 'X' ? 'X' : 'O'}`

  return (
    <>
     <div className='status'>{status}</div>
     <div className='board'>
      { tiles.map((tile, i) => <Tile value={tiles[i]} handleTileClick={() => handleTileClick(i)}/> )}
     </div>
    </>
  );
}

class AIPlayer {
  constructor(mark = 'O') {
    this.mark = mark;
    this.opponentMark = this.mark === 'X' ? 'O' : 'X'
    // blockingMove: arrayOfPossibleWinningScenariosForOpponent
    this.blockingMap = {
      0: [[1, 2], [3, 6], [4, 8]],
      1: [[0, 2], [4, 7]],
      2: [[0, 1], [5, 8], [4, 6]],
      3: [[4, 5], [0, 6]],
      4: [[3, 5], [1, 7], [2, 6], [0, 8]],
      5: [[3, 4], [2, 8]],
      6: [[7, 8], [0, 3], [2, 4]],
      7: [[6, 8], [1, 4]],
      8: [[6, 7], [2, 5], [0, 4]],
    }
  }

  move(tiles) {
    let newTiles = tiles.slice();
    // make a move by iterating through the tiles, and placing a marker at the first null space
    const blockingMove = this.#needBlockingMove(newTiles);
    const winningMove = null;
    console.log(blockingMove, 'blocking Move');
    if (blockingMove) {
      newTiles[blockingMove] = this.mark;
    } else if (winningMove) {

    } else {
      // for now we will move where it is first available if there is no blocking move
      // TODO: create a winning move function. -- will probably use the blockingMap again for that one.
      for(let i=0; i < 9; i += 1) {
        if (newTiles[i] === null) {
          newTiles[i] = this.mark
          break;
        } 
      }
    }
    return newTiles;
  }

  #needBlockingMove(tiles) {
    // iterate through all the blocking moves
    for (const blockingMove in this.blockingMap) {
      const combosOfTilesToBlock = this.blockingMap[blockingMove];
      // iterate through the set of possible opponent scenarios
      for (let i=0; i < combosOfTilesToBlock.length; i += 1) {
        const tilesToBlock = combosOfTilesToBlock[i];
        // return the blocking move for the first scenario seen on the board
        if (tiles[tilesToBlock[0]] === this.opponentMark && tiles[tilesToBlock[1]] === this.opponentMark && !tiles[blockingMove]) return blockingMove;
      }
    }
    return null;
  }
}

function Game() {
  const [opponentSelected, setOpponentSelected] = useState(false);
  const [isAi, setIsAi] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  // keeping a history will allow us to jump back into different game states
  const [history, setHistory] = useState([new Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);  
  let currentTiles = history[currentMove];
  let aiPlayer = null;

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
  
  if (isAi && !aiPlayer) aiPlayer = new AIPlayer('X');
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
