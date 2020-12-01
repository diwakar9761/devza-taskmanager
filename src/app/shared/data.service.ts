import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  APIURL = 'https://devza.com/tests/tasks'
  constructor(
    private http: HttpClient
  ) { }
  
  // get all tasks list
  getTasksList(): Observable<any> {
    return this.http.get(this.APIURL + '/list');
  }

  // get all users list
  getUserslist(): Observable<any> {
    return this.http.get(this.APIURL + '/listusers');
  }

  // create new task
  createTask(data): Observable<any> {
    return this.http.post(this.APIURL + '/create', data);
  }

  // update new task
  updateTask(data): Observable<any> {
    return this.http.post(this.APIURL + '/update', data);
  }

  // delete task
  deleteTask(data): Observable<any> {
    return this.http.post(this.APIURL + '/delete', data);
  }

}
