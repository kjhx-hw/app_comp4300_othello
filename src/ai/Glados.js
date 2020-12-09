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

const MOVE = {
  'RIGHT': [0, 2],
  'LEFT': [0, -2],
  'UP': [-2, 0],
  'DOWN': [2, 0],
  'DOWN_RIGHT': [2, 2],
  'UP_RIGHT': [-2, 2],
  'UP_LEFT': [-2, -2],
  'DOWN_LEFT': [2, -2]
};

const MOVE_IMMEDIATE = {
  'RIGHT': [0, 1],
  'LEFT': [0, -1],
  'UP': [-1, 0],
  'DOWN': [1, 0],
  'DOWN_RIGHT': [1, 1],
  'UP_RIGHT': [-1, 1],
  'UP_LEFT': [-1, -1],
  'DOWN_LEFT': [1, -1]
};

// Helper functions for AI class
class Wheatley {
  // Var: none
  // Dsc: Returns an array the size of the gameboard
  // Out: Array<Array<any>>
  static getBigArray() {
    return [[], [], [], [], [], [], [], []];
  }

  // Var: board: any
  // Dsc: Determines if `board` is a valid 8x8 array of numbers
  // Out: boolean
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

  // Var: board: Object
  // Dsc: Translates the game's board array into our 2d array of numbers
  // Out: Array<Array<number>>
  static translateIn(board) {
    const newBoard = Wheatley.getBigArray();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].disk === 'black') {
          newBoard[i][j] = TILE.BLACK;
        } else if (board[i][j].disk === 'white') {
          newBoard[i][j] = TILE.WHITE;
        } else {
          newBoard[i][j] = TILE.EMPTY;
        }
      }
    }

    return newBoard;
  }

  // Var: board: Array<Array<number>>
  // Dsc: Translates our 2d array of numbers into the game's board array
  // Out: Object of type BigTestArray
  static translateOut(board) {
    const outArray = this.getBigArray();
    let currentCellId = 1;
    
    // Recreate the Game.js board from our data
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const newCellObject = { id: currentCellId, disk: '', canReverse: [] };
        if (board[i][j] === TILE.BLACK) {
          newCellObject.disk = 'black';
        } else if (board[i][j] === TILE.WHITE) {
          newCellObject.disk = 'white';
        } else {
          newCellObject.disk = null;
        }

        currentCellId++;
        // TODO: calculate canReverse array
        outArray[i].push(newCellObject);
      }
    }

    return outArray;
  }

  // Var: x: number, y: number
  // Dsc: Determines if a set of coordinates is within the bounds of the gameboard
  // Out: boolean
  static inBoard(x, y) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }

  // Var: input: any
  // Dsc: recursively deep copy any object. Credit @djD-REK
  // Out: any
  static deepCopy(input) {
    /* eslint-disable prefer-const */
    let outObject;
    let value;
    let key;
    if (typeof input !== 'object' || input === null) {
      return input;
    }

    outObject = Array.isArray(input) ? [] : {};

    for (key in input) {
      value = input[key];
      outObject[key] = this.deepCopy(value);
    }

    return outObject;
  }
}


// AI class
class Glados {
  static gameboard = Wheatley.getBigArray();
  static stabTracker = Wheatley.getBigArray();
  static initFlag = false;
  static playerScore = {
    black: 0,
    white: 0
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

  // Var: board: Array<Array<Number>>, player: TILE
  // Dsc: Gets the board state for every possible legal move for a player.
  // Out: Array of boards representing every possible legal move.
  static getLegalMoves(board, player) {
    const moveCollection = [];
    const posToCheck = [];

    if (!Wheatley.isValidArray(board)) {
      throw new TypeError('Invalid board.');
    }

    // Collect all posistions for `player`
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] !== TILE.EMPTY && board[i][j] === player) {
          posToCheck.push([i, j]);
        }
      }
    }

    // Try every possible move on every position to determine legal moves
    posToCheck.forEach(coord => {
      Object.keys(MOVE).forEach(move => {
        const nextBoard = Wheatley.deepCopy(board);
        const currentMove = nextBoard[coord[0]][coord[1]];
        if (Wheatley.inBoard(coord[0] + MOVE[move][0], coord[1] + MOVE[move][1])) {
          const nextMove = nextBoard[coord[0] + MOVE[move][0]][coord[1] + MOVE[move][1]];
          const betweenMove = nextBoard[coord[0] + MOVE_IMMEDIATE[move][0]][coord[1] + MOVE_IMMEDIATE[move][1]];
          // If a move is legal, modify `nextBoard` to reflect the state of the game if they took that move
          if (nextMove === TILE.EMPTY && betweenMove !== TILE.EMPTY && betweenMove !== player) {
            nextBoard[coord[0] + MOVE[move][0]][coord[1] + MOVE[move][1]] = currentMove;
            nextBoard[coord[0] + MOVE_IMMEDIATE[move][0]][coord[1] + MOVE_IMMEDIATE[move][1]] = currentMove;
            moveCollection.push(nextBoard);
          }
        }
      });
    });

    return moveCollection;
  }
}

module.exports = { TILE, STATUS, MOVE, Wheatley, Glados };