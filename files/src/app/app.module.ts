import {BrowserModule, EVENT_MANAGER_PLUGINS} from '@angular/platform-browser'
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core'
import {GlobalService} from '@services/global.service'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import {AppLocalizeModule} from '@core/app.localize.module'
import {ExternalUrlDirective} from '@core/external-url.directive'
import { StoreModule } from '@ngrx/store'
import {EffectsModule} from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common'
import 'hammerjs'
import {ErrorInterceptor} from '@app/intercept/interceptHttp'
import { VueEventModifiersPlugin } from '@core/vue-event-modifiers/vue-event-modifiers.plugin'
import {SkeletonAppModule} from '@core/skeleton-app/skeleton-app.module'

// PAGE
import { IndexComponent } from '@pages/index/index.component'
import {NotFoundComponent} from '@pages/not-found.component'
import {ToastitModule} from 'ngx-toastit'
// END PAGE

// COMPONENTS

// END COMPONENTS

@NgModule({
  declarations: [
    AppComponent,
    ExternalUrlDirective,
    // pages
    IndexComponent,
    NotFoundComponent,


  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLocalizeModule,
    HttpClientModule,
    SkeletonAppModule,
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    CommonModule,
    ToastitModule
  ],
  bootstrap: [AppComponent],
  providers: [
    GlobalService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: VueEventModifiersPlugin,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})

export class AppModule {
}
