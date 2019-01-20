const originalSetTimeout = window.setTimeout;

export function tick(ms: number) {
  return new Promise((r) => {
    jasmine.clock().tick(ms);
    originalSetTimeout(r);
  });
}
