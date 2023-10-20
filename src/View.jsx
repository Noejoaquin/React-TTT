import Board from './Board';
import StartScreen from './StartScreen';

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

export default View;