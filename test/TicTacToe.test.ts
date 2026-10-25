import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TicTacToe, Board, Player } from '../src/TicTacToe';

const game = new TicTacToe();

/** Parse a board from 4 strings; 'X', 'O', anything else = empty. */
function b(...rows: string[]): Board {
  return rows.map((r) => [...r].map((ch) => (ch === 'X' || ch === 'O' ? ch : null)));
}

const EMPTY = b('....', '....', '....', '....');

describe('checkWinner', () => {
  const players: Player[] = ['X', 'O'];
  const other = (p: Player): Player => (p === 'X' ? 'O' : 'X');

  for (const p of players) {
    const o = other(p);
    it(`detects a horizontal win for ${p}`, () => {
      assert.equal(game.checkWinner(b('....', `${p}${p}${p}${p}`, '....', `${o}${o}..`)), p);
    });
    it(`detects a vertical win for ${p}`, () => {
      assert.equal(game.checkWinner(b(`..${p}.`, `..${p}.`, `${o}.${p}${o}`, `..${p}.`)), p);
    });
    it(`detects a main diagonal win for ${p}`, () => {
      assert.equal(game.checkWinner(b(`${p}...`, `.${p}..`, `${o}.${p}.`, `${o}..${p}`)), p);
    });
    it(`detects an anti-diagonal win for ${p}`, () => {
      assert.equal(game.checkWinner(b(`...${p}`, `..${p}.`, `.${p}${o}.`, `${p}..${o}`)), p);
    });
    it(`detects a four-corner win for ${p}`, () => {
      assert.equal(game.checkWinner(b(`${p}..${p}`, `.${o}${o}.`, `....`, `${p}..${p}`)), p);
    });
    it(`detects a 2x2 box win for ${p}`, () => {
      // top-left, top-right, middle, and bottom-right boxes
      assert.equal(game.checkWinner(b(`${p}${p}..`, `${p}${p}..`, `..${o}.`, `...${o}`)), p);
      assert.equal(game.checkWinner(b(`..${p}${p}`, `..${p}${p}`, `${o}...`, `.${o}..`)), p);
      assert.equal(game.checkWinner(b(`${o}...`, `.${p}${p}.`, `.${p}${p}.`, `...${o}`)), p);
      assert.equal(game.checkWinner(b(`${o}...`, `.${o}..`, `..${p}${p}`, `..${p}${p}`)), p);
    });
  }

  it('returns null for an empty board', () => {
    assert.equal(game.checkWinner(EMPTY), null);
  });

  it('returns null for a partial board with no pattern', () => {
    assert.equal(game.checkWinner(b('XO..', 'OX..', '....', '...X')), null);
  });

  it('returns Draw for a full board with no winner', () => {
    assert.equal(game.checkWinner(b('XXOO', 'OOXX', 'XXOO', 'OOXX')), 'Draw');
  });

  it('does not treat three in a row as a win', () => {
    assert.equal(game.checkWinner(b('XXX.', '....', '....', '....')), null);
  });

  it('does not treat three corners or an L-shaped box as a win', () => {
    assert.equal(game.checkWinner(b('X..X', '....', '....', 'X...')), null);
    assert.equal(game.checkWinner(b('XX..', 'X...', '....', '....')), null);
  });

  it('does not treat a mixed 2x2 box as a win', () => {
    assert.equal(game.checkWinner(b('XO..', 'OX..', '....', '....')), null);
  });

  it('returns Draw when both players have a winning pattern', () => {
    assert.equal(game.checkWinner(b('XXXX', 'OOOO', '....', '....')), 'Draw');
  });

  it('throws on malformed boards', () => {
    assert.throws(() => game.checkWinner([[null]]), /4 rows/);
    assert.throws(() => game.checkWinner([...EMPTY.slice(0, 3), [null]]), /4 cells/);
    assert.throws(() => game.checkWinner(b('....', '....', '....', '....').map((r, i) => (i === 0 ? ['Z' as never, null, null, null] : r))), /unexpected/);
  });
});

describe('anyMovesLeft', () => {
  it('is true for an empty board', () => {
    assert.equal(game.anyMovesLeft(EMPTY), true);
  });
  it('is true with a single empty cell', () => {
    assert.equal(game.anyMovesLeft(b('XXOO', 'OOXX', 'XXOO', 'OOX.')), true);
  });
  it('is false for a full board', () => {
    assert.equal(game.anyMovesLeft(b('XXOO', 'OOXX', 'XXOO', 'OOXX')), false);
  });
});

describe('isGameOver', () => {
  it('is false for an empty board', () => {
    assert.equal(game.isGameOver(EMPTY), false);
  });
  it('is false mid-game with no winner', () => {
    assert.equal(game.isGameOver(b('XO..', 'OX..', '....', '...X')), false);
  });
  it('is true when someone has won with moves remaining', () => {
    assert.equal(game.isGameOver(b('XXXX', 'OO..', '....', '....')), true);
  });
  it('is true when both players have a winning pattern', () => {
    assert.equal(game.isGameOver(b('XXXX', 'OOOO', '....', '....')), true);
  });
  it('is true for a full-board draw', () => {
    assert.equal(game.isGameOver(b('XXOO', 'OOXX', 'XXOO', 'OOXX')), true);
  });
  it('is true when the last move wins', () => {
    assert.equal(game.isGameOver(b('XXXX', 'OOXO', 'OXOO', 'XOOX')), true);
  });
});
