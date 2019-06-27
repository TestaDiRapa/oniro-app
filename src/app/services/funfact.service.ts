import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * This service can retrieve all the fun facts on sleep from the server 
 * and storing them in the device local storage.
 */
@Injectable({
  providedIn: 'root'
})
export class FunFactService {
  private factSubject = new BehaviorSubject<string>('');
  private factsList: string[];

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  /**
   * The init functioncs checks if there are any facts in the local storage. If not, it
   * will connect to the server and retrieve them
   */
  init() {
    if (!this.factsList) {
      this.storage.get('facts').then(data => {
        if (!data) {
          this.http.get(
            `http://${environment.serverIp}/facts`
          ).subscribe(response => {
            if (response['status'] === 'ok') {
              this.factsList = response['payload'];
              this.storage.set('facts', JSON.stringify(this.factsList));
            }
          })
        } else {
          this.factsList = JSON.parse(data);
        }
      })
    }
  }

  /**
   * This function returns a fact
   * @return {Observable<string>} an observable on the facts
   */
  get facts() {
    return this.factSubject.asObservable();
  }

  /**
   * This function chooses a random fact from the list and updates the observable
   */
  newFact() {
    if (this.factsList.length > 0) {
      const f = this.factsList[Math.floor(Math.random() * this.factsList.length)];
      this.factSubject.next(f);
    }
  }

}