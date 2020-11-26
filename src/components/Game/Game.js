import React, { Component } from 'react';
import Glados from '../../ai/Glados';
import Board from '../Board/Board';
import Score from '../Score/Score';
import './Game.css';

const directions = [
  [0, 1], // Right
  [0, -1], // Left
  [-1, 0], // Up
  [1, 0], // Down
  [1, 1], // Diagonal - down right
  [-1, 1], // Diagonal - up right
  [-1, -1], // Diagonal - up left
  [1, -1] // Diagonal - down left            
];

class Game extends Component {
    
  constructor(props) {
    super(props);
        
    this.state = {
      board: this.createBoard(),
      currentPlayer: 'white',
      winner: null,
      lostTurn: false,
      newestDisk: null
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
      </div>
    );
  }

  winner() {
    const whiteScore = this.score('white');
    const blackScore = this.score('black');

    if (whiteScore > blackScore) return 'white';

    if (whiteScore===blackScore) return 'draw';

    return 'black';
  }

  lostTurn() {
    if (!this.state.lostTurn) return '';

    return <h4>{this.opponent()} lost his turn</h4>;
  }

  score(player) {
    let score = 0;
            
    this.state.board.forEach(row=>{
      row.forEach(cell=>{
        if (cell.disk===player) score++;
      });
    });

    Glados.setGameboard(Glados.translateBoard(this.state.board));
    return score;
  }
        
  calculateAllowedCells() {
    const b = this.state.board;
    let allowedCellsCount = 0;
    let canReverse;

    for (let x=0; x<8;x++) {
      for (let y=0; y<8; y++) {
        canReverse = this.canReverse(x, y);
        b[x][y].canReverse = canReverse;
        if (canReverse.length) allowedCellsCount++;
      }
    }

    this.setState({
      board: b
    });

    return allowedCellsCount;
  }
        
  /** Create the initial board state */
  createBoard() {
    const board = new Array(8);
    let rowPos;
            
    for (let x = 0; x < board.length;x++) {
      board[x] = new Array(8);
      rowPos = x * 8;
      for (let y = 0; y < board[x].length; y++) {
                    
        board[x][y] = {
          id: rowPos + (y+1),
          disk: this.initialDisk(x+1, y+1),
          canReverse: []
        };
      }
    }
     
    // Initialize Glados boards
    Glados.initBoards();
    return board;
  }
        
  /** Set initial disks black: black at 4,4;5,5; white at 4,5; 5,4; */
  initialDisk(x, y) {
    if ((x===4 && y===4) || (x===5 && y===5)) return 'black';
    if ((x===4 && y===5) || (x===5 && y===4)) return 'white';
    return null;
  }
        
  canReverse(x, y) {
            
    const canReverse = [];
    const b = this.state.board;
    let X; let Y; let distance; let cells;
            
    // Cell is already occupied
    if (b[x][y].disk) return [];
            
    directions.forEach(dir=>{
                
      distance = 0;
      X = x;
      Y = y;
      cells = [];
                
      do {
        X+= dir[0];
        Y+= dir[1];
        cells.push({X, Y});    
        distance++;
      } while (this.inBoard(X, Y) && this.hasOpponentsColor(X, Y));
                
      if (distance >=2 && this.inBoard(X, Y) && b[X][Y].disk===this.state.currentPlayer) {
        canReverse.push(cells);
      }
    });
            
    return [].concat.apply([], canReverse);
            
  }
        
  inBoard(x, y) {
    return x>=0 && x<=7 && y>=0 && y<=7;
  }
        
  hasOpponentsColor(x, y) {
    return this.state.board[x][y].disk===this.opponent();
  }
        
  opponent() {
    return this.state.currentPlayer==='white'?'black':'white';
  }
        
  reverse(x, y) { 
            
    const b = this.state.board;
            
    if (!b[x][y].canReverse || !b[x][y].canReverse.length) return;
            
    b[x][y].disk = this.state.currentPlayer;
    b[x][y].canReverse.forEach(cell=>b[cell.X][cell.Y].disk = this.state.currentPlayer);

    this.setState({
      board: b,
      newestDisk: [x, y]
    }, ()=>{
      this.setState((prevState)=>{
        return {
          currentPlayer: prevState.currentPlayer==='white'?'black':'white',
        };
      }, ()=>{
        let allowedCellsCount = this.calculateAllowedCells();

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

    // Check whether to opponent has any moves. Count only, without assigning the actual cells
    const allowedCellsCount = this.calculateAllowedCells(); 
            
    if (!allowedCellsCount) {
      this.setState({
        lostTurn: true
      });
    
      return this.state.currentPlayer;
            
    }
            
    return this.state.currentPlayer==='white'?'black':'white';
  }
}
    
export default Game;