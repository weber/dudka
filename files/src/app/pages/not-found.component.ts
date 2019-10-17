import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
  selector: 'not-found',
  template: `<div>The page you are looking for was not found</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {

}
