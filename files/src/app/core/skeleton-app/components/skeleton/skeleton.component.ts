import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input, OnChanges,
  OnInit, SimpleChanges,
  ViewChild
} from '@angular/core'
import {SkeletonNavigationModel} from './skeleton.model'
import {DetectNetwork} from '../../utils/DetectNetwork'
import {flatMap, map} from 'rxjs/operators'
import {BehaviorSubject, interval, Observable, Subject} from 'rxjs'

import AppVersion from '@root/version.json'

import {HttpClient} from '@angular/common/http'
import {SkeletonService} from '@core/skeleton-app/services/skeleton.service'

export  type UID = string

type MethodDom = (...args: any[]) => any

export interface UserInfo {
  login: string
  name: string
  uid: UID
}

@Component({
  selector: 'wrapper-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent implements OnInit, OnChanges {

  @ViewChild('cnt', { static: true }) elCnt: ElementRef
  // имя приложения
  @Input() nameApp: string = ''
  // урл на иконку логотипа
  @Input() logoImg: string = ''
  // аерсия приложения по умолчанию устанавливается из файла version.json в корне приложения
  @Input() version: string = ''
  // имя отображаемое пользователя внизу боковой панели
  @Input() userName: string = ''
  // массив объектов главного меню
  @Input() navigationList: SkeletonNavigationModel = []

  @Input() sidebarDisabled: boolean
  @Input() isShowSidebar: boolean


  isSidebarDisabled: BehaviorSubject<boolean> = new BehaviorSubject(true)
  isShowNav$: BehaviorSubject<boolean>

  hasOnLine$: Observable<string>
  appVersion: string
  // Работа с полноэкранным режимом - перевод в полноэкранный режим, выход из полноэкранного режима, состояние
  // полноэкранного режима
  isSupportFullScreen: boolean = false
  isFullScreen$: BehaviorSubject<boolean>
  msgFullScreen$: BehaviorSubject<string>

  msgFullscreenOff: string = 'Полноэкранный режим'
  msgFullscreenOn: string = 'Выйти из полноэкранного режима'

  navigationMap: SkeletonNavigationModel
  filter: Array<object> = []
  isShowFilter: boolean = false
  filterPath: string
  activeItem: any
  lastNumber: any = null
  hasVisibleCnt$: BehaviorSubject<string>
  hasShowNav$: BehaviorSubject<string>

  constructor (
    private http: HttpClient,
    private SkeletonService: SkeletonService
  ) {
    this.nameApp = this.nameApp.trim()
    this.userName = this.userName.trim()
    this.version = this.version.trim()
    this.hasVisibleCnt$ = new BehaviorSubject('s-withNav')
    this.isFullScreen$ = new BehaviorSubject(false)
    this.msgFullScreen$ = new BehaviorSubject(this.msgFullscreenOff)
    this.isShowNav$ = new BehaviorSubject(this.isShowSidebar)
    this.hasShowNav$ = new BehaviorSubject('s-hide')





    let instanceIsShowFilter =  this.SkeletonService.getInstanceIsShowFilter()
    let instanceActiveItemFilter =  this.SkeletonService.getInstanceActiveItemFilter()

    console.log('this.version', this.version)
    instanceActiveItemFilter.subscribe({
      next: (v) => {
        this.activeItem = v
      }
    })

    instanceIsShowFilter.subscribe({
      next: (v) => {
        this.filter = v['menu']
        this.isShowFilter = v['isShow']
        this.filterPath = v['path']
        this.activeItem = v['activeItem']
      }

    })


    /**
     * Отображать контентную часть с панелью навигации(Sidebar) или без
     * @return string - css класс
     */
    this.isSidebarDisabled.subscribe(v => {
      console.log('this.isSidebarDisabled.subscribe', v)
      this.SkeletonService.setSidebarDisabled(v)
      if (v === false) {
        this.hasVisibleCnt$.next('s-fullscreen')
      } else {
        this.hasVisibleCnt$.next('s-withNav' )
      }
    })

    this.isFullScreen$.subscribe(v => {
      let status  = v === true ? this.msgFullscreenOn : this.msgFullscreenOff
      this.msgFullScreen$.next(status)
    })

    /*this.isShowNav$.subscribe(v => {
      console.log('isShowNav$', v)
      if (v) {
        this.hasShowNav$.next('s-show')
      } else {
        this.hasShowNav$.next('s-hide')
      }
    })*/

  }

  ngOnChanges (changes: SimpleChanges): void {
    if (changes.sidebarDisabled) {
      this.SkeletonService.setSidebarDisabled(!changes.sidebarDisabled.currentValue)
      this.isSidebarDisabled.next(!changes.sidebarDisabled.currentValue)
    }

    if (changes.isShowSidebar) {
      console.log('isShowSidebar', changes.isShowSidebar)

    }

    /*if (this.isShowSidebar === true || this.isShowSidebar === false)
     this.isShowNav$.next(this.isShowSidebar)*/
    this.isShowNav$.next(this.isShowSidebar)
  }




  ngOnInit (): void {



    console.log('isShowSidebar>>>>', this.isShowSidebar)
    this.isShowNav$.next(this.isShowSidebar)
    if (this.isShowSidebar === false) {
      this.isShowNav$.next(false)
      this.hasShowNav$.next('s-hide')
      this.hasVisibleCnt$.next('s-fullscreen')
    } else {
      this.isShowNav$.next(true)
      this.hasShowNav$.next('s-show')
      this.hasVisibleCnt$.next('s-withNav')
    }

    this.SkeletonService.setNameApp(this.nameApp)
    this.SkeletonService.setLogoApp(this.logoImg)
    this.SkeletonService.setVersionApp(this.version)




    this.onChangeScreen()
    this.isSupportFullScreen = this.getIsSupportFullScreen()
    this.handlerChangeFullScreen()

    this.appVersion = (this.version === undefined || !this.version ) ? AppVersion.version : this.version

    // состояние сети
    const network = new DetectNetwork()
    this.hasOnLine$ = network.statusNetwork$
      .pipe(map(value => {
        let status = value ? 's-online' : 's-offline'
        return status
      }))


    this.navigationMap = this.navigationList


    /**
     * Подготавливает ссылки для динамически формируемых ссылок, таких как помощь и тд
     * @param array
     * @return {Promise<void>}
     */
    async function prepareDinamicLinkForNavigationList (array: Array<any>): Promise<void> {
      for (const i of array) {
        if (i.data.isDinamic) {
          let req = `${HOST_API}${i.data.link}`
          const headers = {}
          const para = {}
          headers['Accept'] = 'application/json'
          headers['Content-Type'] = 'application/json'
          para['method'] = 'GET'
          para['credentials'] = 'include'
          para['headers'] = headers

          let res = await fetch(req, para)
          if (res.ok) {
            let d = await res.json()
            i.data.link = d['data']
          } else  i.data.isLinkNative = false
        }
      }
      console.log('Done!')
    }

    prepareDinamicLinkForNavigationList(this.navigationList)
  }

  // touch event для отображения sidebar
  showSidebar (): void {
    this.hasVisibleCnt$.next('s-withNav')
    this.isShowNav$.next(true)
    this.hasShowNav$.next('s-show')
  }
  hideSidebar (): void {
    this.hasVisibleCnt$.next('s-fullscreen')
    this.isShowNav$.next(false)
    this.hasShowNav$.next('s-hide')
  }


  /**
   * Возвращает метод перевода в полноэкранным режмом
   */
  getMethodFullScreen (): MethodDom {
    const d = window.document.body
    return d.requestFullscreen
  }
  /**
   * Выход из полноэкранного режима
   */
  exitFullScreen (): void {
    window.document.exitFullscreen && window.document.exitFullscreen()
  }

  /**
   * проверка на поддержку метода браузером превода в полноэкранный режим
   */
  getIsSupportFullScreen (): boolean {
    return (typeof this.getMethodFullScreen() === 'function')
  }

  /**
   * Наблюдатель за состоянием полноэкранного режима
   * устанавляевает свойство isFullScreen в true если режим включен и false если выключен
   */
  handlerChangeFullScreen (): void {
    const self = this
    window.onresize = (event) => {
      let maxHeight = window.screen.height
      let maxWidth = window.screen.width
      let curHeight = window.innerHeight
      let curWidth = window.innerWidth

      if (maxWidth === curWidth && maxHeight === curHeight) {
        self.isFullScreen$.next(true)
      } else {
        self.isFullScreen$.next(false)
      }
    }
  }

  getStatusFullScreen (): string {
    let status
    this.isFullScreen$.subscribe(v => {
      status = v
    })
    return status
  }
  /**
   * преключатель в полноэкранный режим и обратно
   */
  onToggleFullScreen (): void {
    const doc = window.document
    let statusFullScreen = this.getStatusFullScreen()

    if (!statusFullScreen) {
      this.getMethodFullScreen().call(doc.body)
      this.isFullScreen$.next(true)
    } else {
      this.exitFullScreen()
      this.isFullScreen$.next(false)
    }
  }



  // hendlers
  /**
   * Переключатель отображения навигации(sidebar)
   */
  onToggleNav (): void {


    console.log('CLICK', this.isShowNav$.value)
    let isShowNav = !this.isShowNav$.value
    console.log('CLICK!', isShowNav)
    let showNav = isShowNav === true ? 's-withNav' : 's-fullscreen'
    let showSidebar = isShowNav === true ? 's-show' : 's-hide'
    this.isShowNav$.next(isShowNav)
    this.hasVisibleCnt$.next(showNav)
    this.hasShowNav$.next(showSidebar)


  }

  /**
   * Обработчик изменения экрана
   * Обработка отображения sidebar с навигацией по  приложению
   */
  onChangeScreen (): void {
    let mql = window.matchMedia('screen and (min-width: 1024px)')
    // this.isShowNav = mql.matches
    this.isShowNav$.next(mql.matches)

    window.addEventListener('resize', (e) => {
      mql = window.matchMedia('screen and (min-width: 1024px)')
      // this.isShowNav = mql.matches
      this.isShowNav$.next(mql.matches)
    })
  }

}
