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
    return this.http.post(mainPort + '/halifax/api-halifax/main/' + endpoint, data.getRawValue());
  }

  fetchData(endpoint: string) {
    return this.http.get(mainPort + '/halifax/api-halifax/main/' + endpoint);
  }

  postData(data: any, endpoint: string) {
    return this.http.post(mainPort + '/halifax/api-halifax/main/' + endpoint, data);
  }

  patchData(data: any, endpoint: string) {
    return this.http.patch(mainPort + '/halifax/api-halifax/main/' + endpoint, data);
  }

  deleteData(endpoint: string) {
    return this.http.delete(mainPort + '/halifax/api-halifax/main/' + endpoint);
  }
}
