import {
  type Cell,
  CellStatus,
  type Position,
  Direction,
  OPPOSITE_DIRECTIONS,
  SnakePartType,
} from './common';

import * as Utils from './utils';

export class Game {
  static readonly GRID_NB_COLUMNS = 20;
  static readonly GRID_NB_ROWS = 15;
  static readonly SNAKE_INITIAL_LENGTH = 3;

  #isOver: boolean;
  #score: number;
  readonly #snake: Snake;
  readonly #snakeDirectionQueue: Direction[];
  readonly #grid: ReadonlyArray<Array<Cell>>;

  static get COLUMN_RANGE(): [number, number] {
    return [0, this.GRID_NB_COLUMNS];
  }

  static get ROW_RANGE(): [number, number] {
    return [0, this.GRID_NB_ROWS];
  }

  /**
   * Initializes the snake, the snake's direction queue, and the grid.
   */
  constructor() {
    this.#isOver = false;

    this.#score = 0;

    this.#snake = new Snake(this.#initialSnakePartsPositions());

    this.#snakeDirectionQueue = [];

    // Initialize the grid
    const grid: Cell[][] = [];
    for (let rowNb = 0; rowNb < Game.GRID_NB_ROWS; rowNb++) {
      const row: Cell[] = [];
      for (let columnNb = 0; columnNb < Game.GRID_NB_COLUMNS; columnNb++) {
        row.push({
          status: CellStatus.EMPTY,
        });
      }
      grid.push(row);
    }
    this.#snake.parts.forEach((snakePart, index) => {
      grid[snakePart.position.row][snakePart.position.column] = {
        status: CellStatus.SNAKE_PART,
        snakePlacement: (() => {
          if (index === 0)
            return {
              type: SnakePartType.HEAD,
              directions: {
                from: Direction.LEFT,
              },
            };
          else if (index === this.#snake.parts.length - 1)
            return {
              type: SnakePartType.TAIL,
              directions: {
                to: Direction.RIGHT,
              },
            };
          else
            return {
              type: SnakePartType.THORAX,
              directions: {
                from: Direction.LEFT,
                to: Direction.RIGHT,
              },
            };
        })(),
      };
    });
    this.#grid = grid;
    this.#placeFoodOnRandomEmptyCell();
  }

  get isOver() {
    return this.#isOver;
  }

  get score() {
    return this.#score;
  }

  /** Returns the grid's cells. */
  get cells(): ReadonlyArray<ReadonlyArray<Cell>> {
    return this.#grid;
  }

  /**
   * If the provided position is not opposite of the next direction of the
   * snake, enqueues the provided direction in the direction queue.
   *
   * If it is opposite of the next direction of the snake, does nothing.
   *
   * @param snakeDirection the direction to enqueue
   */
  enqueueSnakeDirection(snakeDirection: Direction): void {
    const nextDirection = this.#snakeDirectionQueue.length
      ? this.#snakeDirectionQueue[0]
      : this.#snake.direction;
    if (snakeDirection !== OPPOSITE_DIRECTIONS[nextDirection])
      this.#snakeDirectionQueue.unshift(snakeDirection);
  }

  /**
   * Makes the game tick.
   */
  tick(): void {
    this.#updateSnakeDirection();
    this.#updateSnakePosition();
  }

  /**
   * If the direction queue is not empty, takes the first direction in it and
   * makes it the next direction of the snake.
   *
   * If the direction queue is empty, does nothing.
   */
  #updateSnakeDirection(): void {
    this.#snake.direction =
      this.#snakeDirectionQueue.pop() ?? this.#snake.direction;
  }

  /**
   * Moves the snake, i.e. adds a new head in the direction the snake is headed
   * towards and removes the tail.
   */
  #updateSnakePosition(): void {
    const nextHeadPosition = this.#getSnakeNextHeadPosition();
    if (
      this.#grid[nextHeadPosition.row][nextHeadPosition.column].status ===
      CellStatus.SNAKE_PART
    ) {
      this.#isOver = true;
      return;
    }
    if (
      this.#grid[nextHeadPosition.row][nextHeadPosition.column].status ===
      CellStatus.FOOD
    ) {
      this.#score++;
      this.#placeFoodOnRandomEmptyCell();
    } else {
      this.#removeSnakeTail();
    }
    this.#addSnakeHeadAt(nextHeadPosition);
  }

  /**
   * Removes the snake's tail.
   */
  #removeSnakeTail(): void {
    this.#grid[this.#snake.tailPosition.row][this.#snake.tailPosition.column] =
      {
        status: CellStatus.EMPTY,
      };
    this.#snake.removeTail();

    this.#updateNewTailPlacement();
  }

  /**
   * Updates the placement of the new tail (formerly a part of the thorax).
   */
  #updateNewTailPlacement() {
    const { row: tailRow, column: tailColumn } = this.#snake.tailPosition;
    const newTailCell = this.#grid[tailRow][tailColumn];
    if (newTailCell.status !== CellStatus.SNAKE_PART)
      throw new Error('Cell should be a snake part');
    if (newTailCell.snakePlacement.type !== SnakePartType.THORAX)
      throw new Error('Cell should be a thorax');
    const tailTo = newTailCell.snakePlacement.directions.to;
    newTailCell.snakePlacement = {
      type: SnakePartType.TAIL,
      directions: {
        to: tailTo,
      },
    };
  }

  /**
   * Returns the snake's next head position, which depends on its direction.
   *
   * Opposite sides of the grid are connected.
   *
   * @returns the snake's next head position
   */
  #getSnakeNextHeadPosition(): Position {
    let nextHeadPosition: Position;
    switch (this.#snake.direction) {
      case Direction.RIGHT:
        nextHeadPosition = {
          row: this.#snake.headPosition.row,
          column: Utils.loop(
            this.#snake.headPosition.column + 1,
            Game.COLUMN_RANGE,
          ),
        };
        break;
      case Direction.LEFT:
        nextHeadPosition = {
          row: this.#snake.headPosition.row,
          column: Utils.loop(
            this.#snake.headPosition.column - 1,
            Game.COLUMN_RANGE,
          ),
        };
        break;
      case Direction.UP:
        nextHeadPosition = {
          row: Utils.loop(this.#snake.headPosition.row - 1, Game.ROW_RANGE),
          column: this.#snake.headPosition.column,
        };
        break;
      case Direction.DOWN:
        nextHeadPosition = {
          row: Utils.loop(this.#snake.headPosition.row + 1, Game.ROW_RANGE),
          column: this.#snake.headPosition.column,
        };
        break;
      default:
        throw new Error('SnakeDirection not implemented');
    }
    return nextHeadPosition;
  }

  /**
   * Updates the placement of the former head (now a part of the thorax).
   */
  #updateOldHeadPlacement(): void {
    const { row: headRow, column: headColumn } = this.#snake.headPosition;
    const headCell = this.#grid[headRow][headColumn];
    if (headCell.status !== CellStatus.SNAKE_PART)
      throw new Error('Cell should be a snake part');
    if (headCell.snakePlacement.type !== SnakePartType.HEAD)
      throw new Error('Cell should be a head');
    const headFrom = headCell.snakePlacement.directions.from;
    headCell.snakePlacement = {
      type: SnakePartType.THORAX,
      directions: {
        from: headFrom,
        to: this.#snake.direction,
      },
    };
  }

  /**
   * Adds the snake's new head at the provided position.
   *
   * @param nextHeadPosition the position where to add the snake's new head
   */
  #addSnakeHeadAt(nextHeadPosition: Position): void {
    this.#updateOldHeadPlacement();

    const newHead = new SnakePart(nextHeadPosition);
    this.#grid[nextHeadPosition.row][nextHeadPosition.column] = {
      status: CellStatus.SNAKE_PART,
      snakePlacement: {
        type: SnakePartType.HEAD,
        directions: {
          from: OPPOSITE_DIRECTIONS[this.#snake.direction],
        },
      },
    };
    this.#snake.addHead(newHead);
  }

  /**
   * Sets a random empty cell in the "food" state.
   */
  #placeFoodOnRandomEmptyCell(): void {
    const emptyPositions: Position[] = [];
    for (let row = 0; row < this.#grid.length; row++) {
      for (let column = 0; column < this.#grid[0].length; column++) {
        if (this.#grid[row][column].status === CellStatus.EMPTY)
          emptyPositions.push({ row, column });
      }
    }
    const randomEmptyPosition =
      emptyPositions[Utils.randomInt(0, emptyPositions.length)];
    this.#grid[randomEmptyPosition.row][randomEmptyPosition.column] = {
      status: CellStatus.FOOD,
    };
  }

  /**
   * Returns the initial positions of the snake's parts.
   *
   * @returns the initial positions of the snake's parts
   */
  #initialSnakePartsPositions(): Position[] {
    const positions: Position[] = [];
    const row = Math.floor(Game.GRID_NB_ROWS / 2);
    const column = Math.floor(Game.GRID_NB_COLUMNS / 2);
    for (let i = 0; i < Game.SNAKE_INITIAL_LENGTH; i++) {
      positions.push({
        row: row,
        column: Utils.loop(column - i, Game.COLUMN_RANGE),
      });
    }
    return positions;
  }
}

class Snake {
  direction: Direction;
  /**
   * The differents parts of the snake.
   *
   * The first item is the head, the last is the tail.
   */
  readonly parts: SnakePart[];

  /**
   * Builds a snake.
   *
   * @param positions the initial positions of the snake's parts
   */
  constructor(positions: Position[]) {
    this.direction = Direction.RIGHT;
    const length = positions.length;
    if (length < 1) {
      throw new Error('Cannot build a snake of negative length');
    }
    this.parts = [];
    for (const position of positions) {
      this.parts.push(new SnakePart(position));
    }
  }

  /**
   * The number of parts of the snake.
   */
  get length(): number {
    return this.parts.length;
  }

  /**
   * The head's position.
   */
  get headPosition(): Position {
    return this.parts[0].position;
  }

  /**
   * The tail's position.
   */
  get tailPosition(): Position {
    return this.parts[this.length - 1].position;
  }

  /**
   * Adds a new head to the snake.
   *
   * @param head the new head to add
   */
  addHead(head: SnakePart): void {
    this.parts.unshift(head);
  }

  /**
   * Removes the snake's last part.
   */
  removeTail(): void {
    this.parts.pop();
  }
}

class SnakePart {
  position: Position;

  constructor(position: Position) {
    this.position = position;
  }
}
