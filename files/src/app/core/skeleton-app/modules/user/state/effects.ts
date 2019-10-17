import {Injectable} from '@angular/core'
import {Actions, Effect, ofType} from '@ngrx/effects'
import {UserService} from '../services/user.service'
import {map, switchMap} from 'rxjs/operators'
import {ActionTypes, UserLoaded, UserRequest} from './actions'



@Injectable()
export  class UserEffect {

  @Effect({dispatch: true})  // {dispatch: false} - нуходит из эффектов
  runNav: Actions = this.actions$.pipe(
    ofType<UserRequest>(ActionTypes.UserRequest),
    switchMap(() => this.serviceUser.getUser()),
    map(value => new UserLoaded(value))
  )

  constructor (
    private actions$: Actions,  // слушаются с доларом
    private serviceUser: UserService,  // слушаются с доларом
  ) {}
}
