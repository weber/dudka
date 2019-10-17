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

  setUserNameApp (v: string): void {
    this._userName.next(v)
  }

  userName (): Subject<string>  {
    return this._userName
  }

  getUserName (): string  {
    return this.usernameResult
  }


  setVersionApp (v: string): void {
    this._versionApp.next(v)
  }

  versionApp (): Subject<string>  {
    return this._versionApp
  }

  getVersionApp (): string  {
    return this.versionAppResult
  }

  setLogoApp (v: string): void {
    this._logoApp.next(v)
  }

  logoApp (): Subject<string>  {
    return this._logoApp
  }

  getLogoApp (): string  {
    return this.logoAppResult
  }


  setNameApp (v: string): void {
    this._nameApp.next(v)
  }

  nameApp (): Subject<string>  {
    return this._nameApp
  }

  getNameApp (): string  {
    return this.nameAppResult
  }

  setSidebarDisabled (v: boolean): void {
    this._sidebarDisabled.next(v)
  }

  sidebarDisabled (): Subject<boolean>  {
    return this._sidebarDisabled
  }
  getSidebarDisabled (): boolean  {
    return this.sidebarDisabledResult
  }

  setActiveItemFilter (val: any): void {
    this.activeItemFilter.next(val)
  }

  getInstanceActiveItemFilter (): Subject<object> {
    return this.activeItemFilter
  }

  setIsShowFilter (val: any): void {
    if (RIsEmpty(val)) {
      this.showFilterData.next(this.defaultSkeletonSubNav)
    } else {
      this.showFilterData.next(val)
    }
  }

  getInstanceIsShowFilter (): Subject<object> {
    return this.showFilterData
  }

}
