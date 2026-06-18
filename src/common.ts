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
  UP = 'up',
  DOWN = 'down',
  RIGHT = 'right',
  LEFT = 'left',
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

/**
 * Represents a cell: its status and optionally the placement of the snake that
 * is on it.
 */
export type Cell =
  | { status: CellStatus.EMPTY }
  | {
      status: CellStatus.SNAKE_PART;
      snakePlacement: SnakePlacement;
    }
  | { status: CellStatus.FOOD };

/**
 * Represents the placement of a snake's part.
 */
export type SnakePlacement =
  | {
      type: SnakePartType.HEAD;
      directions: Pick<Directions, 'from'>;
    }
  | {
      type: SnakePartType.THORAX;
      directions: Directions;
    }
  | {
      type: SnakePartType.TAIL;
      directions: Pick<Directions, 'to'>;
    };

/**
 * Represents the kind of snake part.
 */
export enum SnakePartType {
  HEAD,
  THORAX,
  TAIL,
}

/**
 * Represents the origin and direciton of a snake part.
 */
export interface Directions {
  from: Direction;
  to: Direction;
}
