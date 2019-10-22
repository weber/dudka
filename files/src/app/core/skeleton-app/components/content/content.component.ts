import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core'
import {SkeletonService} from '@core/skeleton-app/services/skeleton.service'
import {Observable, Subject} from 'rxjs'
import {DetectNetwork} from '@core/skeleton-app/utils/DetectNetwork'
import {map} from 'rxjs/operators'

@Component({
  selector: 'wrapper-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit {

  @ViewChild('contentHeaderBodyRight', { static: true }) contentHeaderBodyRight: any
  @Input() titleHeader: string = ''
  @Input() hasScrollCnt: boolean = false
  sidebarDisabled: Subject<boolean>
  isSidebarDisabled: boolean = false
  nameApp: string
  versionApp: string
  logoImg: string
  nameUser$: Subject<string>
  hasOnLine$: Observable<string>
  nameUser: string = ''
  hasShowInfo: boolean = false

  constructor (
    private SkeletonService: SkeletonService
  ) {
    this.titleHeader = this.titleHeader.trim()
    this.nameApp =  SkeletonService.getNameApp()
    this.logoImg =  SkeletonService.getLogoApp()
    this.versionApp =  SkeletonService.getVersionApp()
    this.nameUser$ =  SkeletonService.userName()

    this.nameUser$.subscribe(v => {
      this.nameUser = v
    })

    // состояние сети
    const network = new DetectNetwork()
    this.hasOnLine$ = network.statusNetwork$
      .pipe(map(value => {
        let status = value ? 's-online' : 's-offline'
        return status
      }))

    this.sidebarDisabled =  SkeletonService.sidebarDisabled()
    this.isSidebarDisabled = SkeletonService.getSidebarDisabled()
    this.sidebarDisabled.subscribe({
      next: (v) => {
        this.isSidebarDisabled = v
      }
    })
  }

  /**
   * OnInit
   * @return {void}
   */
  ngOnInit (): void {
    this.hasChildNode()
  }

  /**
   * Триггер отображения информации о пользователе
   * @return {void}
   */
  onShowInfo (): void {
    this.hasShowInfo = !this.hasShowInfo
  }

  /**
   * Триггер скрытия  информации о пользователе
   * @return {void}
   */
  onHideInfo (): void {
    this.hasShowInfo = false
  }

  /**
   * Добавляет css класс отображение или сокрытия для  правого слота в хедере если в нем есть
   * ли дочерние элементы
   * @return {void}
   */
  hasChildNode (): void {
    if (this.contentHeaderBodyRight.nativeElement.childNodes[0].childNodes.length > 0) {
      this.contentHeaderBodyRight.nativeElement.classList.add('s-show')
    } else {
      this.contentHeaderBodyRight.nativeElement.classList.add('s-hide')
    }
  }
}
