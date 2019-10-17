import {enableProdMode} from '@angular/core'
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'

import {AppModule} from './app/app.module'
import {environment} from '@env/environment'

import {merge as RMerge} from 'ramda'

import 'reflect-metadata'


declare global {
  interface Window {
    [key: string]: any
  }
  interface XMLHttpRequest {
    [key: string]: any
  }
  const HOST_API: string
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



/**
 * возвращает настройки сервера из файла settings.json
 * в двух режимах в dev mode прямой импорт и в продакшене через ajax запрос
 * в режиме продакшен используются 2 конфига settings.json, appsettings.Production.json
 * приоритет имеет appsettings.Production.json
 * Если в appsettings.Production.json не указан какойто параметр он береться из settings.json
 *
 * @returns {Promise}
 */
async function getSettings (): Promise<any> {


  /**
   * Выполняются все промисы в случаи падения одного из них не вызывается исключение
   * @param t [{Promise}] - Массив промисов
   * @return {Promise}
   */
  const _allSettled = (t: any): Promise<any> => {
    const fulfilledFn = (t: any): object => {
      return {status: 'fulfilled', value: t}
    }
    const rejectedFn = (t: any): object  => {
      return {status: 'fulfilled', value: t}
    }
    return Promise.all(t.map((t: any): object => {
      return Promise.resolve(t)
        .then(fulfilledFn)
        .catch(rejectedFn)
    }))
  }

  if (!environment.production) {
    return environment.settings
  } else {
    const address = window.location.href.split('/#/')[0]

    const _getSettings = async (): Promise<any> => {
      let res = await fetch(`${address}/appsettings.json`)
      return await res.json()

    }
    const _getSettingsProduction = async (): Promise<any> => {
      let res = await fetch(`${address}/appsettings.Production.json`)
      return await res.json()
    }


    return _allSettled([
      _getSettings(),
      _getSettingsProduction()
    ])
      .then(values => {
        let settings = (values[0]['status'] !== 'fulfilled') ? {} : values[0]['value']
        let settingsProduction = (values[1]['status'] !== 'fulfilled') ? {} : values[1]['value']
        return Promise.resolve(RMerge(settings, settingsProduction))
      }, () => {
        return Promise.resolve(_getSettings())
      })
  }
}

getSettings()
  .then(r => {
    window.HOST_API = `${r.PROTOCOL}://${r.HOST_API}`

    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err))
  })
