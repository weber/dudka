import {Directive, ElementRef, HostListener, Injectable} from '@angular/core'
import {Router} from '@angular/router'

@Injectable({providedIn: 'root'})
@Directive({
  selector: 'a[appExternalUrl]'
})

export class ExternalUrlDirective  {
  constructor (private el: ElementRef, private router: Router) {}

  /**
   * clicked
   * @param {Event} event
   * @return {any}
   */
  @HostListener('click', ['$event'])
  clicked (event: Event): any {
    const url = this.el.nativeElement.href
    if (!url) return

    this.router.navigate(['/externalRedirect', {externalUrl: url}], {
      skipLocationChange: true
    })
    event.preventDefault()
  }
}
