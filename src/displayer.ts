import { CellStatus } from './common';

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
   * @param cellsStatuses the grid's cells statuses
   */
  draw(cellsStatuses: ReadonlyArray<ReadonlyArray<CellStatus>>): void {
    for (let i = 0; i < cellsStatuses.length; i++) {
      for (let j = 0; j < cellsStatuses[0].length; j++) {
        const cellStatus = cellsStatuses[i][j];
        const htmlCell = this.#htmlGrid[i][j];
        switch (cellStatus) {
          case CellStatus.EMPTY:
            htmlCell.classList = 'cell';
            break;
          case CellStatus.SNAKE_PART:
            htmlCell.classList = 'cell snake-part';
            break;
          case CellStatus.FOOD:
            htmlCell.classList = 'cell food';
            break;
        }
      }
    }
  }

  /**
   * Creates an HTML element cell.
   *
   * @returns an HTML element cell
   */
  static #createCell(): HTMLDivElement {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    return cell;
  }
}
