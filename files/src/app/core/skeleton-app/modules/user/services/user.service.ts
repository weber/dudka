import { Injectable } from '@angular/core'
import {Observable} from 'rxjs'
import {UserModel} from '../user.state'
import {HttpClient} from '@angular/common/http'
import {map} from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor (
    private http: HttpClient,
  ) { }

  /**
   * Возвращает Информацию о пользователе
   * @return {Observable<UserModel>}
   */
  getUser (): Observable<UserModel> {
    return this.http.get(`${HOST_API}/webswitching/user/info`, {withCredentials: true})
      .pipe(
        map((value: any) => value['data'])
      )
  }
}
