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
    this.winningOrBlockingMap = {
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
    this.corners = [0, 6, 8, 2];
    this.turnCount = 0;
  }

  move(tiles) {
    this.turnCount += 1;
    let newTiles = tiles.slice();
    // make a move by iterating through the tiles, and placing a marker at the first null space
    const blockingMove = this.#needWinningOrBlockingMove(newTiles, 'block');
    const winningMove = this.#needWinningOrBlockingMove(newTiles, 'win');
    const cornerMoveAvailable = this.#getCornerMove(newTiles);
    const makeMiddleMove = this.#makeMiddleMove(newTiles);
    console.log(cornerMoveAvailable, 'corner move available')
    if (winningMove) {
      newTiles[winningMove] = this.mark;
    } else if (blockingMove) {
      newTiles[blockingMove] = this.mark;
    } else if (makeMiddleMove) {
      newTiles[makeMiddleMove] = this.mark;
    } else if (cornerMoveAvailable) {
      newTiles[cornerMoveAvailable] = this.mark;
    } else {
      // for now we will move where it is first available if there is no blocking move
      for(let i=0; i < 9; i += 1) {
        if (newTiles[i] === null) {
          newTiles[i] = this.mark
          break;
        } 
      }
    }
    return newTiles;
  }

  #makeMiddleMove(newTiles) {
    if (this.mark === 'O' && this.#opponentMadeCornerMove(newTiles) && newTiles[4] === null) {
      return 4;
    } else if (this.mark === 'X' && this.turnCount === 3) {
      return 4
    }

    return null;
  }

  #opponentMadeCornerMove(newTiles) {
    for (let i=0; i<this.corners.length; i+=1) {
      if (newTiles[this.corners[i]] === this.opponentMark) {
        return true;
      }
    }
    return false;
  }

  #getCornerMove(tiles) {
    for (let i=0; i<tiles.length; i+=1) {
      const corner = this.corners[i];
      if (tiles[corner] === null) return corner;
    }
    return null;
  }

  #needWinningOrBlockingMove(tiles, action) {
    const mark = action === 'block' ? this.opponentMark : this.mark 
    // iterate through all the blocking moves
    for (const blockingMove in this.winningOrBlockingMap) {
      const combosOfTilesToBlock = this.winningOrBlockingMap[blockingMove];
      // iterate through the set of possible opponent scenarios
      for (let i=0; i < combosOfTilesToBlock.length; i += 1) {
        const tilesToBlock = combosOfTilesToBlock[i];
        // return the blocking move for the first scenario seen on the board
        if (tiles[tilesToBlock[0]] === mark && tiles[tilesToBlock[1]] === mark && !tiles[blockingMove]) return blockingMove;
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
