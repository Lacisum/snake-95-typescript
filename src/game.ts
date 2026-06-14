import { type Position, Direction, OPPOSITE_DIRECTIONS } from './common';

import * as Utils from './utils';

export class Game {
  static readonly GRID_NB_COLUMNS = 20;
  static readonly GRID_NB_ROWS = 15;

  readonly #snakeHead: SnakeHead;
  readonly #snakeDirectionQueue: Direction[];
  readonly #grid: ReadonlyArray<Array<Cell>>;

  /**
   * Initializes the snake, the snake's direction queue and the grid.
   */
  constructor() {
    this.#snakeHead = new SnakeHead();
    this.#snakeDirectionQueue = [];

    // Initialize the grid
    const grid: Cell[][] = [];
    for (let rowNb = 0; rowNb < Game.GRID_NB_ROWS; rowNb++) {
      const row: Cell[] = [];
      grid.push(row);
      for (let columnNb = 0; columnNb < Game.GRID_NB_COLUMNS; columnNb++) {
        grid[rowNb].push({
          status: CellStatus.EMPTY,
        });
      }
    }
    grid[this.#snakeHead.position.row][this.#snakeHead.position.column] = {
      status: CellStatus.SNAKE_HEAD,
      snakeHead: this.#snakeHead,
    };
    this.#grid = grid;
  }

  static get COLUMN_RANGE(): [number, number] {
    return [0, this.GRID_NB_COLUMNS];
  }

  static get ROW_RANGE(): [number, number] {
    return [0, this.GRID_NB_ROWS];
  }

  /** Returns the snake's head position. */
  get snakeHeadPosition() {
    return this.#snakeHead.position;
  }

  /**
   * Moves the snake's head to the provided `newPosition`, replacing its current
   * position with an empty cell.
   */
  set #snakeHeadPosition(newPosition: Position) {
    const snakeHeadCell =
      this.#grid[this.#snakeHead.position.row][this.#snakeHead.position.column];
    if (snakeHeadCell.status !== CellStatus.SNAKE_HEAD) {
      throw new Error(
        `Cell at row ${this.#snakeHead.position.row} column ${this.#snakeHead.position.column} should contain the snake's head but it does not`,
      );
    }
    this.#grid[this.#snakeHead.position.row][this.#snakeHead.position.column] =
      {
        status: CellStatus.EMPTY,
      };
    this.#grid[newPosition.row][newPosition.column] = snakeHeadCell;
    this.#snakeHead.position = newPosition;
  }

  /**
   * Makes the game tick.
   */
  tick() {
    this.#updateSnakeDirection();
    this.#updateSnakePosition();
  }

  /**
   * Pushes the provided direction in the direction queue.
   *
   * @param snakeDirection the direction to push on the direction queue
   */
  pushSnakeDirection(snakeDirection: Direction) {
    if (
      (this.#snakeDirectionQueue.length &&
        snakeDirection !== OPPOSITE_DIRECTIONS[this.#snakeDirectionQueue[0]]) ||
      snakeDirection !== OPPOSITE_DIRECTIONS[this.#snakeHead.direction]
    )
      this.#snakeDirectionQueue.push(snakeDirection);
  }

  #updateSnakeDirection() {
    this.#snakeHead.direction =
      this.#snakeDirectionQueue.shift() ?? this.#snakeHead.direction;
  }

  /**
   * Moves the snake's head one cell in the direction it is headed to.
   */
  #updateSnakePosition() {
    switch (this.#snakeHead.direction) {
      case Direction.RIGHT:
        this.#snakeHeadPosition = {
          row: this.#snakeHead.position.row,
          column: Utils.incrementWithLooping(
            this.#snakeHead.position.column,
            Game.COLUMN_RANGE,
          ),
        };
        break;
      case Direction.LEFT:
        this.#snakeHeadPosition = {
          row: this.#snakeHead.position.row,
          column: Utils.decrementWithLooping(
            this.#snakeHead.position.column,
            Game.COLUMN_RANGE,
          ),
        };
        break;
      case Direction.UP:
        this.#snakeHeadPosition = {
          row: Utils.decrementWithLooping(
            this.#snakeHead.position.row,
            Game.ROW_RANGE,
          ),
          column: this.#snakeHead.position.column,
        };
        break;
      case Direction.DOWN:
        this.#snakeHeadPosition = {
          row: Utils.incrementWithLooping(
            this.#snakeHead.position.row,
            Game.ROW_RANGE,
          ),
          column: this.#snakeHead.position.column,
        };
        break;
      default:
        throw new Error('SnakeDirection not implemented');
    }
  }
}

class SnakeHead {
  direction: Direction;
  position: Position;

  constructor() {
    this.direction = Direction.RIGHT;
    this.position = {
      row: Math.floor(Game.GRID_NB_ROWS / 2),
      column: Math.floor(Game.GRID_NB_COLUMNS / 2),
    };
  }
}

class SnakeBody {}

enum CellStatus {
  EMPTY,
  SNAKE_HEAD,
  SNAKE_BODY,
}

type Cell =
  | { status: CellStatus.EMPTY }
  | { status: CellStatus.SNAKE_HEAD; snakeHead: SnakeHead }
  | { status: CellStatus.SNAKE_BODY; snakeBody: SnakeBody };
