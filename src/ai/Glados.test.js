import { TILE, Glados, Wheatley } from './Glados';
import BigTestArray from './test_resources/BigTestArray';
import { LegalMovesArrayBlack, LegalMovesArrayWhite, LegalMovesMultiTestInput, LegalMovesMultiTestOutput } from './test_resources/LegalMovesArray';

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

const BOARD_STABLE = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1]
];

const BOARD_SPLIT = [
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

const BOARD_TEST_TWO = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 2, 2, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const BOARD_TEST_LOCKED = [
  [2, 0, 1, 1, 1, 1, 1, 1],
  [2, 2, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 1, 1, 1],
  [2, 2, 1, 1, 2, 1, 1, 1],
  [2, 2, 1, 2, 1, 2, 1, 1],
  [2, 2, 1, 1, 2, 1, 2, 1],
  [2, 2, 2, 2, 2, 2, 2, 2]
];

describe('ai helper', () => {
  it('getBigArray should get a big array', () => {
    expect(Wheatley.getBigArray()).toEqual([[], [], [], [], [], [], [], []]);
  });

  it('isValidArray should return true if array valid', () => {
    expect(Wheatley.isValidArray(BOARD_SPLIT)).toEqual(true);
  });

  it('isValidArray should return false if array invalid', () => {
    expect(Wheatley.isValidArray(BigTestArray)).toEqual(false);
  });

  it('translateIn should return 2D array', () => {
    expect(Wheatley.translateIn(BigTestArray)).toEqual(BOARD_TEST);
  });

  it.skip('translateOut should return the correct BigTestArray', () => {
    // TODO
    // Console.log(Wheatley.translateOut(BOARD_TEST));
    expect(Wheatley.translateOut(BOARD_TEST)).toEqual(BigTestArray);
  });

  it('inBoard should return true if coordinates within bounds', () => {
    expect(Wheatley.inBoard(3, 2)).toEqual(true);
  });

  it('inBoard should return false if coordinates outside bounds', () => {
    expect(Wheatley.inBoard(3, 8)).toEqual(false);
  });
});

describe('ai core', () => {
  beforeAll(() => {
    Glados.initBoards();
  });

  it('initializes the gameboard', () => {
    expect(Glados.gameboard).toEqual(BOARD_EMPTY);
  });

  it('initializes the stability tracker', () => {
    expect(Glados.stabTracker).toEqual(BOARD_STABLE);
  });

  it('setGameboard should not update on invalid data', () => {
    expect(Glados.gameboard).toEqual(BOARD_EMPTY);
    expect(() => {
      Glados.setGameboard(BigTestArray);
    }).toThrowError(TypeError);
  });

  it('setGameboard updates the gameboard', () => {
    expect(Glados.gameboard).toEqual(BOARD_EMPTY);
    Glados.setGameboard(BOARD_SPLIT);
    expect(Glados.gameboard).toEqual(BOARD_SPLIT);
  });

  it('updatePlayerScore should recount', () => {
    Glados.updatePlayerScore();
    expect(Glados.playerScore.white).not.toEqual(0);
    expect(Glados.playerScore.black).not.toEqual(0);
  });

  it.skip('getScore should return number of captured tiles', () => {
    const scoreObject = { black: 32, white: 32 };
    expect(Glados.getScore()).toEqual(scoreObject);
  });

  it.skip('getCorners should return corner values', () => {
    const cornersObject = { tl: 1, tr: 2, bl: 1, br: 2 };
    expect(Glados.getCorners()).toEqual(cornersObject);
  });

  it('getLegalMoves should return all possible legal moves from a single board', () => {
    const supposedLegalMovesBlack = Glados.getLegalMoves(BOARD_TEST, TILE.BLACK);
    const supposedLegalMovesWhite = Glados.getLegalMoves(BOARD_TEST_TWO, TILE.WHITE);
    expect(supposedLegalMovesBlack).toEqual(LegalMovesArrayBlack);
    expect(supposedLegalMovesWhite).toEqual(LegalMovesArrayWhite);
  });

  it('getLegalMoves should be able to traverse long stretches of board', () => {
    const supposedLegalMovesMulti = Glados.getLegalMoves(LegalMovesMultiTestInput, TILE.WHITE);
    expect(supposedLegalMovesMulti).toEqual(LegalMovesMultiTestOutput);
  });

  it('getLegalMoves should return an empty array if no moves are possible', () => {
    const supposedLegalMovesBlack = Glados.getLegalMoves(BOARD_TEST_LOCKED, TILE.BLACK);
    expect(supposedLegalMovesBlack).toEqual([]);
  });

  it.skip('heuristic should return', () => {
    const aiGuess = Glados.heuristic(BOARD_TEST, TILE.BLACK);
    console.log(aiGuess);
    expect(aiGuess).toEqual(-3);
  });

  it.only('minimax should return', () => {
    Glados.setGameboard(BOARD_TEST);
    const aiMove = Glados.minimax(BOARD_TEST, 64, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
    console.log(aiMove);
    expect(aiMove).toBeTruthy();
  });
});