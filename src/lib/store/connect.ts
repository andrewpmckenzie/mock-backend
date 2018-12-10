import {ComponentType} from 'react';
import {
  connect as connectComponent, ConnectedComponentClass, GetProps,
  MapDispatchToPropsFunction,
  MapStateToProps, Matching, Omit, Shared,
} from 'react-redux';
import {Dispatch} from 'redux';
import {MokdAction} from './actions';
import {MokdState} from './state';

export function connect<
    OwnProps,
    StateProps,
    DispatchProps,
    C extends ComponentType<Matching<StateProps & DispatchProps, GetProps<C>>>
>(
    component: C,
    stateToProps: MapStateToProps<StateProps, OwnProps, MokdState> = () => ({} as StateProps),
    dispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> &
                     ((dispatch: Dispatch<MokdAction>, ownProps: OwnProps) => DispatchProps)
                    = () => ({} as DispatchProps),
): ConnectedComponentClass<C, Omit<GetProps<C>, keyof Shared<StateProps & DispatchProps, GetProps<C>>>> {
  return connectComponent<StateProps, DispatchProps>(stateToProps, dispatchToProps)(component);
}
