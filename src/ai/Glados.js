const TILE = {
  'EMPTY': 0,
  'WHITE': 1,
  'BLACK': 2
}

class Glados {
  // Create empty 2d array
  static gameboard = [[], [], [], [], [], [], [], []];
  
  static initGameboard() {
    console.log('Initializing game board');
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        this.gameboard[i][j] = TILE.EMPTY;
      }
    }

    this.visGameboard();
  }

  static visGameboard() {
    console.log('Current board status:');
    console.table(this.gameboard);
  }

  static setGameboard(board) {
    console.log('Setting gameboard to new value');
  }

  static getPlayerTiles(tile) {
    // Tile has to be of type TILE.EMPTY | TILE.WHITE | TILE.BLACK
    
  }
}