import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mainPort } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  
  constructor(private http: HttpClient) { }

  login(data: any, endpoint: string) {
    console.log("got it")
    //return this.http.post(mainPort + '/API-hardware-trading/' + endpoint, data.getRawValue());
  }
}
