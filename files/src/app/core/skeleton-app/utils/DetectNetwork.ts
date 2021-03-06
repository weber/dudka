import {Subject} from 'rxjs'

export class DetectNetwork {
  isOnline: boolean = false
  stateNetwork: Array<string> = ['online', 'offline', 'load']
  statusNetwork$: Subject<boolean>

  constructor () {
    this.statusNetwork$ = new Subject()
    this.stateNetwork.forEach(event => window.addEventListener(event, this.updateOnlineStatus.bind(this)))
    // this.updateOnlineStatus()
  }


  /**
   * Метод наблюдатель за состоянием сети
   * @return {void}
   */
  updateOnlineStatus (): void {
    this.isOnline = navigator.onLine || false
    this.statusNetwork$.next(this.isOnline)
  }
}
