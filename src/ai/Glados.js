const TILE = {
  'EMPTY': 0,
  'BLACK': 1,
  'WHITE': 2
};

const STATUS = {
  'LOSE_GAME': Number.NEGATIVE_INFINITY,
  'LOSE_CORNER': -9,
  'UNSTABLE': -1,
  'NEARSTAB': 0,
  'STABLE': 1,
  'WIN_CORNER': 9,
  'WIN_GAME': Number.POSITIVE_INFINITY
};

// Helper functions for AI class
class Wheatley {
  static isValidArray(board) {
    let flag = true;
    if (board.length === 8) {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i].length !== 8 || isNaN(board[i][j])) {
            flag = false;
            break;
          }
        }
      }
    }

    return flag;
  }
}


// AI class
class Glados {
  static gameboard = this.getBigArray();
  static stabTracker = this.getBigArray();
  static initFlag = false;
  static playerScore = {
    black: 0,
    white: 0
  }
  
  // Var: none
  // Dsc: Returns an array the size of the gameboard
  // Out: Array<Array<any>>
  static getBigArray() {
    return [[], [], [], [], [], [], [], []];
  }

  // Var: none
  // Dsc: Returns the scores of each player
  // Out: { 'black': number, 'white': number }
  static getScore() {
    return { black: this.playerScore.black, white: this.playerScore.white };
  }

  // Var: none
  // Dsc:
  // Out:
  static getStability() {
    return this.stabTracker;
  }

  // Var: none
  // Dsc: Returns the value of each corner tile
  // Out: { tl: number, tr: number, bl: number, br: number }
  static getCorners() {
    return { tl: this.gameboard[0][0], tr: this.gameboard[0][7], bl: this.gameboard[7][0], br: this.gameboard[7][7] };
  }

  // Var: none
  // Dsc: Initializes the boards to equal an Array<Array<number>>
  // Out: void
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

  // Var: none
  // Dsc: Prints the gameboard array to the console
  // Out: void
  static visGameboard() {
    console.log('Current gameboard status:');
    console.table(this.gameboard);
  }

  // Var: none
  // Dsc: Prints the stability tracking array to the console
  // Out: void
  static visStabTracker() {
    console.log('Current stability status:');
    console.table(this.stabTracker);
  }

  // Var: board: Array<Array<number>>
  // Dsc: Sets the static gameboard to `board`
  // Out: void
  static setGameboard(board) {
    if (Wheatley.isValidArray(board)) {
      Glados.gameboard = board;
      this.updatePlayerScore();
    } else {
      throw new TypeError('Invalid board.');
    }
  }

  // Var: board: Array<Array<number>>
  // Dsc: Sets the static stability tracker to `board`
  // Out: void
  static setStability(board) {
    // Input `board` is a 2D array of ints
    if (Wheatley.isValidArray(board)) {
      Glados.stabTracker = board;
    }
  }

  // Var: none
  // Dsc: Iterates through the static gameboard array and counts the number of each color of tiles
  // Out: void
  static updatePlayerScore() {
    this.playerScore.white = 0;
    this.playerScore.black = 0;

    for (let i = 0; i < this.gameboard.length; i++) {
      for (let j = 0; j < this.gameboard[i].length; j++) {
        if (this.gameboard[i][j] === TILE.WHITE) {
          this.playerScore.white++;
        } else if (this.gameboard[i][j] === TILE.BLACK) {
          this.playerScore.black++;
        }
      }
    }
  }

  // Var: board: Object
  // Dsc: Translates the game's board array into our 2d array of numbers
  // Out: Array<Array<number>>
  static translateIn(board) {
    const newBoard = this.getBigArray();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        switch (board[i][j].disk) {
          case 'black':
            newBoard[i][j] = TILE.BLACK;
            break;

          case 'white':
            newBoard[i][j] = TILE.WHITE;
            break;

          default:
            newBoard[i][j] = TILE.EMPTY;
            break;
        }
      }
    }

    return newBoard;
  }

  // Var: TODO
  // Dsc: TODO
  // Out: TODO
  static getLegalMoves() {
    // TODO
  }
}

module.exports = { Wheatley, Glados };