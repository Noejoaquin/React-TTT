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

export default Tile;