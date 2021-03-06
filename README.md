# Mock Backend

A simple framework for intercepting `fetch()` and `XMLHttpRequest` requests, and generating
responses from within the client.

## Usage

```html
  <script src="https://unpkg.com/mock-backend"></script>
  <script>
    mockBackend([
      {
        claim: (r) => r.url === '/foo', 
        handle: (r) => ({ status: 200, body: { hello: 'world' } }) 
      },
      {
        claim: (r) => r.url === '/bar', 
        handle: (r) => r.urlParts.query.get('secret') === 'letMeIn' ?
            ({ status: 200, body: { secret: 'treasure' } }) :
            ({ status: 403, body: 'You do not have access to /bar' }) 
      },
    ], {
      defaultConfig: {
        // How requests that don't match a handler are treated (default: 'ERROR')
        unclaimedRequests: 'ERROR' /* or 'PASS_THROUGH' */

        // Time to wait (ms) before sending a response {default: 5000}
        delayBeforeResponding: 2500,
      }
    })
  </script>

  <!-- ... your app html ... --> 
```

## API

 - [Request object](src/lib/interface/Request.ts)
 - [Response object](src/lib/interface/Response.ts)
 - [defaultConfig options](src/lib/interface/MockBackendConfig.ts)

## Try it out

 - [Hello world](https://stackblitz.com/edit/mock-backend-hw?embed=1&file=index.html)
 - [Example blog](https://stackblitz.com/edit/mock-backend-blog?embed=1&file=index.html)
