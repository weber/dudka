import {enableProdMode} from '@angular/core'
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'

import {AppModule} from './app/app.module'
import {environment} from '@env/environment'

import {merge as RMerge} from 'ramda'

import 'reflect-metadata'
import {getSettings} from '@core/getSettings'

declare global {
  interface Window {
    [key: string]: any
  }
  interface XMLHttpRequest {
    [key: string]: any
  }
  const HOST_API: string
  const HELP_LINK: string
}



declare var XMLHttpRequest: (args: any) => any

if (environment.production) {
  enableProdMode()
}
// ------------------------------------------------------------------------------------------
// читаем настройки приложения
window['HOST_API'] = ''
// monkey patching
let xp = XMLHttpRequest.prototype

XMLHttpRequest = (args): any => {
  let obj = new xp.constructor(args)
  obj.withCredentials = true
  return obj
}
XMLHttpRequest.prototype = xp
// ------------------------------------------------------------------------------------------

getSettings()
  .then(r => {
    window.HOST_API = `${r.PROTOCOL}://${r.HOST_API}`
    window.HELP_LINK = r.HELP_LINK

    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err))
  })
