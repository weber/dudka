import {Routes} from '@angular/router'


export interface SkeletonNavigationModel extends Routes {
  data?: {
    title: string
    link?: string
    faIconName: string
    faIconColor: string
    placeholder: string
    hasMain: boolean
    visible: boolean
    isLinkNative: boolean
    targetLink?: string
  }
}

