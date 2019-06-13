import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UselessService {
  private factSubject = new BehaviorSubject<string>("");
  private factsList: string[];

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {}

  init() {
    if(!this.factsList) {
      this.storage.get('facts').then(data => {
        if(!data) {
          this.http.get(
            `http://${environment.serverIp}/facts`
          ).subscribe(response => {
            if(response['status'] === 'ok') {
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
  
  get facts() {
    return this.factSubject.asObservable();
  }

  newFact() {
    const f = this.factsList[Math.floor(Math.random()*this.factsList.length)];
    this.factSubject.next(f);
  }

}