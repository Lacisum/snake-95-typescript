/**
 * Waits for `ms` milliseconds.
 *
 * @param ms the duration (in milliseconds) to sleep for
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Increments the provided value, looping it to the minimum if it reaches the maximum.
 *
 * @param current the current value
 * @param range the minimum (inclusive) and maximum (exclusive) values of the range
 * @returns the loop-aware incremented value
 */
export function incrementWithLooping(
  current: number,
  range: [number, number],
): number {
  if (range[0] > range[1]) {
    throw new Error('Range minimum must be less than range maximum');
  }
  const [min, max] = range;
  let result: number;
  if (current + 1 >= max) result = min;
  else result = current + 1;
  return result;
}

/**
 * Decrements the provided value, looping it to the maximum if it reaches the minimum.
 *
 * @param current the current value
 * @param range the minimum (inclusive) and maximum (exclusive) values of the range
 * @returns the loop-aware decremented value
 */
export function decrementWithLooping(
  current: number,
  range: [number, number],
): number {
  if (range[0] > range[1]) {
    throw new Error('Range minimum must be less than range maximum');
  }
  const [min, max] = range;
  let result: number;
  if (current - 1 < min) result = max - 1;
  else result = current - 1;
  return result;
}
