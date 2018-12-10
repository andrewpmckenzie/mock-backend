export interface Handler {
  claim: (request: Request) => boolean;
  handle: (request: Request) => Promise<Response>|Response;
}
