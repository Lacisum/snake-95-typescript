import { type Position } from './common';

/**
 * An object that handles the display.
 */
export class Displayer {
  /** A bidimensional array containg all HTML elements cells */
  readonly #htmlGrid: ReadonlyArray<ReadonlyArray<HTMLDivElement>>;

  /**
   * Initializes the DOM grid
   */
  constructor(gridNbRows: number, gridNbColumns: number) {
    const htmlGrid = [];
    for (let rowNb = 0; rowNb < gridNbRows; rowNb++) {
      const row: HTMLDivElement[] = [];
      for (let columnNb = 0; columnNb < gridNbColumns; columnNb++) {
        row.push(Displayer.#createCell());
      }
      htmlGrid.push(row);
    }
    this.#htmlGrid = htmlGrid;

    const app = document.querySelector<HTMLDivElement>('#app')!;
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    gridContainer.style.gridTemplateRows = `repeat(${gridNbRows}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${gridNbColumns}, 1fr)`;
    app.appendChild(gridContainer);
    for (const row of this.#htmlGrid) {
      for (const cell of row) {
        gridContainer.appendChild(cell);
      }
    }
  }

  /**
   * Does a draw call.
   *
   * @param snakeHeadPosition the snake's head position
   */
  draw(snakeHeadPosition: Position) {
    // Reset cells
    for (const row of this.#htmlGrid) {
      for (const cell of row) {
        cell.classList = 'cell';
      }
    }
    // Draw snake's head cell
    const snakeHeadCell =
      this.#htmlGrid[snakeHeadPosition.row][snakeHeadPosition.column];
    snakeHeadCell.classList.add('snake-head');
  }

  /**
   * Creates an HTML element cell.
   *
   * @returns an HTML element cell
   */
  static #createCell() {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    return cell;
  }
}
