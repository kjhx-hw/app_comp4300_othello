import React, { Component } from 'react';
import Game from '../components/Game/Game';
import GameOver from '../components/GameOver/GameOver';
import GameStart from '../components/GameStart/GameStart';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'start',
      winner: null,
      whiteScore: 0,
      blackScore: 0
    };
  }

  render() {
    const gameStart = this.state.status === 'start' ? <GameStart go={this.startGame.bind(this)}/> : '';
    const game = this.state.status === 'active' ? <Game end={this.endGame.bind(this)} /> : '';
    const gameOver = this.state.status === 'over' ? <GameOver
      winner={this.state.winner}
      restart={this.restartGame.bind(this)}
      white={this.state.whiteScore}
      black={this.state.blackScore}
    /> : '';

    return (
      <div className="App">
        {gameStart}
        {game}
        {gameOver}
      </div>
    );
  }

  startGame() {
    this.setState({
      status: 'active'
    });
  }

  restartGame() {
    this.setState({
      status: 'start',
    });
  }

  endGame(winner, whiteScore, blackScore) {
    this.setState({
      status: 'over',
      winner,
      whiteScore,
      blackScore
    });
  }
}

export default App;
