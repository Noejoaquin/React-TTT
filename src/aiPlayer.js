class AIPlayer {
    constructor(mark = 'O') {
      this.mark = mark;
      this.opponentMark = this.mark === 'X' ? 'O' : 'X'
      // winningOrBlockingMap: arrayOfPossibleWinningScenariosForOpponent
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

export default AIPlayer;