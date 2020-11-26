import Glados from '../ai/Glados';
import BigTestArray from './BigTestArray';

const BOARD_EMPTY = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const BOARD_RAND = [
  [1, 1, 1, 1, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 2, 2, 2]
];

const BOARD_TEST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 2, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const resetGlados = () => {
  Glados.initFlag = false;
  Glados.initBoards();
};

it('initializes the gameboard', () => {
  Glados.initBoards();
  expect(Glados.gameboard).toEqual(BOARD_EMPTY);
});

it('initializes the stability tracker', () => {
  resetGlados();
  expect(Glados.stabTracker).toEqual(BOARD_EMPTY);
});

it('setGameboard should not update on invalid data', () => {
  expect(Glados.gameboard).toEqual(BOARD_EMPTY);
  Glados.setGameboard(BigTestArray);
  expect(Glados.gameboard).toEqual(BOARD_EMPTY);
});

it('setGameboard updates the gameboard', () => {
  expect(Glados.gameboard).toEqual(BOARD_EMPTY);
  Glados.setGameboard(BOARD_RAND);
  expect(Glados.gameboard).toEqual(BOARD_RAND);
});

it('updatePlayerScore should recount', () => {
  Glados.updatePlayerScore();
  expect(Glados.playerScore.white).not.toEqual(0);
  expect(Glados.playerScore.black).not.toEqual(0);
});

it('getScore should return number of captured tiles', () => {
  const scoreObject = { black: 32, white: 32 };
  expect(Glados.getScore()).toEqual(scoreObject);
});

it('getCorners should return corner values', () => {
  const cornersObject = { tl: 1, tr: 2, bl: 1, br: 2 };
  expect(Glados.getCorners()).toEqual(cornersObject);
});

it('translateBoard should return 2D array', () => {
  expect(Glados.translateBoard(BigTestArray)).toEqual(BOARD_TEST);
});