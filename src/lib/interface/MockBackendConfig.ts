export type UnclaimedRequestStrategy = 'PASS_THROUGH' | 'ERROR';

export interface MockBackendConfig {
  unclaimedRequests?: UnclaimedRequestStrategy;
}
