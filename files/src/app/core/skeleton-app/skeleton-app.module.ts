import { NgModule } from '@angular/core'

import {UserModule} from './modules/user/user.module'
import { ContentComponent } from './components/content/content.component'
import { SkeletonComponent } from './components/skeleton/skeleton.component'
import { DxScrollViewModule, DxButtonModule  } from 'devextreme-angular'
import {AppRoutingModule} from '@app/app-routing.module'
import {SkeletonService} from './services/skeleton.service'
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common'

@NgModule({
  declarations: [
    ContentComponent,
    SkeletonComponent,

  ],
  imports: [
    CommonModule,
    UserModule,
    AppRoutingModule,
    DxScrollViewModule,
    DxButtonModule,
  ],
  exports: [
    ContentComponent,
    SkeletonComponent
  ],
  providers: [
    SkeletonService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ]
})
export class SkeletonAppModule { }
