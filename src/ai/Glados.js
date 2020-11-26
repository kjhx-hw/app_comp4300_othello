const TILE = {
  'EMPTY': 0,
  'BLACK': 1,
  'WHITE': 2
};

const STATUS = {
  'STABLE': 0,
  'NEARSTAB': 1,
  'UNSTABLE': 2
};

class Glados {
  static gameboard = this.getBigArray();
  static stabTracker = this.getBigArray();
  static initFlag = false;
  static playerTiles = {
    black: 0,
    white: 0
  }
  
  static getBigArray() {
    return [[], [], [], [], [], [], [], []];
  }

  static getScore() {
    return { black: this.playerTiles.black, white: this.playerTiles.white };
  }

  static getStability() {
    return this.stabTracker;
  }

  static getCorners() {
    return { tl: this.gameboard[0][0], tr: this.gameboard[0][7], bl: this.gameboard[7][0], br: this.gameboard[7][7] };
  }

  static initBoards() {
    if (this.initFlag) {
      console.warn('Boards already initialized!');
    } else {
      this.initFlag = true;
    }

    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        this.gameboard[i][j] = TILE.EMPTY;
        this.stabTracker[i][j] = STATUS.STABLE;
      }
    }
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
    let validFlag = true;

    // Check if the board is the correct size
    if (board.length === 8) {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i].length !== 8 || isNaN(board[i][j])) {
            validFlag = false;
            break;
          }
        }
      }
    }

    if (validFlag) {
      Glados.gameboard = board;
      this.updatePlayerTiles();
    }
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

  static translateBoard(board) {
    // Translates actual game board into our 2D array structure
    const newBoard = this.getBigArray();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        switch (board[i][j].disk) {
        case 'black':
          newBoard[i][j] = 1;
          break;

        case 'white':
          newBoard[i][j] = 2;
          break;
        
        default:
          newBoard[i][j] = 0;
          break;
        }
      }
    }

    return newBoard;
  }
}

export default Glados;