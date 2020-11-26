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

  //parityHeuristic = MaxPlayerCoins - MinPlayerCoins;
  //cornerheuristic = (maxcapturedCorners + maxPotentialCorners + 
    //((maxCapturedCorners + minCapturedCorners) * unlikely corners)) - 
    //(mincapturedCorners + minPotentialCorners + 
    //((maxCapturedCorners + minCapturedCorners) * unlikely corners))
  //captured Corner = 4
  //potential Corners = 3
  //unlikely corners = 1

  minimax(position, maxDepth, alpha, beta, maxPlayer) {
    if (maxDepth == 0 || 0/*GAMEOVER*/) {
        //return EVALUATIONOFPOSITION;
    }
    if (maxPlayer) {
        maxEvaluation = -infinity;
        if (1/*Possible moves == 0*/) {
          //minimax(thisGameBoard, depth - 1, alpha, beta, false);
        } else {
          /*FOR EACH CHILD OF POSITION {
              evaluation = minimax(CHILD, depth - 1, alpha, beta, false);
              maxEvaluation = max(maxEvaluation, evaluation);
              alpha = max(alpha, eval);
              if (beta <= alpha) {
                  break;
              }
          }*/
        }
        return maxEval;
    } else {
        minEval = infinity;
        if (1/*Possible moves == 0*/) {
          //minimax(thisGameBoard, depth - 1, alpha, beta, true);
        } else {
          /*FOR EACH CHILD OF POSITION {
              evaluation = minimax(CHILD, depth - 1, alpha, beta, true);
              minEvaluation = min(minEval, eval);
              beta = min(beta, eval)
              if (beta <= alpha) {
                  break;
              }*/
        }
        return minEval;
      }
    }
}