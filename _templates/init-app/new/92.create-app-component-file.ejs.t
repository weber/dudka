---
to: <%=name%>/src/app/app.component.ts
---
import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core'

import AppVersion from '../version.json'
import {SkeletonNavigationModel} from '@core/skeleton-app/components/skeleton/skeleton.model'
import {routes} from './app-routing.module'
import {select, Store} from '@ngrx/store'
import {State, UserModel, UserSelector} from '@core/skeleton-app/modules/user/user.state'
import {UserRequest} from '@core/skeleton-app/modules/user/state/actions'
import {filter} from 'rxjs/operators'
import {Observable, Subject} from 'rxjs'
import {ToastitService, IToastit, ToastitType, ToastitAlign, ToastitAnimation} from 'ngx-toastit'
import {SkeletonService} from '@core/skeleton-app/services/skeleton.service'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit {

  version: string
  nameApp: string = '<%=title%>'
  // массив объектов главного меню
  navigationList: SkeletonNavigationModel[]
  logoImg: string = 'favicon.ico'
  // информация о пользователе
  user$: Observable<UserModel>
  nameUser$: Subject<string>


  constructor (
    private $store: Store<State>,
    private toastitService: ToastitService,
    private SkeletonService: SkeletonService
  ) {
    this.navigationList = routes as SkeletonNavigationModel[]
    this.version = AppVersion.version
    this.nameUser$ = new Subject()

    console.log(`%c ${this.nameApp} ${this.version}`, `background: #35547b; color: #fff; padding: 3px 5px;`)
  }

 /**
  * OnInit
  */
  ngOnInit (): void {
    this.user$ = this.$store
      .pipe(select(UserSelector))

    this.$store
      .dispatch(new UserRequest())

    // Возвращаем имя ткущего пользователя
    this.user$
      .pipe(filter(value => value['user'] !== null))
      .subscribe(userData => {
        this.nameUser$.next(userData['user']['name'])
        this.SkeletonService.setUserNameApp(userData['user']['name'])
      })

  }
}
