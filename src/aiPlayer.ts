class AIPlayer {
    mark: string;
    opponentMark: string;
    winningOrBlockingMap: Array<Array<[number, number]>>;
    corners: Array<number>;
    turnCount: number;
    constructor(mark = 'O') {
      this.mark = mark;
      this.opponentMark = this.mark === 'X' ? 'O' : 'X'
      // winningOrBlockingMap: arrayOfPossibleWinningScenariosForOpponent
      this.winningOrBlockingMap = [
       [[1, 2], [3, 6], [4, 8]],
       [[0, 2], [4, 7]],
       [[0, 1], [5, 8], [4, 6]],
       [[4, 5], [0, 6]],
       [[3, 5], [1, 7], [2, 6], [0, 8]],
       [[3, 4], [2, 8]],
       [[7, 8], [0, 3], [2, 4]],
       [[6, 8], [1, 4]],
       [[6, 7], [2, 5], [0, 4]],
      ];
      this.corners = [0, 6, 8, 2];
      this.turnCount = 0;
    }
  
    move(tiles: Array<string>) {
      this.turnCount += 1;
      let newTiles = tiles.slice();
      // make a move by iterating through the tiles, and placing a marker at the first null space
      const blockingMove = this.#needWinningOrBlockingMove(newTiles, 'block');
      const winningMove = this.#needWinningOrBlockingMove(newTiles, 'win');
      const cornerMoveAvailable = this.#getCornerMove(newTiles);
      const makeMiddleMove = this.#makeMiddleMove(newTiles);
      if (newTiles instanceof Array) {
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
      }
      return newTiles;
    }
  
    #makeMiddleMove(newTiles: Array<string>) {
      if (this.mark === 'O' && this.#opponentMadeCornerMove(newTiles) && newTiles[4] === null) {
        return 4;
      } else if (this.mark === 'X' && this.turnCount === 3) {
        return 4
      }
  
      return null;
    }
  
    #opponentMadeCornerMove(newTiles: Array<string>) {
      for (let i=0; i<this.corners.length; i+=1) {
        // using ! as the non-null asserstion operator here
        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
        if (newTiles[this.corners[i]!] === this.opponentMark) {
          return true;
        }
      }
      return false;
    }
  
    #getCornerMove(tiles: Array<string>) {
      for (let i=0; i<tiles.length; i+=1) {
        const corner = this.corners[i];
        // again we are sure that corner exists here
        if (tiles[corner!] === null) return corner;
      }
      return undefined;
    }
  
    #needWinningOrBlockingMove(tiles: Array<string>, action: string):number | undefined {
      const mark = action === 'block' ? this.opponentMark : this.mark 
      // iterate through all the blocking moves
      for (const blockingMove in this.winningOrBlockingMap) {
        const combosOfTilesToBlock = this.winningOrBlockingMap[blockingMove];
        // iterate through the set of possible opponent scenarios
        for (let i=0; i < combosOfTilesToBlock!.length; i += 1) {
          const tilesToBlock = combosOfTilesToBlock![i];
          // return the blocking move for the first scenario seen on the board
          if (tiles[tilesToBlock![0]] === mark && tiles[tilesToBlock![1]] === mark && !tiles[blockingMove]) return parseInt(blockingMove);
        }
      }
      return undefined;
    }
  }

export default AIPlayer;