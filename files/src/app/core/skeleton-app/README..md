# Модуль Skeleton-app это каркас приложения
Служит для быстрого построения каркаса приложения, контентной части и
левой боковой панели. 

Левая боковая панель имеет возможность размещать. 
1. Название приложения
2. Главное меню 
3. Доп.раздел(он же разделитель) 
4. также имеет возможность переводить приложение в полноэкранный режим
5. информация о пользователе
6. информация о статусе сети 
7. версия приложения

Контентная часть содержит 
1. шапку приложения 
2. контентная часть

## Шапка приложения 
Шапка сделана методом наложения, есть основная часть шаки зафиксированя
на верхней части экрана, в которой расположена кнопка отображения
бокового меню. И дополнительная часть которая размещается поверх через
комопонент контента. Сделано это для возможности гибкой настройки
отображения шапки.


В своем составе имеет модуль имеет 2 компонента
1. wrapper-skeleton 
2. wrapper-content

Также имеет свой state и service для работы с информацией о
пользователе.


## Использование
 [https://hammerjs.github.io/](hammerjs)
```
$ npm i --save module-alias hammerjs
```

```
// tsconfig.json
"paths": {
      "jszip": [
        "./node_modules/jszip/dist/jszip.min.js"
      ],
      "@core/*": ["src/app/core/*"],
      "@app/*": ["src/app/*"],
      "@root/*": ["src/*"],
      "@module/*": ["src/app/modules/*"],
      "@component/*": ["src/app/components/*"],
      "@env/*": ["src/environments/*"]
    }
```

```
//app.module.ts
import 'hammerjs';
```


```
// app.module.ts
...
import {SkeletonAppModule} from "skeleton-app/skeleton-app.module";
...

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ExecutionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLocalizeModule,
    HttpClientModule,
    SkeletonAppModule,  // <- устанавливаем
    StoreModule.forRoot({}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})

```

```
// app.component.ts
...
import {SkeletonNavigationModel} from "skeleton-app/components/skeleton/skeleton.model";
...

export class AppComponent implements OnInit{

  // массив объектов главного меню
  navigationList: SkeletonNavigationModel;
  
  constructor () {


    this.navigationList = [
      {
        id: 1,
        title: 'Редактирование',
        link: '/editor',
        faIconName: 'fa-edit',
        faIconColor: '#ffe764'
      },
      {
        id: 2,
        title: 'Исполнение',
        link: '/execution',
        isLinkNative: false,
        faIconName: 'fa-dice-d6',
        faIconColor: '#4bc7fd'
      },
      {
        id: 2,
        title: 'Справка',
        link: 'https://google.ru',
        isLinkNative: true,
        targetLink: '_blank',
        faIconName: 'fa-question-circle',
        faIconColor: '#fff'
      }
    ]


  }
 }
```

``` 
// app.component.html
<wrapper-skeleton
  nameApp="Жу2П" <- Имя приложения
  version="1.2.3" <- Версия приложения (не обязательный, берется из app/version.json) 
  userName="ваше имя" <- имя пользователя (не обязательный, берется из запроса к серверу)
  [navigationList]="navigationList" <- массив объектов меню
>
  <ng-container  nav></ng-container>   // <- необязательный контейнер, доп. часть

  <ng-container  body>
    <router-outlet></router-outlet>
  </ng-container>

</wrapper-skeleton>
```

[pagename].component.html - Компонент страницы 
``` 
// [yourpagename].component.html
<wrapper-content titleHeader="Редактирование">
  <div header>  // <- контейнер шапки страницы и его содержимое имеет прокрутку
    <ul>
      <li>Онас</li>
      <li>Главная</li>
    </ul>
  </div>
  <div header-cnt-right>  // <- контейнер шапки(доп. размещение с правой стороны) 
  </div>
  <div body>  // <- контейнер контента и его содержимое
    editor works!
  </div>
</wrapper-content>
```
