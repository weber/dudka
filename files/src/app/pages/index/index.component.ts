import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core'

import {
  ActivatedRoute
} from '@angular/router'

import {SkeletonService} from '@core/skeleton-app/services/skeleton.service'
import {GlobalService} from '@services/global.service'
import {environment} from '@env/environment'

export interface SelectBoxItem {
  name: string
  title: string
  value: string
  icon: string
}

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit {
  // Заголовок страницы
  title: string
  filterList: Array<SelectBoxItem> = [
    {
      name: 'Фильтер1',
      title: 'Фильтер1',
      value: 'filter1',
      icon: ''
    },
    {
      name: 'Фильтер2',
      title: 'Фильтер2',
      value: 'filter2',
      icon: 'fas fa-folder-open'
    },
    {
      name: 'Фильтер3',
      title: 'Фильтер3',
      value: 'filter3',
      icon: 'fas fa-bolt'
    },
  ]
  queryFilter: SelectBoxItem
  currentFilter: string

  constructor (
    private route: ActivatedRoute,
    private SkeletonService: SkeletonService
  ) {
  }

  ngOnInit (): void {
    this.title = this.route.snapshot.data.title
    let filter = {
      isShow: true,
      path: '',
      menu: []
    }

    let listFilter = this.filterList.map(i => {
      return {
        icon: i.icon,
        title: i.title,
        name: i.name,
        alias: i.value,
        handlerClick: (): void => {
          this.currentFilter = i.value
          this.SkeletonService.setActiveItemFilter(i.value)
          this.queryFilter = i
        }
      }
    })

    filter.menu = listFilter
    this.SkeletonService.setIsShowFilter(filter)
    this.SkeletonService.setActiveItemFilter(this.filterList[0].value)
  }
}
