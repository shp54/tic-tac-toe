export type Player = 'X' | 'O';
export type Result = Player | 'Draw';
export type Cell = Player | null;
export type Board = Cell[][];

// Winning patterns as indices into the board flattened row by row:
//    0  1  2  3
//    4  5  6  7
//    8  9 10 11
//   12 13 14 15
const PATTERNS: number[][] = [
  // rows
  [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
  // columns
  [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
  // diagonals
  [0, 5, 10, 15], [3, 6, 9, 12],
  // four corners
  [0, 3, 12, 15],
  // 2x2 boxes
  [0, 1, 4, 5], [1, 2, 5, 6], [2, 3, 6, 7],
  [4, 5, 8, 9], [5, 6, 9, 10], [6, 7, 10, 11],
  [8, 9, 12, 13], [9, 10, 13, 14], [10, 11, 14, 15],
];

export class TicTacToe {
  /**
   * Returns the winning player, or null if nobody has won.
   * Returns 'Draw' if both players have a winning pattern, or if the board is
   * full with no winner. Returns null while the game is still in progress.
   * Throws if the board is malformed.
   */
  public checkWinner(board: Board): Result | null {
    const cells = this.flatten(board);

    const winners = new Set<Player>();
    for (const [a, b, c, d] of PATTERNS) {
      const first = cells[a];
      if (first !== null && first === cells[b] && first === cells[c] && first === cells[d]) {
        winners.add(first);
      }
    }

    if (winners.size > 1) {
      return 'Draw';
    }
    if (winners.size === 1) {
      return [...winners][0];
    }
    return this.anyMovesLeft(board) ? null : 'Draw';
  }

  /** True if at least one cell is empty. */
  public anyMovesLeft(board: Board): boolean {
    return this.flatten(board).includes(null);
  }

  /** The game ends when someone has won or the board is full. */
  public isGameOver(board: Board): boolean {
    return this.checkWinner(board) !== null || !this.anyMovesLeft(board);
  }

  /** Validates a 4x4 board and returns its 16 cells row by row. */
  private flatten(board: Board): Cell[] {
    if (!Array.isArray(board) || board.length !== 4) {
      throw new Error('Invalid board: expected 4 rows');
    }
    if (board.some((row) => !Array.isArray(row) || row.length !== 4)) {
      throw new Error('Invalid board: each row must have 4 cells');
    }
    const cells = board.flat();
    const bad = cells.find((cell) => cell !== null && cell !== 'X' && cell !== 'O');
    if (bad !== undefined) {
      throw new Error(`Invalid board: unexpected cell value ${String(bad)}`);
    }
    return cells;
  }
}
