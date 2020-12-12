/* eslint-disable */

const TILE = {
  'EMPTY': 0,
  'BLACK': 1,
  'WHITE': 2
};

const STATUS = {
  'LOSE_GAME': Number.NEGATIVE_INFINITY,
  'LOSE_CORNER': Number.MIN_SAFE_INTEGER,
  'UNSTABLE': -1,
  'NEARSTAB': 0,
  'STABLE': 1,
  'WIN_CORNER': Number.MAX_SAFE_INTEGER,
  'WIN_GAME': Number.POSITIVE_INFINITY
};

const MOVE = {
  'RIGHT': [0, 1],
  'LEFT': [0, -1],
  'UP': [-1, 0],
  'DOWN': [1, 0],
  'DOWN_RIGHT': [1, 1],
  'UP_RIGHT': [-1, 1],
  'UP_LEFT': [-1, -1],
  'DOWN_LEFT': [1, -1]
};

const DIFFICULTY = {
  EASY: { depth: 16, pause: 1000 },
  MEDIUM: { depth: 32, pause: 2000 },
  HARD: { depth: 64, pause: 4000 }
}

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

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


// AI class
class Glados {
  static gameboard = Wheatley.getBigArray();
  static stabTracker = Wheatley.getBigArray();
  static initFlag = false;
  static difficultyLevel = DIFFICULTY.HARD;
  static playerScore = {
    black: 0,
    white: 0
  }

  // Var: none
  // Dsc: Returns the scores of each player
  // Out: { 'black': number, 'white': number }
  // static getScore() {
  //   return { black: this.playerScore.black, white: this.playerScore.white };
  // }

  static getScore(board) {
    let currentScore = { black:0, white: 0 };

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === TILE.WHITE) {
          currentScore.white++;
        } else if (board[i][j] === TILE.BLACK) {
          currentScore.black++;
        }
      }
    }

    return currentScore;
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
  // static getCorners() {
  //   return { tl: this.gameboard[0][0], tr: this.gameboard[0][7], bl: this.gameboard[7][0], br: this.gameboard[7][7] };
  // }

  static getCorners(board) {
    return { tl: board[0][0], tr: board[0][7], bl: board[7][0], br: board[7][7] };
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
      // Update stability
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

    // Collect all positions for `player`
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] !== TILE.EMPTY && board[i][j] === player) {
          posToCheck.push([i, j]);
        }
      }
    }

    // Try every possible move on every position to determine legal moves
    posToCheck.forEach(position => {
      Object.values(MOVE).forEach(direction => {
        let possibleBoard = Wheatley.deepCopy(board);
        let nextCoordinates = [ position[0] + direction[0], position[1] + direction[1]];
        if (!Wheatley.inBoard(...nextCoordinates)) {
          // If the next coordinates aren't valid, skip this iteration
          return;
        }

        let nextMove = possibleBoard[nextCoordinates[0]][nextCoordinates[1]];
        let traveled = 1;
        while (Wheatley.inBoard(...nextCoordinates) && nextMove !== player) {
          if (nextMove !== player && nextMove !== TILE.EMPTY) {
            possibleBoard[nextCoordinates[0]][[nextCoordinates[1]]] = player;
            nextCoordinates[0] += direction[0];
            nextCoordinates[1] += direction[1];
            if (!Wheatley.inBoard(...nextCoordinates)) {
              // If the next coordinates aren't valid, skip this iteration
              return;
            }

            nextMove = possibleBoard[nextCoordinates[0]][nextCoordinates[1]];
            traveled++;
          } else {
            possibleBoard[nextCoordinates[0]][[nextCoordinates[1]]] = player;
            if (traveled > 1) {
              moveCollection.push(possibleBoard);
            }

            break;
          }
        }
      });
    });

    return moveCollection;
  }

  // Var: position: Array<Array<Number>>, maxDepth: Number, alpha: Number.NEGATIVE_INFINITY, beta: Number.POSITIVE_INFINITY, maxPlayer: boolean
  // Dsc: Determines which move should be chosen, utilizing the Minimax Algorithm along with Alpha-Beta pruning
  // Out: { value: Number, board: Array<Array<Number>> }
  static minimax(position, maxDepth, alpha, beta, maxPlayer) {
    let hvalue = 0;
    if (maxPlayer) {
      hvalue = this.heuristic(position, TILE.BLACK);
    } else {
      hvalue = this.heuristic(position, TILE.WHITE);
    }
    if (maxDepth === 0 || (hvalue === STATUS.WIN_GAME || hvalue === STATUS.LOSE_GAME)) {
      return {value: hvalue, board: position};
    }
    if (maxPlayer) {
      let maxEvaluation = {value: Number.NEGATIVE_INFINITY, board: position};
      let legalMoves = this.getLegalMoves(position, TILE.BLACK);
      for (const child of legalMoves) {
        let evaluation = this.minimax(child, maxDepth - 1, alpha, beta, false);
        if (Math.max(maxEvaluation.value, evaluation.value) === evaluation) {
          maxEvaluation = { value: evaluation.value, board: child };
        } else {
          maxEvaluation = { value: maxEvaluation.value, board: child };
        }
        alpha = Math.max(alpha, evaluation.value);
        if (beta <= alpha) {
          break;
        }
      }
      return maxEvaluation;
    } else {
      let minEvaluation = { value: Number.POSITIVE_INFINITY, board: position };
      let legalMoves = this.getLegalMoves(position, TILE.WHITE);
      for (const child of legalMoves) {
        let evaluation = this.minimax(child, maxDepth - 1, alpha, beta, true);
        if (Math.min(minEvaluation.value, evaluation.value) === evaluation) {
          minEvaluation = { value: evaluation.value, board: child };
        } else {
          minEvaluation = { value: minEvaluation.value, board: child };
        }
        beta = Math.min(beta, evaluation.value);
        if (beta <= alpha) {
          break;
        }
      }
      return minEvaluation;
    }
  }

  // Var: board: Array<Array<Number>>, player: TILE
  // Dsc: Calculates the heuristic value of the game board
  // Out: (Number) heuristic value of the game board
  static heuristic(board, player) {
    let value = 0;
    if ((this.getLegalMoves(board, TILE.WHITE) === [] && this.getLegalMoves(board, TILE.BLACK) === []) && player === TILE.BLACK) {
      value = Number.POSITIVE_INFINITY;
    } else if ((this.getLegalMoves(board, TILE.WHITE) === [] && this.getLegalMoves(board, TILE.BLACK) === []) && player === TILE.WHITE) {
      value = Number.NEGATIVE_INFINITY;
    } else {
      let score = this.getScore(board);
      // TODO: let stability = this.getStability();
      let corners = this.getCorners(board);
      value = (score.black - score.white) + (corners.tl + corners.tr + corners.bl + corners.br); //!!! STABILITY NEEDS TO BE IMPLEMENTED !!!
    }
    return value;
  }

  // Var: currentPosition: Array<Array<Number>>, newPosition: Array<Array<Number>>
  // Dsc: Figures out which position on the board was chosen as the next move
  // Out: Array with the coordinates of the next move to make. If [-1, -1], a move could not be made
  static findChosenMove (currentPosition, newPosition) {
    let position = [-1, -1];
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        if (newPosition[i][j] !== TILE.EMPTY && currentPosition[i][j] === TILE.EMPTY) {
          position = [i, j];
        }
      }
    }
    return position;
  }
}

module.exports = { TILE, STATUS, MOVE, Wheatley, Glados };