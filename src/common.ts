/**
 * Represents the content of a cell.
 */
export enum CellStatus {
  EMPTY,
  SNAKE_PART,
  FOOD,
}

/**
 * Represents a position on the grid.
 */
export interface Position {
  row: number;
  column: number;
}

/**
 * Represents the snake's direction: up, down, right or left.
 */
export enum Direction {
  UP,
  DOWN,
  RIGHT,
  LEFT,
}

/**
 * A map of opposite directions.
 */
export const OPPOSITE_DIRECTIONS = {
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.RIGHT]: Direction.LEFT,
  [Direction.LEFT]: Direction.RIGHT,
};
