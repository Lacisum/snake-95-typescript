import { CellStatus } from './common';

/**
 * An object that handles the display.
 */
export class Displayer {
  readonly #score: HTMLElement;
  readonly #gridContainer: HTMLElement;
  /** A bidimensional array containg all HTML elements cells */
  readonly #grid: ReadonlyArray<ReadonlyArray<HTMLElement>>;

  /**
   * Initializes the DOM grid
   */
  constructor(gridNbRows: number, gridNbColumns: number) {
    const grid = [];
    for (let rowNb = 0; rowNb < gridNbRows; rowNb++) {
      const row: HTMLElement[] = [];
      for (let columnNb = 0; columnNb < gridNbColumns; columnNb++) {
        row.push(Displayer.#createCell());
      }
      grid.push(row);
    }
    this.#grid = grid;

    this.#gridContainer =
      document.querySelector<HTMLElement>('.grid-container')!;
    this.#gridContainer.style.gridTemplateRows = `repeat(${gridNbRows}, 1fr)`;
    this.#gridContainer.style.gridTemplateColumns = `repeat(${gridNbColumns}, 1fr)`;
    for (const row of this.#grid) {
      for (const cell of row) {
        this.#gridContainer.appendChild(cell);
      }
    }

    this.#score = document.querySelector<HTMLElement>('.score')!;
  }

  /**
   * Displays a "Play" button that, when clicked, will start the game.
   *
   * @param startNewGame a function that starts a new game
   */
  askPlay(startNewGame: () => void): void {
    const popUp = document.createElement('div');
    popUp.classList = 'popup';

    const playButton = document.createElement('button');
    playButton.classList = 'play-button';
    playButton.innerText = 'Play';
    const closePopUp = () => this.#gridContainer.removeChild(popUp);
    playButton.addEventListener('click', () => {
      closePopUp();
      startNewGame();
    });
    popUp.append(playButton);

    this.#gridContainer.appendChild(popUp);
  }

  /**
   * Displays a "Game over" text and a "Retry" button that, when clicked, will
   * restart the game.
   *
   * @param startNewGame a function that starts a new game
   */
  askRetry(startNewGame: () => void): void {
    const popUp = document.createElement('div');
    popUp.classList = 'popup';

    const gameOverBlock = document.createElement('div');
    gameOverBlock.classList = 'game-over';
    gameOverBlock.innerText = 'Game Over';
    popUp.appendChild(gameOverBlock);

    const retryButton = document.createElement('button');
    retryButton.classList = 'play-button';
    retryButton.innerText = 'Retry';
    const closePopUp = () => this.#gridContainer.removeChild(popUp);
    retryButton.addEventListener('click', () => {
      closePopUp();
      startNewGame();
    });
    popUp.append(retryButton);

    this.#gridContainer.appendChild(popUp);
  }

  /**
   * Does a draw call.
   *
   * @param cellsStatuses the grid's cells statuses
   * @param gameIsOver whether the game is lost
   * @param score the current score
   */
  draw(
    cellsStatuses: ReadonlyArray<ReadonlyArray<CellStatus>>,
    gameIsOver: boolean,
    score: number,
  ): void {
    for (let i = 0; i < cellsStatuses.length; i++) {
      for (let j = 0; j < cellsStatuses[0].length; j++) {
        const cellStatus = cellsStatuses[i][j];
        const htmlCell = this.#grid[i][j];
        switch (cellStatus) {
          case CellStatus.EMPTY:
            htmlCell.classList = 'cell';
            break;
          case CellStatus.SNAKE_PART:
            htmlCell.classList = `cell snake-part ${gameIsOver ? 'dead' : ''}`;
            break;
          case CellStatus.FOOD:
            htmlCell.classList = 'cell food';
            break;
        }
      }
    }
    this.#score.innerHTML = String(score);
  }

  /**
   * Creates an HTML element cell.
   *
   * @returns an HTML element cell
   */
  static #createCell(): HTMLElement {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    return cell;
  }
}
