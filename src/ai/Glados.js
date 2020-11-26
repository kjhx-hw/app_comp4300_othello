const TILE = {
  'EMPTY': 0,
  'BLACK': 1,
  'WHITE': 2
}

const STATUS = {
  'STABLE': 0,
  'NEARSTAB': 1,
  'UNSTABLE': 2
}

class Glados {
  static gameboard = this.getBigArray();
  static stabTracker = this.getBigArray();
  static playerTiles = {
    black: 0,
    white: 0
  }
  
  static getBigArray() {
    return [[], [], [], [], [], [], [], []];
  }

  static initBoards() {
    console.log('Initializing game & stability boards');
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        this.gameboard[i][j] = TILE.EMPTY;
        this.stabTracker[i][j] = STATUS.STABLE;
      }
    }

    this.visGameboard();
  }

  static visGameboard() {
    console.log('Current gameboard status:');
    console.table(this.gameboard);
  }

  static visStabTracker() {
    console.log('Current stability status:');
    console.table(this.stabTracker);
  }

  static setGameboard(board) {
    // Input `board` is a 2D array
    console.log('Setting gameboard to new values');
  }

  static updatePlayerTiles() {
    this.playerTiles.white = 0;
    this.playerTiles.black = 0;

    for (let i = 0; i < this.gameboard.length; i++) {
      for (let j = 0; j < this.gameboard[i].length; j++) {
        if (this.gameboard[i][j] === TILE.WHITE) {
          this.playerTiles.white++;
        } else if (this.gameboard[i][j] === TILE.BLACK) {
          this.playerTiles.black++;
        }
      }
    }
  }

  static getPlayerTiles(tile) {
    // Input `tile` has to be of type TILE.BLACK | TILE.WHITE
    switch (tile) {
      case TILE.BLACK:
        return this.playerTiles.black;
        break;

      case TILE.WHITE:
        return this.playerTiles.white;
        break;
    
      default:
        return -1;
        break;
    }
  }
}