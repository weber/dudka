
import {Action} from '@ngrx/store'
import {UserModel} from '../user.state'

export enum ActionTypes {
  UserLoaded = 'UserLoaded',
  UserRequest = 'UserRequest',
}

export type ActionsTypes =
  UserLoaded |
  UserRequest

export class UserLoaded implements Action {
  readonly type = ActionTypes.UserLoaded

  constructor (public data: unknown) {
  }
}

export class UserRequest implements Action {
  readonly type = ActionTypes.UserRequest

}
