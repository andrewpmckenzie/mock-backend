import {ConfigActions} from './config';
import {RequestActions} from './request';

export * from './config';
export * from './request';

export type MockBackendAction = RequestActions | ConfigActions;
