# 4x4 Tic-Tac-Toe Solver

A TypeScript/Node implementation of the win conditions for a 4x4 Tic-Tac-Toe board. There is no UI; the `TicTacToe` class in `src/TicTacToe.ts` takes a board and reports the result.

A player wins with any of:

- four in a row horizontally
- four in a column vertically
- four on either diagonal
- all four corners
- any 2x2 box

## Requirements

- Node.js 18 or later (developed on Node 24)
- npm

## Install

```sh
npm install
```

## Run the tests

```sh
npm test
```

Tests use Node's built-in test runner (`node:test`), run through `tsx` so the TypeScript is executed directly.

To type-check without running anything:

```sh
npm run typecheck
```

## Usage

A board is a 4x4 array of `'X'`, `'O'` or `null` (empty):

```ts
import { TicTacToe } from './src/TicTacToe';

const game = new TicTacToe();
const board = [
  ['X', 'X', 'X', 'X'],
  ['O', 'O', null, null],
  [null, null, null, null],
  [null, null, null, null],
];

game.checkWinner(board);  // 'X'
game.anyMovesLeft(board); // true
game.isGameOver(board);   // true
```

| Method | Returns |
| --- | --- |
| `checkWinner(board)` | `'X'` or `'O'` if that player has won; `'Draw'` if both players have a winning pattern or the board is full with no winner; `null` while the game is still in progress |
| `anyMovesLeft(board)` | `true` if at least one cell is empty |
| `isGameOver(board)` | `true` if someone has won or the board is full |

All methods throw an `Error` if the board is not 4x4 or contains a value other than `'X'`, `'O'` or `null`.

## Project layout

```
src/TicTacToe.ts          the solver
test/TicTacToe.test.ts    unit tests
```
