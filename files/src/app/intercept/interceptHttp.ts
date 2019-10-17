import {Injectable} from '@angular/core'

import {Observable, throwError} from 'rxjs'
import {catchError, retry} from 'rxjs/operators'
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import {ToastitAlign, ToastitAnimation, ToastitService, ToastitType} from 'ngx-toastit'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor (
    private toastitService: ToastitService
  ) {}


  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = ''
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `${error.error.message}`
        } else {
          // server-side error
          errorMessage = `Код ошибки: ${error.status}\nОписание: ${error.message}`

          if (error.error) {
            errorMessage = error.error.errorMessage
          } else {
            errorMessage = error.status.toString()
           //  notify(`Ошибка - ${errorMessage}`, 'error', 5000)
          }
        }

        this.toastitService.add({
          title: 'Ошибка',
          message: errorMessage,
          type: ToastitType.Warning,
          timeout: 10005,
          align: ToastitAlign.BR,
          enterAnimation: ToastitAnimation.scaleIn,
          leaveAnimation: ToastitAnimation.fadeOut
        })
        console.error(`%c ${errorMessage}`, `background: red; color: #fff; padding: 3px 5px;`)
        return throwError(errorMessage)
      })
    )
  }
}
