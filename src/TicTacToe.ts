export type Player = 'X' | 'O';
export type Result = Player | 'Draw';
export type Cell = Player | null;
export type Board = Cell[][];

const SIZE = 4;
const LAST = SIZE - 1;
const INDEXES = Array.from({ length: SIZE }, (_, i) => i);
const INTERIOR = INDEXES.slice(1, -1); // every index except the border rows/columns

export class TicTacToe {
  /**
   * Returns the winning player, or null if nobody has won.
   * Returns 'Draw' if both players have a winning pattern, or if the board is
   * full with no winner. Returns null while the game is still in progress.
   * Throws if the board is malformed.
   */
  public checkWinner(board: Board): Result | null {
    this.validate(board);

    const xWins = this.hasWon(board, 'X');
    const oWins = this.hasWon(board, 'O');

    if (xWins && oWins) {
      return 'Draw';
    }
    if (xWins) {
      return 'X';
    }
    if (oWins) {
      return 'O';
    }
    return this.anyMovesLeft(board) ? null : 'Draw';
  }

  /** True if at least one cell is empty. */
  public anyMovesLeft(board: Board): boolean {
    this.validate(board);
    return board.some((row) => row.includes(null));
  }

  /** The game ends when someone has won or the board is full. */
  public isGameOver(board: Board): boolean {
    return this.checkWinner(board) !== null || !this.anyMovesLeft(board);
  }

  /** True if the player satisfies any of the five win conditions. */
  private hasWon(board: Board, p: Player): boolean {
    const horizontal = board.some((row) => row.every((cell) => cell === p));

    const vertical = INDEXES.some((c) => board.every((row) => row[c] === p));

    const diagonal =
      INDEXES.every((i) => board[i][i] === p) ||
      INDEXES.every((i) => board[i][LAST - i] === p);

    const corners =
      board[0][0] === p &&
      board[0][LAST] === p &&
      board[LAST][0] === p &&
      board[LAST][LAST] === p;

    return horizontal || vertical || diagonal || corners || this.hasBox(board, p);
  }

  /** True if the player owns a full 2x2 square anywhere on the board. */
  private hasBox(board: Board, p: Player): boolean {
    // Every 2x2 square contains at least one non-border cell, so only squares
    // touching an interior cell the player owns need checking. An interior cell
    // always has room on all sides, so its four squares are always on the board.
    for (const row of INTERIOR) {
      for (const col of INTERIOR) {
        if (board[row][col] !== p) {
          continue;
        }
        // The four squares that include this interior cell, by top-left corner
        const corners = [[row - 1, col - 1], [row - 1, col], [row, col - 1], [row, col]];
        if (corners.some(([r, c]) => this.isBoxOwnedBy(board, p, r, c))) {
          return true;
        }
      }
    }
    return false;
  }

  /** True if the 2x2 square with top-left cell (row, col) belongs entirely to the player. */
  private isBoxOwnedBy(board: Board, p: Player, row: number, col: number): boolean {
    return (
      board[row][col] === p &&
      board[row][col + 1] === p &&
      board[row + 1][col] === p &&
      board[row + 1][col + 1] === p
    );
  }

  private validate(board: Board): void {
    if (!Array.isArray(board) || board.length !== SIZE) {
      throw new Error(`Invalid board: expected ${SIZE} rows`);
    }
    if (board.some((row) => !Array.isArray(row) || row.length !== SIZE)) {
      throw new Error(`Invalid board: each row must have ${SIZE} cells`);
    }
    const bad = board.flat().find((cell) => cell !== null && cell !== 'X' && cell !== 'O');
    if (bad !== undefined) {
      throw new Error(`Invalid board: unexpected cell value ${String(bad)}`);
    }
  }
}
