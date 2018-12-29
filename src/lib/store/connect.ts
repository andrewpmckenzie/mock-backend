import {ComponentType} from 'react';
import {
  connect as connectComponent, ConnectedComponentClass, GetProps,
  MapDispatchToPropsFunction,
  MapStateToProps, Matching, Omit, Shared,
} from 'react-redux';
import {Dispatch} from 'redux';
import {MockBackendAction} from './actions';
import {MockBackendState} from './state';

export function connect<
    OwnProps,
    StateProps,
    DispatchProps,
    C extends ComponentType<Matching<StateProps & DispatchProps, GetProps<C>>>
>(
    component: C,
    stateToProps: MapStateToProps<StateProps, OwnProps, MockBackendState> = () => ({} as StateProps),
    dispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> &
                     ((dispatch: Dispatch<MockBackendAction>, ownProps: OwnProps) => DispatchProps)
                    = () => ({} as DispatchProps),
): ConnectedComponentClass<C, Omit<GetProps<C>, keyof Shared<StateProps & DispatchProps, GetProps<C>>>> {
  return connectComponent<StateProps, DispatchProps>(stateToProps, dispatchToProps)(component);
}
