
import {createFeatureSelector} from '@ngrx/store'

// описание полей
export class UserModel {
  user: {
    name: string
    uid: string
    login: string
    canEdit: true
    sessionGuid: string
  }
}


export interface State {
  user: UserModel
}

// селекторы

export const UserSelector = createFeatureSelector<UserModel>('UserStore')


