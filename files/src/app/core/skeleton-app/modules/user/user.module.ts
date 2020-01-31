import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {HttpClientModule} from '@angular/common/http'
import { StoreModule } from '@ngrx/store'
import {EffectsModule} from '@ngrx/effects'
import {reducers, metaReducers} from './state/reducers'
import {UserEffect} from './state/effects'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('UserStore', reducers, { metaReducers }),
    EffectsModule.forFeature([UserEffect]),
  ],
  exports: []
})
export class UserModule { }
