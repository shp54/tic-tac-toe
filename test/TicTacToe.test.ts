import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TicTacToe, Board, Player, Result } from '../src/TicTacToe';

const game = new TicTacToe();

/** Parse a board from 4 strings; 'X', 'O', anything else = empty. */
function parseBoard(...rows: string[]): Board {
  return rows.map((r) => [...r].map((ch) => (ch === 'X' || ch === 'O' ? ch : null)));
}

/** Runs one test per case, named by the case's `name`. */
function each<T extends { name: string }>(cases: T[], body: (c: T) => void): void {
  for (const c of cases) {
    it(c.name, () => body(c));
  }
}

const EMPTY = parseBoard('....', '....', '....', '....');
const FULL_DRAW = parseBoard('XXOO', 'OOXX', 'XXOO', 'OOXX');
const MID_GAME = parseBoard('XO..', 'OX..', '....', '...X');

describe('checkWinner', () => {
  // Each board has `p` winning one way, with `o` filler that doesn't win.
  const winCases: { name: string; board: (p: Player, o: Player) => Board }[] = [
    { name: 'horizontal', board: (p, o) => parseBoard('....', `${p}${p}${p}${p}`, '....', `${o}${o}..`) },
    { name: 'vertical', board: (p, o) => parseBoard(`..${p}.`, `..${p}.`, `${o}.${p}${o}`, `..${p}.`) },
    { name: 'main diagonal', board: (p, o) => parseBoard(`${p}...`, `.${p}..`, `${o}.${p}.`, `${o}..${p}`) },
    { name: 'anti-diagonal', board: (p, o) => parseBoard(`...${p}`, `..${p}.`, `.${p}${o}.`, `${p}..${o}`) },
    { name: 'four corners', board: (p, o) => parseBoard(`${p}..${p}`, `.${o}${o}.`, '....', `${p}..${p}`) },
    { name: 'top-left 2x2 box', board: (p, o) => parseBoard(`${p}${p}..`, `${p}${p}..`, `..${o}.`, `...${o}`) },
    { name: 'top-right 2x2 box', board: (p, o) => parseBoard(`..${p}${p}`, `..${p}${p}`, `${o}...`, `.${o}..`) },
    { name: 'center 2x2 box', board: (p, o) => parseBoard(`${o}...`, `.${p}${p}.`, `.${p}${p}.`, `...${o}`) },
    { name: 'bottom-right 2x2 box', board: (p, o) => parseBoard(`${o}...`, `.${o}..`, `..${p}${p}`, `..${p}${p}`) },
  ];
  const players: Player[] = ['X', 'O'];

  each(
    winCases.flatMap((c) =>
      players.map((p) => ({
        name: `detects a ${c.name} win for ${p}`,
        board: c.board(p, p === 'X' ? 'O' : 'X'),
        expected: p,
      })),
    ),
    ({ board, expected }) => assert.equal(game.checkWinner(board), expected),
  );

  const resultCases: { name: string; board: Board; expected: Result | null }[] = [
    { name: 'returns null for an empty board', board: EMPTY, expected: null },
    { name: 'returns null for a partial board with no pattern', board: MID_GAME, expected: null },
    { name: 'returns Draw for a full board with no winner', board: FULL_DRAW, expected: 'Draw' },
    { name: 'returns Draw when both players have a winning pattern', board: parseBoard('XXXX', 'OOOO', '....', '....'), expected: 'Draw' },
    { name: 'does not treat three in a row as a win', board: parseBoard('XXX.', '....', '....', '....'), expected: null },
    { name: 'does not treat three corners as a win', board: parseBoard('X..X', '....', '....', 'X...'), expected: null },
    { name: 'does not treat an L-shaped box as a win', board: parseBoard('XX..', 'X...', '....', '....'), expected: null },
    { name: 'does not treat a mixed 2x2 box as a win', board: parseBoard('XO..', 'OX..', '....', '....'), expected: null },
  ];

  each(resultCases, ({ board, expected }) => assert.equal(game.checkWinner(board), expected));

  const malformedCases: { name: string; board: Board; error: RegExp }[] = [
    { name: 'throws when there are too few rows', board: [[null]], error: /4 rows/ },
    { name: 'throws when a row is the wrong length', board: [...EMPTY.slice(0, 3), [null]], error: /4 cells/ },
    { name: 'throws on an unexpected cell value', board: [['Z' as never, null, null, null], ...EMPTY.slice(1)], error: /unexpected/ },
  ];

  each(malformedCases, ({ board, error }) => assert.throws(() => game.checkWinner(board), error));
});

describe('anyMovesLeft', () => {
  const cases = [
    { name: 'is true for an empty board', board: EMPTY, expected: true },
    { name: 'is true with a single empty cell', board: parseBoard('XXOO', 'OOXX', 'XXOO', 'OOX.'), expected: true },
    { name: 'is false for a full board', board: FULL_DRAW, expected: false },
  ];

  each(cases, ({ board, expected }) => assert.equal(game.anyMovesLeft(board), expected));
});

describe('isGameOver', () => {
  const cases = [
    { name: 'is false for an empty board', board: EMPTY, expected: false },
    { name: 'is false mid-game with no winner', board: MID_GAME, expected: false },
    { name: 'is true when someone has won with moves remaining', board: parseBoard('XXXX', 'OO..', '....', '....'), expected: true },
    { name: 'is true when both players have a winning pattern', board: parseBoard('XXXX', 'OOOO', '....', '....'), expected: true },
    { name: 'is true for a full-board draw', board: FULL_DRAW, expected: true },
    { name: 'is true when the last move wins', board: parseBoard('XXXX', 'OOXO', 'OXOO', 'XOOX'), expected: true },
  ];

  each(cases, ({ board, expected }) => assert.equal(game.isGameOver(board), expected));
});
