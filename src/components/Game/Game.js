import React, { Component } from 'react';
import Board from '../Board/Board';
import Score from '../Score/Score';
import './Game.css';

const directions = [
    [0,1], // right
    [0,-1], // left
    [-1,0], // up
    [1,0], // down
    [1,1], // diagonal - down right
    [-1, 1], // diagonal - up right                        
    [-1,-1], // diagonal - up left
    [1,-1] // diagonal - down left            
];

class Game extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            board: this.createBoard(),
            currentPlayer:'white',
            winner:null,
            lostTurn: false,
            newestDisk:null
        };
        
    }
    
    componentDidMount() {
        this.calculateAllowedCells();
    }
    
    render() {
                
        return (
            <div className="Game container">
        
                <h3 className="Game--title">{this.state.currentPlayer}&apos;s turn</h3>
                {this.lostTurn()}  
                <div className="row">
                    <Score player="white" score={this.score('white')}/>
                    <Board board={this.state.board} newest={this.state.newestDisk} reverse={this.reverse.bind(this)} player={this.state.currentPlayer}/>
                    <Score player="black" score={this.score('black')}/>                
                </div> 
            </div>);
    }
        
    winner() {
        var whiteScore = this.score('white');
        var blackScore = this.score('black');

        if (whiteScore > blackScore) return 'white';

        if (whiteScore===blackScore) return 'draw';

        return 'black';
    }

    lostTurn() {
        if (!this.state.lostTurn) return '';

        return <h4>{this.opponent()} lost his turn</h4>;
    }

    score(player) {
        var score = 0;
            
        this.state.board.forEach(row=>{
            row.forEach(cell=>{
                if (cell.disk===player) score++;
            });
        });
            
        return score;
    }
        
    calculateAllowedCells() {
            
        var b = this.state.board;
        var allowedCellsCount = 0;
        var canReverse;
            
        for (let x=0; x<8;x++) {
            for (let y=0; y<8; y++) {
                canReverse = this.canReverse(x, y);         
                b[x][y].canReverse = canReverse; 
                    
                if (canReverse.length) allowedCellsCount++;
            }
        }
            
        this.setState({
            board:b
        });
            
        return allowedCellsCount;
    }
        
    /** create the initial board state */
    createBoard() {
        let board = new Array(8);
        let rowPos;
            
        for(let x = 0; x < board.length;x++) {
            board[x] = new Array(8);
            rowPos = x * 8;
            for (let y = 0; y < board[x].length; y++) {
                    
                board[x][y] = {
                    id: rowPos + (y+1),
                    disk: this.initialDisk(x+1, y+1),
                    canReverse:[]
                };
            }
        }
            
        return board;
    }
        
    /** set initial disks black: black at 4,4;5,5; white at 4,5; 5,4; */
    initialDisk(x, y) {
        if ((x===4 && y===4) || (x===5 && y===5)) return 'black';
        if ((x===4 && y===5) || (x===5 && y===4)) return 'white';
        return null;
    }
        
    canReverse(x, y) {
            
        var canReverse = [];
        var b = this.state.board;
        var X,Y, distance, cells;
            
        // cell is already occupied
        if (b[x][y].disk) return [];
            
        directions.forEach(dir=>{
                
            distance = 0;
            X = x;
            Y = y;
            cells = [];
                
            do {
                X+= dir[0];
                Y+= dir[1];
                cells.push({X,Y});    
                distance++;
            } while (this.inBoard(X,Y) && this.hasOpponentsColor(X,Y));
                
            if (distance >=2 && this.inBoard(X,Y) && b[X][Y].disk===this.state.currentPlayer) {
                canReverse.push(cells);
            }
        });
            
        return [].concat.apply([], canReverse);
            
    }
        
    inBoard(x, y) {
        return x>=0 && x<=7 && y>=0 && y<=7;
    }
        
    hasOpponentsColor(x,y) {
        return this.state.board[x][y].disk===this.opponent();
    }
        
    opponent() {
        return this.state.currentPlayer==='white'?'black':'white';
    }

    /* Vaishnavi Sannidhanam and Muthukaruppan Annamalai on Othello heuristics
    link: https://courses.cs.washington.edu/courses/cse573/04au/Project/mini1/RUSSIA/Final_Paper.pdf
        currently asking Baird if we are allowed to use these exact funtions in our code
        otherwise we just need to adopt the principles

    COIN PARITY 
    CP = 100 * (MaxPlayerCoins - MinPlayerCoins)/(MaxPlayerCoins + MinPlayerCoins);

    ACTUAL MOBILITY (calculateAllowedCells?)
    if((MaxActualMobilityVal + MinActualMobilityVal) !=0) {
        ActualMobilityVal =  100 * (MaxActualMobilityVal – MinActualMobilityVal)/ 
        (MaxActualMobilityVal + MinActualMobilityVal);  
    } else {
        ActualMobilityVal = 0 
    } 
    POTENTIAL MOBILITY - The mobility after a few moves (actual mobility of later moves?)

    CORNERS
    if((Max Player Corner Value + Min Player Corner Value) !=0)
        Corner Heuristic Value =  100* (Max Player Corner Heurisitc Value –Min Player Corner Heuristic Value)/
        (Max Player Corner Heuristic Value + Min Player Corner Heurisitc Value)
    else
        Corner Heuristic Value = 0

    STABILITY
    if((Max Player Stability Value+ Min Player Stability Value) !=0)
        Stability Heuristic Value =  100* (Max Player Stability Value–Min Player Stability Value)/
        (Max Player Stability Value+ Min Player Stability Value)
    else Stability Heuristic Value = 0
    */


    //!!!CURRENT CONFIGURATION DOES NOT TAKE INTO ACCOUNT IF A PLAYER IS SKIPPED!!!
    //Recommendation: a list of some sort that holds the value of the heuristic as well as whether or not a player can play the next turn
    //Unsure of how to work into heuristic?
    /*minimax(position, maxDepth, alpha, beta, maxPlayer) {
        if (depth == 0 || GAMEOVER) {
            return EVALUATIONOFPOSITION
        }
        if (maxPlayer) {
            maxEvaluation = -infinity;
            FOR EACH CHILD OF POSITION {
                evaluation = minimax(CHILD, depth - 1, alpha, beta, false);
                maxEvaluation = max(maxEvaluation, evaluation);
                alpha = max(alpha, eval);
                if (beta <= alpha) {
                    break;
                }
            }
            return maxEval;
        } else {
            minEval = infinity;
            FOR EACH CHILD OF POSITION {
                evaluation = minimax(CHILD, depth - 1, alpha, beta, true);
                minEvaluation = min(minEval, eval);
                beta = min(beta, eval)
                if (beta <= alpha) {
                    break;
                }
            }
            return minEval;
        }
    }*/
        
    reverse(x, y) { 
            
        var b = this.state.board;
            
        if (!b[x][y].canReverse || !b[x][y].canReverse.length) return;
            
        b[x][y].disk = this.state.currentPlayer;
        b[x][y].canReverse.forEach(cell=>b[cell.X][cell.Y].disk = this.state.currentPlayer);

        this.setState({
            board:b,
            newestDisk:[x,y]
        },()=>{
            this.setState((prevState)=>{
                return {
                    currentPlayer: prevState.currentPlayer==='white'?'black':'white',
                };
            }, ()=>{
                var allowedCellsCount = this.calculateAllowedCells();

                if (!allowedCellsCount) { // PLAYER HAS NO MOVES
                        
                    this.setState((prevState)=>{
                        return {
                            currentPlayer: prevState.currentPlayer==='white'?'black':'white',
                        };
                    }, () => {
                        allowedCellsCount = this.calculateAllowedCells();
                        if (!allowedCellsCount) { // BOTH PLAYERS HAVE NO MOVES: GAME OVER
                            this.props.end(this.winner(), this.score('white'), this.score('black'));
                        }
                    });
                }

            });

        });
            
            
    }

    getCurrentPlayer() {

        // check whether to opponent has any moves. Count only, without assigning the actual cells
        var allowedCellsCount = this.calculateAllowedCells(); 
            
        if (!allowedCellsCount) {
            this.setState({
                lostTurn:true
            });
    
            return this.state.currentPlayer;
            
        }
            
        return this.state.currentPlayer==='white'?'black':'white';
    }
}
    
export default Game;