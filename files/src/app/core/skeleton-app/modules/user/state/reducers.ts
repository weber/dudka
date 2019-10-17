import {ActionReducerMap, MetaReducer} from '@ngrx/store'
import {State, UserModel} from '../user.state'
import {ActionsTypes, ActionTypes} from './actions'



export const metaReducers: MetaReducer<State>[] =  []

export function UserReducer (state: UserModel | null = null, action: ActionsTypes): UserModel | null {
  switch (action.type) {
    case ActionTypes.UserLoaded: {
      return action['data'] as UserModel
    }
    default:
      return state
  }
}


export const reducers: ActionReducerMap<State> = {
  user: UserReducer
}



