import {environment} from '@env/environment'
import {merge as RMerge} from 'ramda'


/**
 * возвращает настройки сервера из файла settings.json
 * в двух режимах в dev mode прямой импорт и в продакшене через ajax запрос
 * в режиме продакшен используются 2 конфига settings.json, appsettings.Production.json
 * приоритет имеет appsettings.Production.json
 * Если в appsettings.Production.json не указан какойто параметр он береться из settings.json
 */
export async function getSettings (): Promise<any> {

  /**
   * Выполняются все промисы в случаи падения одного из них не вызывается исключение
   * @param t [{Promise}] - Массив промисов
   * @return {Promise}
   */
  const _allSettled = (t) => {
    const fulfilledFn = (t) => {
      return {status: 'fulfilled', value: t}
    }
    const rejectedFn = (t) => {
      return {status: 'fulfilled', value: t}
    }
    return Promise.all(t.map(t => {
      return Promise.resolve(t).then(fulfilledFn).catch(rejectedFn)
    }))
  }

  if (!environment.production) {
    return environment.settings
  } else {
    const address = window.location.href.split('/#/')[0]

    const _getSettings = async () => {
      let res = await fetch(`${address}/appsettings.json`)
      return await res.json()

    }
    const _getSettingsProduction = async () => {
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
      }, reason => {
        return Promise.resolve(_getSettings())
      })
  }
}
