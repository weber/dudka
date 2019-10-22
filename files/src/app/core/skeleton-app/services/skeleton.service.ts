import { Injectable, Directive } from '@angular/core'
import {BehaviorSubject, Subject} from 'rxjs'
import {isEmpty as RIsEmpty} from 'ramda'
import {HttpClient} from '@angular/common/http'

export interface SkeletonItemSubMenu {
  name: string
  alias: string
  handlerClick: (e: any) => {}
}

export type SkeletonSubMenu = Array<SkeletonItemSubMenu>

export interface SkeletonSubNav  {
  isShow: boolean
  path: string
  menu?: SkeletonSubMenu
}

@Injectable()
export class SkeletonService {

  defaultSkeletonSubNav: SkeletonSubNav

  public _sidebarDisabled: Subject<boolean>
  private sidebarDisabledResult: boolean

  private showFilterData: Subject<object>
  private activeItemFilter: Subject<object>

  private _nameApp: Subject<string>
  private nameAppResult: string

  private _logoApp: Subject<string>
  private logoAppResult: string

  private _versionApp: Subject<string>
  private versionAppResult: string

  private _userName: Subject<string>
  private usernameResult: string



  constructor (private http: HttpClient) {
    this.showFilterData = new Subject()
    this.activeItemFilter = new Subject()
    this._sidebarDisabled = new Subject()
    this._nameApp = new Subject()
    this._logoApp = new Subject()
    this._versionApp = new Subject()
    this._userName = new Subject()

    this.defaultSkeletonSubNav = {
      isShow: false,
      path: '!',
      menu: []
    }

    this._sidebarDisabled.subscribe({next: (v) => {
        this.sidebarDisabledResult = v
      }})

    this._nameApp.subscribe({next: (v) => {
        this.nameAppResult = v
      }})

    this._logoApp.subscribe({next: (v) => {
        this.logoAppResult = v
      }})

    this._versionApp.subscribe({next: (v) => {
        this.versionAppResult = v
      }})

    this._userName.subscribe({next: (v) => {
        this.usernameResult = v
      }})
  }

  /**
   * Устанавливает Имя пользователя
   * @param {string} v
   * @return {void}
   */
  setUserNameApp (v: string): void {
    this._userName.next(v)
  }

  /**
   * Возвращает объект Имя пользователя
   * @return {Subject<string>}
   */
  userName (): Subject<string>  {
    return this._userName
  }

  /**
   * Возвращает Имя пользователя
   * @return {string}
   */
  getUserName (): string  {
    return this.usernameResult
  }


  /**
   * Устанавливает версию приложения
   * @param {string} v
   * @return {void}
   */
  setVersionApp (v: string): void {
    this._versionApp.next(v)
  }

  /**
   * Возвращает объект версии приложения
   * @return {Subject<string>}
   */
  versionApp (): Subject<string>  {
    return this._versionApp
  }

  /**
   * Возвращает версию приложения
   * @return {string}
   */
  getVersionApp (): string  {
    return this.versionAppResult
  }

  /**
   * Устанавливает логотип приложения
   * @param {string} v
   * @return {void}
   */
  setLogoApp (v: string): void {
    this._logoApp.next(v)
  }

  /**
   * Возвращает объект логотипа приложения
   * @return {Subject<string>}
   */
  logoApp (): Subject<string>  {
    return this._logoApp
  }

  /**
   * Возвращает логитип приложения
   * @return {string}
   */
  getLogoApp (): string  {
    return this.logoAppResult
  }


  /**
   * Устанавливает имя приложения
   * @param {string} v
   * @return {void}
   */
  setNameApp (v: string): void {
    this._nameApp.next(v)
  }

  /**
   * Возвращает объект имени приложения
   * @return {Subject<string>}
   */
  nameApp (): Subject<string>  {
    return this._nameApp
  }

  /**
   * Возвращает имя приложения
   * @return {string}
   */
  getNameApp (): string  {
    return this.nameAppResult
  }

  /**
   * Отключения SideBar
   * @param {boolean} v
   */
  setSidebarDisabled (v: boolean): void {
    this._sidebarDisabled.next(v)
  }

  /**
   * Возвращает объект отключения sidebar
   * @return {Subject<boolean>}
   */
  sidebarDisabled (): Subject<boolean>  {
    return this._sidebarDisabled
  }

  /**
   * Возвращает состояние - отключение sidebar
   * @return {boolean}
   */
  getSidebarDisabled (): boolean  {
    return this.sidebarDisabledResult
  }

  /**
   * Устанавливает активный фильтр
   * @param val
   */
  setActiveItemFilter (val: any): void {
    this.activeItemFilter.next(val)
  }

  /**
   * Возвращает объект активации фильтра
   * @return {Subject<object>}
   */
  getInstanceActiveItemFilter (): Subject<object> {
    return this.activeItemFilter
  }

  /**
   * устанавливает состояние отображение фильтра
   * @param val
   * @return {void}
   */
  setIsShowFilter (val: any): void {
    if (RIsEmpty(val)) {
      this.showFilterData.next(this.defaultSkeletonSubNav)
    } else {
      this.showFilterData.next(val)
    }
  }

  /**
   * Возвращает объект состояние отображение фильтра
   * @return {Subject<object>}
   */
  getInstanceIsShowFilter (): Subject<object> {
    return this.showFilterData
  }

}
