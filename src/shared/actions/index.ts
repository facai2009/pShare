import CounterActions from './counter'
import StoreActions from './store'
import { ActionType } from 'typesafe-actions';
import AppActions from './app';
import UserActions from './user';


const RootActions = { ...CounterActions, ...StoreActions, ...AppActions, ...UserActions }

type RootActions = ActionType<typeof RootActions>

export default RootActions