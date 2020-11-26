import Glados from '../ai/Glados'

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

const resetGlados = () => {
  Glados.initFlag = false;
  Glados.initBoards();
}

it('initializes the gameboard', () => {
  Glados.initBoards();
  expect(Glados.gameboard).toEqual(BOARD_EMPTY);
});

it('initializes the stability tracker', () => {
  resetGlados();
  expect(Glados.stabTracker).toEqual(BOARD_EMPTY);
});

it('setGameboard updates the gameboard', () => {
  expect(Glados.gameboard).toEqual(BOARD_EMPTY);
  Glados.setGameboard(BOARD_RAND);
  expect(Glados.gameboard).toEqual(BOARD_RAND);
});

it('updatePlayerTiles should recount', () => {
  Glados.updatePlayerTiles();
  expect(Glados.playerTiles.white).not.toEqual(0);
  expect(Glados.playerTiles.black).not.toEqual(0);
});

it('getScore should return number of captured tiles', () => {
  const scoreObject = { black: 32, white: 32 };
  expect(Glados.getScore()).toEqual(scoreObject);
});

it('getCorners should return corner values', () => {
  const cornersObject = { tl: 1, tr: 2, bl: 1, br: 2 };
  expect(Glados.getCorners()).toEqual(cornersObject);
});