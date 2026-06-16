import './style.css';
import { Game } from './game';
import { Displayer } from './displayer';
import { sleep } from './utils';
import { Direction } from './common';

const TICK_DURATION = 200;

const displayer = new Displayer(Game.GRID_NB_ROWS, Game.GRID_NB_COLUMNS);

displayer.askPlay(() => play(displayer));

async function play(displayer: Displayer): Promise<void> {
  const game = new Game();
  document.addEventListener('keydown', function (event: KeyboardEvent) {
    if (event.repeat) return;
    switch (event.key) {
      case 'ArrowUp':
        game.enqueueSnakeDirection(Direction.UP);
        break;
      case 'ArrowDown':
        game.enqueueSnakeDirection(Direction.DOWN);
        break;
      case 'ArrowRight':
        game.enqueueSnakeDirection(Direction.RIGHT);
        break;
      case 'ArrowLeft':
        game.enqueueSnakeDirection(Direction.LEFT);
        break;
    }
  });

  // Start the game
  displayer.draw(game.cellsStatuses, game.isOver);
  while (!game.isOver) {
    await sleep(TICK_DURATION);
    game.tick();
    displayer.draw(game.cellsStatuses, game.isOver);
  }

  displayer.askRetry(() => play(displayer));
}
