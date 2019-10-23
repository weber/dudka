import {Injectable} from '@angular/core'

import {Observable, of, throwError} from 'rxjs'
import {catchError, delay, mergeMap, retry, retryWhen, take} from 'rxjs/operators'
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


  /**
   * Перехватчик ошибок запросов
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @return {Observable<HttpEvent<any>>}
   */
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error) => {
            return (error.status === 429) ? throwError(error) : of(error)
          }),
          delay(1000),
          take(2)
        )
      ),
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

          }
        }

        if (!errorMessage) {
          errorMessage = error.error
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
