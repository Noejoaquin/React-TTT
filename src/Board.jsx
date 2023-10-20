import Utils from './utils';
import Tile from './Tile';


function Board({tiles, onPlay, currentPlayer}) {
    function handleTileClick(i) {
        if (tiles[i] || Utils.calculateWinner(tiles)) return;
        // make a copy of state using .slice()
        const newTiles = tiles.slice();
        currentPlayer === 'X' ? newTiles[i] = 'X': newTiles[i] = 'O';
        onPlay(newTiles);
    }

    const winner = Utils.calculateWinner(tiles);
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

export default Board;

