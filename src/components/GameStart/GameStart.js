import React, { Component } from 'react';
import { Glados } from '../../ai/Glados';
import './GameStart.css';

class GameStart extends Component {
    
  render() {
    return (
      <div className="GameStart">
        <h1>Othello</h1>
        <div>
          <div className="dropdown">
            <label htmlFor="difficulty">Difficulty setting:</label>
            <select name="difficulty" id="difficulty" onChange={event => Glados.setDifficulty(event.target.value)}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={this.props.go}>Play</button><br />
        <small>Easy: 16 levels deep</small><br />
        <small>Medium: 32 levels deep</small><br />
        <small>Medium: 64 levels deep</small><br />
      </div>);
  }
}

export default GameStart;