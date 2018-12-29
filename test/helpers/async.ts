/**
 * Converts a promise-returning test to a format consumable by jasmine.
 */
export function async(cb: () => Promise<any>) {
  return (asyncCb: (err?: Error) => void) => {
    cb().then(() => asyncCb()).catch((e) => asyncCb(e));
  };
}
