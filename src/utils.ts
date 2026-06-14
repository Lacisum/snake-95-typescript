/**
 * Waits for `ms` milliseconds.
 *
 * @param ms the duration (in milliseconds) to sleep for
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns the loop-adjusted value of `n` within the given range.
 *
 * For exemple, if the `range` is [0, 10] and `n` is 12, the function will return
 * 2. If `n` is -3, it will return 7.
 *
 * @param n the current value
 * @param range the minimum (inclusive) and maximum (exclusive) values of the range
 * @returns the loop-adjusted value of `n` within the given range
 */
export function loop(n: number, range: [number, number]): number {
  if (range[0] > range[1]) {
    throw new Error('Range minimum must be less than range maximum');
  }
  const [min, max] = range;
  return n - (max - min) * (Math.floor((n - max) / (max - min)) + 1);
}

/**
 * Returns a random integer between `min` (inclusive) and `max` (exclusive).
 *
 * @param min the minimum value of the number to generate
 * @param max the maximum value of the number to generate
 * @returns a random number between `min` and `max`
 */
export function randomInt(min: number, max: number) {
  if (min > max) throw new Error('The minimum is greater than the maximum');
  return Math.floor(Math.random() * (max - min)) + min;
}
