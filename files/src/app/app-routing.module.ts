import {Injectable, InjectionToken, NgModule} from '@angular/core'
import {Routes, RouterModule, ActivatedRouteSnapshot} from '@angular/router'



import { IndexComponent } from '@pages/index/index.component'
import {NotFoundComponent} from '@pages/not-found.component'



Injectable()
export const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver')
export const deactivateGuard = new InjectionToken('deactivateGuard')


// Роутинг формируется динамическе на основе выше определенной карты навигации
export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    data: {
      title: 'Главная',
      faIconName: 'fa-edit',
      faIconColor: '#ffe764',
      placeholder: '',
      hasMain: false,
      visible: true,
      isLinkNative: false,
    }
  },
  {
    path: 'externalLink',
    canActivate: [externalUrlProvider],
    component: NotFoundComponent,
    data: {
      title: 'Справка',
      link: `/webswitching/help/by-id?helpId=SWITCHING_LOGBOOK`,
      faIconName: 'fa-question-circle',
      faIconColor: '#fff',
      placeholder: '',
      hasMain: false,
      visible: true,
      isLinkNative: true,
      isDinamic: true,
      targetLink: '_blank',
    }
  },
  {
    path: '**',
    redirectTo: '/',
    data: {
      title: '404',
      faIconName: '',
      faIconColor: '#fff',
      placeholder: '',
      hasMain: false,
      visible: false,
      isLinkNative: false,
      isDinamic: false,
      targetLink: '_blank',
    }
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [
    {
      provide: externalUrlProvider,
      useValue: (routes: ActivatedRouteSnapshot): void => {
        const externalUrl = routes.paramMap.get('externalUrl')
        window.open(externalUrl, '_blank')
      }
    },
    {
      provide: deactivateGuard,
      useValue: (): boolean => {
        return false
      }
    }
  ]
})
export class AppRoutingModule { }
