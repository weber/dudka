import {NgModule, LOCALE_ID} from '@angular/core'
import {locale, loadMessages} from 'devextreme/localization'
import 'devextreme-intl'
import * as messagesRu from 'devextreme/localization/messages/ru.json'

import {registerLocaleData} from '@angular/common'
import localeRu from '@angular/common/locales/ru'

loadMessages(messagesRu)

registerLocaleData(localeRu, 'ru')
locale(navigator.language)

@NgModule({
  imports: [],
  exports: [],
  providers: [
    {provide: LOCALE_ID, useValue: 'ru'}
  ]
})
export class AppLocalizeModule {
}



