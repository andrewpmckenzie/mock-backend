/**
 * Promise wrapper for an XHR request.
 */
export function xhr(url: string, {method = 'GET', body = ''} = {}): Promise<XMLHttpRequest> {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.addEventListener('load', () => resolve(request));
    request.open(method, url);
    request.send(body);
  });
}
