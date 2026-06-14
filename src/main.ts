import './style.css';
import { Game } from './game';
import { Displayer } from './displayer';
import { sleep } from './utils';
import { Direction } from './common';

const TICK_DURATION = 200;

// Initialize
const game = new Game();
const displayer = new Displayer(Game.GRID_NB_ROWS, Game.GRID_NB_COLUMNS);
document.addEventListener('keyup', function (event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
      game.pushSnakeDirection(Direction.UP);
      break;
    case 'ArrowDown':
      game.pushSnakeDirection(Direction.DOWN);
      break;
    case 'ArrowRight':
      game.pushSnakeDirection(Direction.RIGHT);
      break;
    case 'ArrowLeft':
      game.pushSnakeDirection(Direction.LEFT);
      break;
  }
});

// Start the game
displayer.draw(game.snakeHeadPosition);
await sleep(TICK_DURATION);
while (true) {
  game.tick();
  displayer.draw(game.snakeHeadPosition);
  await sleep(TICK_DURATION);
}
